"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { EmailService } from "@/lib/email";
import * as crypto from "crypto";

const registerSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function registerUser(formData: FormData) {
  const rawData = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phoneNumber: formData.get("phoneNumber"),
    password: formData.get("password"),
  };

  const validated = registerSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: validated.error.issues[0]?.message || "Validation failed" };
  }

  const { email, password, firstName, lastName, phoneNumber } = validated.data;

  // Check valid existing user
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "User already exists with this email" };
  }
  
  const existingPhone = await prisma.user.findUnique({
    where: { phoneNumber },
  });

  if (existingPhone) {
    return { error: "User already exists with this phone number" };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      phoneNumber,
      passwordHash,
      role: "USER"
    },
  });

  // Welcome Email (Non-blocking)
  EmailService.sendWelcomeEmail(email, firstName);

  return { success: true };
}

/**
 * Forgot Password Action
 */
export async function forgotPassword(formData: FormData) {
  const email = formData.get("email") as string;
  if (!email) return { error: "Email is required" };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Return success even if user not found for security
    return { success: true };
  }

  // Generate Reset Token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  
  // Expiry: 1 hour from now
  const expires = new Date(Date.now() + 3600000);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: expires
    }
  });

  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}&email=${email}`;
  await EmailService.sendPasswordResetEmail(email, resetUrl);

  return { success: true };
}

/**
 * Reset Password Action
 */
export async function resetPassword(formData: FormData) {
  const token = formData.get("token") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!token || !email || !password) return { error: "All fields are required" };

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      email,
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { gt: new Date() }
    }
  });

  if (!user) {
    return { error: "Invalid or expired token" };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetPasswordToken: null,
      resetPasswordExpires: null
    }
  });

  return { success: true };
}