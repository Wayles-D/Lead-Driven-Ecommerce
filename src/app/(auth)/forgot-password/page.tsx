import { Suspense } from "react";
import { Metadata } from "next";
import { AuthController } from "../login/AuthController";

export const metadata: Metadata = {
  title: "Forgot Password | OML Soles",
  description: "Recover your account access.",
};

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center">Loading...</div>}>
      <AuthController defaultMode="forgot" />
    </Suspense>
  );
}
