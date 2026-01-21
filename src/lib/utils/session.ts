/**
 * Session Utilities
 * 
 * Server-side helpers for accessing user session data.
 * Use these in Server Components and Server Actions.
 */

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

/**
 * Get current user session (server-side only)
 * Returns null if not authenticated
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Get current user or throw error if not authenticated
 * Use this when authentication is required
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    throw new Error("Authentication required");
  }
  
  return session;
}

/**
 * Check if current user is admin
 */
export async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "ADMIN";
}

/**
 * Require admin role or throw error
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    throw new Error("Authentication required");
  }
  
  if (session.user.role !== "ADMIN") {
    throw new Error("Admin access required");
  }
  
  return session;
}
