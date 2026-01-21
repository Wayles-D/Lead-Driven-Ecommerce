import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/paystack";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-paystack-signature");
  if (!signature) {
    return new NextResponse("Missing signature", { status: 400 });
  }

  const payload = await req.json();

  if (!verifyWebhookSignature(signature, payload)) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  const event = payload.event;
  const data = payload.data;

  // Handle charge.success
  if (event === "charge.success") {
    const reference = data.reference; // This matches Order ID usually, or we mapped it
    // IMPORTANT: Verify amount matches expected
    // For now assuming reference == Order ID. In production use custom fields metadata if needed.
    const orderId = data.metadata?.orderId || reference;

    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId }
        });

        if (!order) {
             console.error(`Order ${orderId} not found for webhook`);
             return new NextResponse("Order not found", { status: 404 });
        }
        
        // Check if already paid to handle idempotency
        if (order.status === "PAID") {
            return new NextResponse("Order already paid", { status: 200 });
        }
        
        // Verify amount (Paystack sends kobo, our DB has naira - wait, DB has Naira INT?)
        // Let's check Schema or previous Logic.
        // Product price is INT. order.totalAmount is INT.
        // initializePayment multiplied by 100.
        // So Paystack returns kobo.
        const expectedAmountKobo = order.totalAmount * 100;
        if (data.amount !== expectedAmountKobo) {
             console.error(`Amount mismatch: Expected ${expectedAmountKobo}, got ${data.amount}`);
             // Depending on policy, might flag manual review. For now, fail it.
             return new NextResponse("Amount mismatch", { status: 400 });
        }

        await prisma.$transaction([
            prisma.order.update({
                where: { id: orderId },
                data: { status: "PAID" }
            }),
            prisma.payment.create({
                data: {
                    orderId: orderId,
                    provider: "paystack",
                    reference: data.reference,
                    status: "SUCCESS",
                    amount: order.totalAmount, // Storing in Naira as per schema convention so far
                    paidAt: new Date(data.paid_at),
                }
            })
        ]);

        return new NextResponse("Payment processed", { status: 200 });

    } catch (error) {
        console.error("Webhook processing error", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
  }

  return new NextResponse("Event ignored", { status: 200 });
}
