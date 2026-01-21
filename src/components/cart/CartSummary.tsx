"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CartSummary() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-24 flex flex-col items-center justify-center max-w-md mx-auto"
      >
        <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8 text-balance">
          Looks like you haven't added anything to your cart yet. Discover our latest handcrafted collections.
        </p>
        <Button asChild size="lg" className="rounded-full px-8 gap-2 group">
          <Link href="/products">
            Start Shopping
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 space-y-8">
        <div className="flex justify-between items-end border-b pb-6">
            <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
            <Button variant="ghost" size="sm" onClick={clearCart} className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 px-3">
                Clear Cart
            </Button>
        </div>
        
        <div className="space-y-0">
            <AnimatePresence mode="popLayout">
                {items.map((item) => (
                    <motion.div 
                        key={`${item.productId}-${item.selectedSize}`}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex flex-col sm:flex-row gap-4 sm:gap-8 py-8 border-b last:border-0 relative group items-start sm:items-center"
                    >
                        {/* Image - Better sized for mobile */}
                        <div className="w-full sm:w-28 h-48 sm:h-28 bg-secondary/30 rounded-2xl overflow-hidden flex-shrink-0 border border-border/50">
                            {item.image && (
                                <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                />
                            )}
                        </div>
                        
                        <div className="flex-1 w-full space-y-4">
                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-lg leading-tight break-words">{item.name}</h3>
                                    <p className="text-sm text-muted-foreground">Size: <span className="text-foreground font-medium">{item.selectedSize}</span></p>
                                </div>
                                {/* Mobile-only Delete Button */}
                                <button 
                                    type="button"
                                    onClick={() => removeItem(item.productId, item.selectedSize)}
                                    className="sm:hidden text-muted-foreground/60 hover:text-destructive transition-colors p-2 hover:bg-destructive/10 rounded-full"
                                    aria-label="Remove item"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div className="flex items-center justify-between sm:justify-start sm:gap-8">
                                <div className="flex items-center gap-1 bg-secondary/30 rounded-full p-1 border border-border/50">
                                    <button 
                                        type="button"
                                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-background hover:shadow-sm transition-all disabled:opacity-30"
                                        onClick={() => updateQuantity(item.productId, item.selectedSize, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                                    <button 
                                        type="button"
                                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-background hover:shadow-sm transition-all"
                                        onClick={() => updateQuantity(item.productId, item.selectedSize, item.quantity + 1)}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Mobile-only Price */}
                                <p className="sm:hidden font-bold text-lg">{formatCurrency(item.price * item.quantity)}</p>
                            </div>
                        </div>
                        
                        {/* Desktop Price & Trash */}
                        <div className="hidden sm:flex text-right flex-col justify-between items-end h-28 py-1 min-w-[120px]">
                            <p className="font-bold text-xl tracking-tight">{formatCurrency(item.price * item.quantity)}</p>
                            <button 
                                type="button"
                                onClick={() => removeItem(item.productId, item.selectedSize)}
                                className="text-muted-foreground/60 hover:text-destructive transition-colors p-2 hover:bg-destructive/10 rounded-full"
                                aria-label="Remove item"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-card p-8 rounded-3xl border border-border shadow-sm h-fit space-y-8 sticky top-24">
            <h2 className="text-xl font-bold tracking-tight">Order Summary</h2>
            
            <div className="space-y-4 text-sm">
                <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="text-foreground font-medium">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="italic">Calculated next step</span>
                </div>
                <div className="border-t pt-6 flex justify-between items-baseline">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-2xl tracking-tight text-primary">{formatCurrency(totalPrice)}</span>
                </div>
            </div>

            <Button className="w-full h-14 text-base font-semibold rounded-2xl group transition-all active:scale-[0.98]" size="lg" asChild>
                <Link href="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </Button>
            
            <div className="flex items-center justify-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <img src="https://checkout.paystack.com/images/paystack-badge.png" alt="Paystack" className="h-6 object-contain" />
            </div>
        </div>
      </div>
    </div>
  );
}
