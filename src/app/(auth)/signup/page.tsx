import { Suspense } from "react";
import { Metadata } from "next";
import { AuthController } from "../login/AuthController";

export const metadata: Metadata = {
  title: "Create Account | OML Soles",
  description: "Join OML Soles to track orders and more.",
};

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center">Loading...</div>}>
      <AuthController defaultMode="signup" />
    </Suspense>
  );
}
