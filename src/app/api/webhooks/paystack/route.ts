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
      const { reference, amount, paid_at } = event.data;
      const orderId = event.data.metadata?.orderId;

      if (!orderId) {
        console.error("No orderId in metadata");
        return new NextResponse("No orderId", { status: 400 });
      }

      console.log(`✅ Webhook: Payment success for Order ${orderId}`);

      // Update Order and create Payment record in a transaction
      await prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
          where: { id: orderId },
          include: { user: true }
        });

        if (!order) {
            console.error(`❌ Webhook Error: Order ${orderId} not found`);
            throw new Error(`Order ${orderId} not found`);
        }

        // 1. Amount Verification (Critical for production)
        const expectedAmountKobo = order.totalAmount * 100;
        if (Math.abs(amount - expectedAmountKobo) > 1) { // Allowing tiny decimal mismatch if any
            console.error(`❌ Webhook Error: Amount mismatch for Order ${orderId}. Expected ${expectedAmountKobo}, got ${amount}`);
            throw new Error("Amount mismatch");
        }

        if (order.status === "PAID") return; // Already processed

        // 2. Update Order status
        await tx.order.update({
          where: { id: orderId },
          data: { status: "PAID" },
        });

        // 3. Create/Update Payment record
        await tx.payment.upsert({
          where: { orderId: orderId },
          update: {
            status: "SUCCESS",
            paidAt: new Date(paid_at),
            amount: amount / 100, // Store in major units
            reference: reference, // Ensure it's the actual reference from Paystack
          },
          create: {
            orderId: orderId,
            provider: "paystack",
            reference: reference,
            status: "SUCCESS",
            amount: amount / 100,
            paidAt: new Date(paid_at),
          },
        });

        // 4. Trigger Email (Inside transaction flow to guarantee it happens with the status change)
        if (order.user.email) {
          await EmailService.sendOrderConfirmation(order.user.email, orderId, order.totalAmount);
          console.log(`📧 Email triggered for Order ${orderId}`);
        }
      });
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("❌ Paystack Webhook Error:", error);
    return new NextResponse("Webhook error", { status: 500 });
  }
}
