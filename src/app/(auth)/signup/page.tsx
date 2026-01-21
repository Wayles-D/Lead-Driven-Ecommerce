import { SignupForm } from "@/components/auth/SignupForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Lead-Driven Ecommerce",
};

export default function SignupPage() {
  return <SignupForm />;
}