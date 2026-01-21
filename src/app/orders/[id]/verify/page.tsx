import { verifyTransaction } from "@/lib/paystack";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

interface VerifyPageProps {
  params: {
    id: string;
  };
  searchParams: {
    reference?: string;
  };
}

export default async function VerifyPaymentPage({ params, searchParams }: VerifyPageProps) {
  const reference = searchParams.reference;

  if (!reference) {
    // If no reference, just go to success page (maybe they manually navigated)
    redirect(`/orders/${params.id}/success`);
  }

  try {
    const verification = await verifyTransaction(reference);

    if (verification.status && verification.data.status === "success") {
        // Double check amount matches
        // Update DB if not already PAID
        const order = await prisma.order.findUnique({ where: { id: params.id } });
        
        if (order && order.status !== "PAID") {
             // Basic amount check
             if (verification.data.amount === order.totalAmount * 100) {
                 await prisma.$transaction([
                    prisma.order.update({
                        where: { id: params.id },
                        data: { status: "PAID" }
                    }),
                    prisma.payment.create({
                        data: {
                            orderId: params.id,
                            provider: "paystack",
                            reference: reference,
                            status: "SUCCESS",
                            amount: order.totalAmount,
                            paidAt: new Date(verification.data.paid_at || new Date()),
                        }
                    })
                ]);
             }
        }
    }
  } catch (error) {
    console.error("Verification error", error);
    // Even if error, redirect to success page which will show "UNPAID" if it failed, or "PAID" if webhook caught it
  }

  redirect(`/orders/${params.id}/success`);
}
