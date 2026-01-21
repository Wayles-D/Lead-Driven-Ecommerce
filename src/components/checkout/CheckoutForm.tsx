"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { createOrder } from "@/actions/orders";
import { initiateCheckoutPayment } from "@/actions/payment";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Loader2, MapPin, ListChecks, CreditCard } from "lucide-react";

type CheckoutStep = "SHIPPING" | "REVIEW";

export function CheckoutForm() {
    const { items, totalPrice, clearCart } = useCart();
    const router = useRouter();
    const [step, setStep] = useState<CheckoutStep>("SHIPPING");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form data state
    const [shippingData, setShippingData] = useState({
        address: "",
        city: "",
        state: ""
    });

    if (items.length === 0) {
        return (
            <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
                <p className="text-muted-foreground mb-4">Your cart is empty.</p>
                <Button onClick={() => router.push("/products")}>Go to Shop</Button>
            </div>
        );
    }

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        setStep("REVIEW");
    };

    const handleBack = () => {
        setStep("SHIPPING");
    };

    const handlePlaceOrder = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("address", shippingData.address);
            formData.append("city", shippingData.city);
            formData.append("state", shippingData.state);

            // 1. Create Order
            const result = await createOrder(formData, JSON.stringify(items));
            
            if (result.success) {
                clearCart();
                // 2. Initiate Payment
                const paymentResult = await initiateCheckoutPayment(result.orderId);
                
                if (paymentResult?.url) {
                    window.location.href = paymentResult.url;
                } else {
                     router.push(`/orders/${result.orderId}/success`);
                }
            }
        } catch (e: any) {
            console.error(e);
            setError(e.message || "Failed to place order. Please try again.");
            setIsLoading(false);
        }
    };

    const steps = [
        { id: "SHIPPING", label: "Shipping", icon: MapPin },
        { id: "REVIEW", label: "Review", icon: ListChecks },
        { id: "PAYMENT", label: "Payment", icon: CreditCard },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            {/* Steps Indicator */}
            <div className="flex justify-between items-center max-w-sm mx-auto">
                {steps.map((s, i) => {
                    const Icon = s.icon;
                    const isActive = step === s.id || (step === "REVIEW" && s.id === "SHIPPING");
                    const isCompleted = step === "REVIEW" && s.id === "SHIPPING";
                    
                    return (
                        <div key={s.id} className="flex flex-col items-center gap-2 relative flex-1">
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                                isActive || isCompleted ? 'border-primary bg-primary text-primary-foreground' : 'border-muted text-muted-foreground'
                            }`}>
                                <Icon size={16} className="sm:hidden" />
                                <Icon size={18} className="hidden sm:block" />
                            </div>
                            <span className={`text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-center px-1 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {s.label}
                            </span>
                            {i < steps.length - 1 && (
                                <div className="absolute left-[calc(50%+16px)] sm:left-[calc(50%+20px)] top-4 sm:top-5 w-[calc(100%-32px)] sm:w-[calc(100%-40px)] h-[2px] bg-muted/30" />
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        {step === "SHIPPING" ? (
                            <motion.div
                                key="shipping"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-8"
                            >
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold tracking-tight">Shipping Details</h2>
                                    <p className="text-muted-foreground text-sm">Where should we deliver your handcrafted items?</p>
                                </div>
                                <form onSubmit={handleNext} className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium px-1">Delivery Address</label>
                                        <input 
                                            name="address" 
                                            required
                                            value={shippingData.address}
                                            onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                                            className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all"
                                            placeholder="House number, street name..."
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium px-1">City</label>
                                            <input 
                                                name="city" 
                                                required
                                                value={shippingData.city}
                                                onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                                                className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all"
                                                placeholder="Lagos"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium px-1">State</label>
                                            <input 
                                                name="state" 
                                                required
                                                value={shippingData.state}
                                                onChange={(e) => setShippingData({...shippingData, state: e.target.value})}
                                                className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all"
                                                placeholder="Lagos"
                                            />
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full h-14 rounded-2xl text-base font-semibold group" size="lg">
                                        Review Order
                                        <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                    </Button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="review"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold tracking-tight">Review Order</h2>
                                    <p className="text-muted-foreground text-sm">One last look before we move to payment.</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-secondary/20 p-6 rounded-2xl border border-border/50 space-y-4">
                                        <div className="flex items-center justify-between pb-2 border-b border-border/50">
                                            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Shipping To</h3>
                                            <button onClick={handleBack} className="text-primary text-xs font-bold hover:underline">Edit</button>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium">{shippingData.address}</p>
                                            <p className="text-sm text-muted-foreground">{shippingData.city}, {shippingData.state}</p>
                                        </div>
                                    </div>

                                    <div className="bg-secondary/20 p-6 rounded-2xl border border-border/50 space-y-4">
                                        <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Items</h3>
                                        {items.map((item) => (
                                            <div key={`${item.productId}-${item.selectedSize}`} className="flex justify-between items-center text-sm">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-6 h-6 rounded bg-background flex items-center justify-center text-[10px] font-bold border">{item.quantity}x</span>
                                                    <span>{item.name} <span className="text-muted-foreground text-xs">(Size {item.selectedSize})</span></span>
                                                </div>
                                                <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {error && (
                                        <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-xl border border-destructive/20 flex items-center gap-2">
                                            <span>{error}</span>
                                        </div>
                                    )}

                                    <div className="flex gap-4">
                                        <Button variant="outline" onClick={handleBack} className="h-14 px-6 rounded-2xl" disabled={isLoading}>
                                            <ChevronLeft className="w-4 h-4 mr-2" />
                                            Back
                                        </Button>
                                        <Button 
                                            className="flex-1 h-14 rounded-2xl text-base font-semibold" 
                                            size="lg" 
                                            onClick={handlePlaceOrder}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center gap-2">
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    <span>Securing Session...</span>
                                                </div>
                                            ) : (
                                                `Pay ${formatCurrency(totalPrice)}`
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-card p-4 sm:p-8 rounded-3xl border border-border shadow-sm space-y-6 sticky top-24">
                        <h2 className="text-xl font-bold tracking-tight">Order Summary</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Subtotal</span>
                                <span className="text-foreground font-medium">{formatCurrency(totalPrice)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Shipping</span>
                                <span className="text-foreground font-medium">Free</span>
                            </div>
                            <div className="border-t pt-4 flex justify-between items-baseline gap-2">
                                <span className="font-bold text-lg">Total</span>
                                <span className="font-bold text-xl sm:text-2xl tracking-tight text-primary whitespace-nowrap">{formatCurrency(totalPrice)}</span>
                            </div>
                        </div>
                        <div className="pt-4 flex flex-col items-center gap-4 border-t">
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium uppercase tracking-widest text-center">
                                <CreditCard size={12} />
                                Secure Checkout
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
