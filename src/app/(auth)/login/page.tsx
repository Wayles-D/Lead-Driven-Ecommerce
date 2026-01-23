import { Suspense } from "react";
import { Metadata } from "next";
import { AuthController } from "./AuthController";

export const metadata: Metadata = {
  title: "Authentication | OML Soles",
  description: "Sign in or create an account to access your OML Soles profile.",
};

/**
 * Server Component LoginPage
 * Provides the required Suspense boundary for useSearchParams() used inside AuthController.
 */
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center">Loading authentication...</div>}>
      <AuthController />
    </Suspense>
  );
}
