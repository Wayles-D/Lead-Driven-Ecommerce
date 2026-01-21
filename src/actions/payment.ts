"use server";

import { requireAuth } from "@/lib/utils/session";
import { prisma } from "@/lib/prisma";
import { initializePayment } from "@/lib/paystack";
import { redirect } from "next/navigation";

export async function initiateCheckoutPayment(orderId: string) {
  const session = await requireAuth();

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
      const paystackResponse = await initializePayment(email, order.totalAmount, order.id);
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
