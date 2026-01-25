"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOrderPayment } from "@/actions/payment";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";

interface PaymentVerificationStatusProps {
  orderId: string;
}

export function PaymentVerificationStatus({ orderId }: PaymentVerificationStatusProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") || undefined;
  
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState("Verifying your payment with Paystack...");

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 5;
    
    const checkStatus = async () => {
      attempts++;
      try {
        const result = await verifyOrderPayment(orderId, reference);
        
        if (result.success) {
          setStatus("success");
          setMessage("Payment successful! Redirecting to your order...");
          setTimeout(() => {
            router.push(`/orders/${orderId}/success`);
          }, 2000);
        } else if (attempts < maxAttempts) {
          // Keep polling
          setTimeout(checkStatus, 3000);
        } else {
          setStatus("error");
          setMessage("Verification timed out. If your payment was successful, it will be updated shortly.");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        setMessage("An error occurred while verifying your payment.");
      }
    };

    checkStatus();
  }, [orderId, router, reference]);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-card rounded-3xl border border-border shadow-xl">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-6"
      >
        {status === "verifying" && (
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
        )}
        {status === "success" && (
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        )}
        {status === "error" && (
          <XCircle className="w-16 h-16 text-red-500" />
        )}
      </motion.div>
      
      <h2 className="text-2xl font-bold mb-2">
        {status === "verifying" ? "Verifying Payment" : status === "success" ? "Payment Confirmed" : "Verification Failed"}
      </h2>
      <p className="text-muted-foreground font-medium max-w-xs">{message}</p>
      
      {status === "error" && (
        <button
          onClick={() => router.push(`/orders/${orderId}`)}
          className="mt-8 px-6 py-2 bg-primary text-primary-foreground rounded-full font-bold text-sm"
        >
          View Order
        </button>
      )}
    </div>
  );
}
