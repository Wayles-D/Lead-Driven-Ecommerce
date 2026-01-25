import { NextRequest, NextResponse } from "next/server";
import { ApiService } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { EmailService } from "@/lib/email";

/**
 * Paystack Webhook Route
 * 
 * Securely handles high-confidence payment events directly from Paystack.
 */
export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-paystack-signature");
  
  if (!signature) {
    return new NextResponse("No signature provided", { status: 401 });
  }

  // Get raw body for signature verification
  const rawBody = await req.text();

  try {
    const isValid = ApiService.paystack.verifyWebhookSignature(signature, rawBody);
    
    if (!isValid) {
      console.warn("⚠️ Invalid Paystack signature received");
      return new NextResponse("Invalid signature", { status: 401 });
    }

    const event = JSON.parse(rawBody);

    // Only handle successful charges for now
    if (event.event === "charge.success") {
      const { reference, amount, paid_at, customer } = event.data;
      const orderId = event.data.metadata?.orderId || reference;

      console.log(`✅ Webhook: Payment success for Order ${orderId}`);

      // Update Order and create Payment record in a transaction
      await prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
          where: { id: orderId },
          include: { user: true }
        });

        if (!order) {
            console.error(`❌ Webhook Error: Order ${orderId} not found`);
            return;
        }

        if (order.status === "PAID") return; // Already processed

        // 1. Update Order status
        await tx.order.update({
          where: { id: orderId },
          data: { status: "PAID" },
        });

        // 2. Create/Update Payment record
        await tx.payment.upsert({
          where: { orderId: orderId },
          update: {
            status: "SUCCESS",
            paidAt: new Date(paid_at),
            amount: amount, // Amount is in Kobo from Paystack
          },
          create: {
            orderId: orderId,
            provider: "paystack",
            reference: reference,
            status: "SUCCESS",
            amount: amount,
            paidAt: new Date(paid_at),
          },
        });

        // 3. Trigger Email (Non-blocking but inside transaction logic to ensure context)
        if (order.user.email) {
          await EmailService.sendOrderConfirmation(order.user.email, orderId, order.totalAmount);
        }
      });
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("❌ Paystack Webhook Error:", error);
    return new NextResponse("Webhook error", { status: 500 });
  }
}
