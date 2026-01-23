"use client";

import { useState } from "react";
import { forgotPassword } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("email", email);
      const result = await forgotPassword(formData);

      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-card p-8 rounded-2xl border border-border shadow-xl text-center space-y-6"
      >
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 size={32} />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="text-muted-foreground">
            If an account exists for {email}, we have sent instructions to reset your password.
          </p>
        </div>
        <div className="pt-4">
          <Button asChild variant="outline" className="w-full h-12 rounded-xl">
            <Link href="/login?mode=signin">Return to login</Link>
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md bg-card p-8 rounded-2xl border border-border shadow-xl space-y-8"
    >
      <div className="space-y-2 text-center relative">
        <Link 
          href="/login?mode=signin" 
          className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight uppercase playfair-black">Forgot Password</h1>
        <p className="text-muted-foreground">Enter your email and we&apos;ll send you a link to reset your password.</p>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-destructive/10 text-destructive text-sm p-4 rounded-xl flex items-center gap-2 border border-destructive/20"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium px-1" htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 transition-all"
            required
            disabled={isLoading}
            placeholder="name@example.com"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 text-base font-bold transition-all hover:scale-[1.01] active:scale-[0.99] rounded-xl" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending Link...
            </>
          ) : (
            "Send Reset Link"
          )}
        </Button>
      </form>
    </motion.div>
  );
}
