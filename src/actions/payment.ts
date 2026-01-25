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
 * Strictly observational - checks the database status which is updated via Webhook.
 */
export async function verifyOrderPayment(reference: string) {
  const session = await requireAuth();

  if (!reference) throw new Error("Reference is required");

  try {
    // 1. Find the order associated with this reference
    const payment = await prisma.payment.findFirst({
      where: { reference },
      include: { order: true }
    });

    // If payment record exists, check order status
    if (payment && payment.order.userId === session.user.id) {
       return { 
         success: payment.order.status === "PAID", 
         orderId: payment.orderId,
         status: payment.order.status 
       };
    }

    // 2. Fallback: Lookup orderId from transaction metadata if payment record doesn't exist yet
    // This allows the UI to resolve the orderId even if the webhook is mid-process.
    const verification = await ApiService.paystack.verifyTransaction(reference);
    
    if (verification.status) {
      const orderId = (verification.data.metadata as { orderId?: string })?.orderId;
      if (orderId) {
        const order = await prisma.order.findUnique({
          where: { id: orderId }
        });
        
        if (order && order.userId === session.user.id) {
          return { 
            success: order.status === "PAID", 
            orderId,
            status: order.status 
          };
        }
      }
    }

    return { success: false, status: "PENDING" };
  } catch (error) {
    console.error("Payment verification UX error:", error);
    return { success: false, error: "Unable to verify payment status." };
  }
}
