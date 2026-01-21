/**
 * NextAuth API Route Handler
 * 
 * Exports centralized auth handlers for:
 * - GET /api/auth/*
 * - POST /api/auth/*
 */

import NextAuth from "next-auth";
import { authOptions } from "@/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
