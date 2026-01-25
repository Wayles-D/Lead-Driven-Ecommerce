import { PaymentVerificationStatus } from "@/components/payment/PaymentVerificationStatus";
import { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Verifying Payment | OML Soles",
  description: "Please wait while we verify your payment.",
};

/**
 * Static verification page for Paystack.
 * Wrapped in Suspense because PaymentVerificationStatus uses useSearchParams.
 */
export default function VerifyPaymentPage() {
  return (
    <div className="container mx-auto px-4 min-h-[70vh] flex items-center justify-center py-20">
      <div className="w-full max-w-md">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center p-8 text-center bg-card rounded-3xl border border-border shadow-xl">
             <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
             <h2 className="text-2xl font-bold mb-2">Preparing Verification</h2>
             <p className="text-muted-foreground font-medium max-w-xs">Initializing secure connection...</p>
          </div>
        }>
          <PaymentVerificationStatus />
        </Suspense>
      </div>
    </div>
  );
}
