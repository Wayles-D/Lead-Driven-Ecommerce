"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Consolidated Auth Page
 * Dynamically renders Login, Signup, or Forgot Password form based on 'mode' query param.
 * This ensures immediate UI updates and smooth transitions.
 */
function AuthController() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") || "signin";

  return (
    <div className="w-full flex justify-center items-center py-10">
      <AnimatePresence mode="wait">
        {mode === "signin" && (
          <motion.div
            key="signin"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full flex justify-center"
          >
            <LoginForm />
          </motion.div>
        )}

        {mode === "signup" && (
          <motion.div
            key="signup"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full flex justify-center"
          >
            <SignupForm />
          </motion.div>
        )}

        {mode === "forgot" && (
          <motion.div
            key="forgot"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full flex justify-center"
          >
            <ForgotPasswordForm />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center">Loading authentication...</div>}>
      <AuthController />
    </Suspense>
  );
}
