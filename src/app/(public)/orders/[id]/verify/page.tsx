import { PaymentVerificationStatus } from "@/components/payment/PaymentVerificationStatus";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verifying Payment | OML Soles",
  description: "Please wait while we verify your payment.",
};

interface VerifyPageProps {
  params: {
    id: string;
  };
}

export default function VerifyPaymentPage({ params }: VerifyPageProps) {
  return (
    <div className="container mx-auto px-4 min-h-[70vh] flex items-center justify-center py-20">
      <div className="w-full max-w-md">
        <PaymentVerificationStatus orderId={params.id} />
      </div>
    </div>
  );
}
