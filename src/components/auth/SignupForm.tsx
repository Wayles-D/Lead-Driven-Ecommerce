"use client";

import { useState } from "react";
import { registerUser } from "@/actions/auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function SignupForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }
        
        try {
            const result = await registerUser(formData);
            if (result.error) {
                setError(result.error);
                setIsLoading(false);
            } else {
                // Auto-login after successful registration (per Blueprint)
                const loginResult = await signIn("credentials", {
                    redirect: false,
                    email: formData.get("email"),
                    password: password,
                });

                if (loginResult?.error) {
                    router.push("/login?message=Account created successfully. Please sign in.");
                } else {
                    router.push("/");
                    router.refresh();
                }
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-lg bg-card p-8 rounded-2xl border border-border shadow-xl space-y-8"
        >
            <div className="text-center space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight">Create Account</h1>
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                    <p className="text-sm text-balance text-muted-foreground">
                        Create an account to place orders, track purchases, and enable WhatsApp communication.
                    </p>
                </div>
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

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium px-1" htmlFor="firstName">First Name</label>
                        <input name="firstName" id="firstName" className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all" required placeholder="John" disabled={isLoading} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium px-1" htmlFor="lastName">Last Name</label>
                        <input name="lastName" id="lastName" className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all" required placeholder="Doe" disabled={isLoading} />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm font-medium px-1" htmlFor="email">Email Address</label>
                    <input name="email" id="email" type="email" className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all" required placeholder="name@example.com" disabled={isLoading} />
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm font-medium px-1" htmlFor="phoneNumber">Phone Number</label>
                    <input name="phoneNumber" id="phoneNumber" type="tel" className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all" required placeholder="+234..." disabled={isLoading} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium px-1" htmlFor="password">Password</label>
                        <div className="relative">
                            <input 
                                name="password" 
                                id="password" 
                                type={showPassword ? "text" : "password"} 
                                className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all" 
                                required 
                                minLength={6} 
                                placeholder="••••••••"
                                disabled={isLoading}
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
                            name="confirmPassword" 
                            id="confirmPassword" 
                            type={showPassword ? "text" : "password"} 
                            className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all" 
                            required 
                            placeholder="••••••••"
                            disabled={isLoading}
                        />
                    </div>
                </div>
                <p className="text-[10px] text-muted-foreground px-1">Must be at least 6 characters</p>

                <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-medium transition-all hover:scale-[1.01] active:scale-[0.99] mt-2" 
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Account...
                        </>
                    ) : (
                        "Create Account"
                    )}
                </Button>
            </form>

            <div className="text-center text-sm pt-2">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                    Log in
                </Link>
            </div>
        </motion.div>
    );
}