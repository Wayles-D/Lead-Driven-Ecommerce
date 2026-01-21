/**
 * NextAuth Type Declarations
 * 
 * Extends default NextAuth types to include custom fields:
 * - role: USER | ADMIN
 * - id: user identifier
 */

import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "USER" | "ADMIN";
    } & DefaultSession["user"];
  }

  interface User {
    role: "USER" | "ADMIN";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "USER" | "ADMIN";
    id: string;
  }
}
