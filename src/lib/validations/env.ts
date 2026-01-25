/**
 * Environment Variable Validation
 * 
 * Validates required environment variables at startup.
 * Prevents runtime errors from missing configuration.
 */

const requiredEnvVars = [
  "DATABASE_URL",
  "NEXTAUTH_URL",
  "NEXTAUTH_SECRET",
  "PAYSTACK_PUBLIC_KEY",
  "PAYSTACK_SECRET_KEY",
  "PAYSTACK_WEBHOOK_SECRET",
  "PAYSTACK_CALLBACK_URL",
] as const;

export function validateEnv() {
  const missing: string[] = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.join("\n")}`
    );
  }

  // Validate NEXTAUTH_SECRET is not default
  if (process.env.NEXTAUTH_SECRET === "super-secret-key-change-this") {
    console.warn(
      "⚠️  WARNING: Using default NEXTAUTH_SECRET. Change this in production!"
    );
  }
}

// Run validation on import (server-side only, not during build)
if (typeof window === "undefined" && process.env.NODE_ENV !== "production") {
  try {
    validateEnv();
  } catch (error) {
    // During build, env vars might not be fully available
    // Only validate at runtime
    if (process.env.NEXT_PHASE !== "phase-production-build") {
      throw error;
    }
  }
}
