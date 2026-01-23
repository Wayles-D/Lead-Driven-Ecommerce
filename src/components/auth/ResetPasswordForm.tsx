"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { resetPassword, validateResetToken } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Loader2, Eye, EyeOff, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Production-grade Reset Password Form
 * Handles:
 * - Immediate token validation on page load
 * - Strict expiration detection
 * - Clear error/success states
 * - Password strength validation
 */
export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [isValidating, setIsValidating] = useState(true);
  const [tokenError, setTokenError] = useState<string | null>(null);
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validate token on mount
  useEffect(() => {
    async function checkToken() {
      if (!token) {
        setTokenError("No reset token provided.");
        setIsValidating(false);
        return;
      }

      try {
        const result = await validateResetToken(token);
        if (!result.valid) {
          setTokenError(result.error || "This link is invalid or has expired.");
        }
      } catch {
        setTokenError("Unable to verify the reset link. Please try again.");
      } finally {
        setIsValidating(false);
      }
    }

    checkToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("token", token);
      formData.append("password", password);
      const result = await resetPassword(formData);

      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        // Direct success state handled in render
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // 1. Validating State
  if (isValidating) {
    return (
      <div className="w-full max-w-md bg-card p-12 rounded-2xl border border-border shadow-xl text-center space-y-6">
        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
        <p className="text-muted-foreground font-medium animate-pulse">Verifying security credentials...</p>
      </div>
    );
  }

  // 2. Invalid/Expired Token State
  if (tokenError) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-card p-8 rounded-2xl border border-destructive/20 shadow-xl text-center space-y-8"
      >
        <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert size={32} />
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-bold tracking-tight">Access Expired</h1>
          <p className="text-muted-foreground leading-relaxed">
            {tokenError}
            <br />
            For security reasons, reset links are only valid for 5 minutes.
          </p>
        </div>
        <div className="pt-2">
          <Button asChild className="w-full h-12 rounded-xl text-sm font-bold uppercase tracking-wider transition-all hover:scale-[1.02]">
            <Link href="/login?mode=forgot">Request New Link</Link>
          </Button>
        </div>
      </motion.div>
    );
  }

  // 3. Success State
  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-card p-8 rounded-2xl border border-primary/20 shadow-xl text-center space-y-8"
      >
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 size={32} />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Password Updated</h1>
          <p className="text-muted-foreground">
            Your credentials have been restored successfully. You can now visit the login page to enter the store.
          </p>
        </div>
        <div className="pt-2">
          <Button asChild className="w-full h-12 rounded-xl text-sm font-bold uppercase tracking-wider transition-all hover:scale-[1.02]">
            <Link href="/login?mode=signin&message=Security credentials updated. Please login.">Back to Login</Link>
          </Button>
        </div>
      </motion.div>
    );
  }

  // 4. Reset Form State (Active Token)
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md bg-card p-8 rounded-2xl border border-border shadow-xl space-y-8"
    >
      <div className="space-y-2 text-center uppercase">
        <h1 className="text-3xl font-semibold tracking-tight playfair-black">New Password</h1>
        <p className="text-muted-foreground normal-case">Please choose a strong new password for your account.</p>
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
          <label className="text-sm font-medium px-1" htmlFor="password">New Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 transition-all font-sans"
              required
              disabled={isLoading}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium px-1" htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 transition-all font-sans"
            required
            disabled={isLoading}
            placeholder="••••••••"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 text-base font-bold transition-all hover:scale-[1.01] active:scale-[0.99] rounded-xl uppercase tracking-widest bg-primary hover:bg-primary/95 shadow-lg shadow-primary/20" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating Security...
            </>
          ) : (
            "Update Password"
          )}
        </Button>
      </form>
    </motion.div>
  );
}
