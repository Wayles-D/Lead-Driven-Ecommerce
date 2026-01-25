"use server";

import { requireAuth } from "@/lib/utils/session";
import { prisma } from "@/lib/prisma";
import { ApiService } from "@/lib/api";
import { redirect } from "next/navigation";
import { rateLimit } from "@/lib/rate-limit";

export async function initiateCheckoutPayment(orderId: string) {
  const session = await requireAuth();

  // Rate limiting: 3 requests per minute
  const limiter = await rateLimit({ limit: 3, windowMs: 60 * 1000, identifier: "payment-init" });
  if (!limiter.success) throw new Error(limiter.error);

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  if (order.status !== "UNPAID") {
    // If already paid, redirect to success
    if (order.status === "PAID") {
       redirect(`/orders/${orderId}/success`);
    }
    throw new Error("Order is not eligible for payment");
  }

  // Use user's email or a fallback if not present (should be present for auth users)
  const email = order.user.email;
  if (!email) {
      throw new Error("User email is required for payment");
  }

  try {
      const paystackResponse = await ApiService.paystack.initializePayment(email, order.totalAmount, order.id);
      if (paystackResponse.status) {
          return { url: paystackResponse.data.authorization_url };
      } else {
          throw new Error(paystackResponse.message);
      }
  } catch (error) {
      console.error("Payment initialization error:", error);
      throw new Error("Failed to initialize payment");
  }
}

/**
 * Verifies a payment status for a specific transaction reference.
 * Checks DB first (updated by webhook), then falls back to Paystack API.
 */
export async function verifyOrderPayment(reference: string) {
  const session = await requireAuth();

  if (!reference) throw new Error("Reference is required");

  try {
    // 1. Proactive check against Paystack API
    const verification = await ApiService.paystack.verifyTransaction(reference);
    
    if (verification.status && verification.data.status === "success") {
      const orderId = (verification.data.metadata as any)?.orderId;
      if (!orderId) throw new Error("Order ID not found in transaction metadata");

      const order = await prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!order) throw new Error("Order not found");
      if (order.userId !== session.user.id) throw new Error("Unauthorized");

      // 2. Update DB if not already marked PAID
      if (order.status !== "PAID") {
        await prisma.$transaction(async (tx) => {
          await tx.order.update({
            where: { id: orderId },
            data: { status: "PAID" },
          });

          await tx.payment.upsert({
            where: { orderId: orderId },
            update: { 
                status: "SUCCESS", 
                paidAt: new Date(), 
                amount: verification.data.amount / 100 
            },
            create: {
              orderId,
              provider: "paystack",
              reference: verification.data.reference,
              status: "SUCCESS",
              amount: verification.data.amount / 100,
              paidAt: new Date(),
            }
          });
        });
      }

      return { success: true, orderId };
    }

    return { success: false, status: verification.data.status };
  } catch (error) {
    console.error("Payment verification error:", error);
    return { success: false, error: "Unable to verify payment at this moment." };
  }
}
