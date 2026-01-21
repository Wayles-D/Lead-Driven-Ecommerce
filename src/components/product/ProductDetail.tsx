"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { MessageCircle } from "lucide-react";
import { WhatsAppService } from "@/lib/whatsapp";
import { useSession } from "next-auth/react";


interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    availableSizes: number[];
}

export function ProductDetail({ product }: { product: Product }) {
    const { data: session } = useSession();
    const { addItem } = useCart();
    const [selectedSize, setSelectedSize] = useState<number | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = () => {
        if (!selectedSize) return;

        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            selectedSize: selectedSize,
            quantity: quantity,
        });

        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            {/* Image Gallery */}
            <div className="space-y-4">
                <div className="aspect-square bg-secondary rounded-[2.5rem] overflow-hidden relative border border-border/50 shadow-inner">
                    {product.images[0] ? (
                        <div className="w-full h-full bg-cover bg-center transition-transform hover:scale-110 duration-1000" style={{ backgroundImage: `url(${product.images[0]})` }} />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-2xl font-medium">
                            {product.name}
                        </div>
                    )}
                </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 leading-tight">{product.name}</h1>
                    <div className="flex items-baseline gap-3">
                        <p className="text-3xl font-black text-primary">{formatCurrency(product.price)}</p>
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Free Shipping</span>
                    </div>
                </div>

                <div className="prose text-muted-foreground">
                    <p>{product.description}</p>
                </div>

                {/* Size Selector */}
                <div>
                    <span className="text-sm font-medium mb-3 block">Select Size</span>
                    <div className="flex flex-wrap gap-3">
                        {product.availableSizes.map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all
                                    ${selectedSize === size 
                                        ? "border-primary bg-primary text-primary-foreground scale-110" 
                                        : "border-input hover:border-primary text-muted-foreground"}`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

            {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-auto">
                    <div className="flex items-center border border-border/50 rounded-2xl overflow-hidden h-14 w-full sm:w-auto bg-secondary/20">
                        <button 
                            className="flex-1 sm:w-14 h-full flex items-center justify-center hover:bg-background/80 transition-colors text-xl font-bold"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            aria-label="Decrease quantity"
                        >
                            -
                        </button>
                        <span className="w-12 text-center font-black text-lg">{quantity}</span>
                        <button 
                            className="flex-1 sm:w-14 h-full flex items-center justify-center hover:bg-background/80 transition-colors text-xl font-bold"
                            onClick={() => setQuantity(quantity + 1)}
                            aria-label="Increase quantity"
                        >
                            +
                        </button>
                    </div>
                    <Button 
                        size="lg" 
                        className="flex-1 h-14 rounded-2xl text-base font-black shadow-xl shadow-primary/10 transition-all active:scale-[0.98]"
                        disabled={!selectedSize}
                        onClick={handleAddToCart}
                    >
                        {isAdded ? "Added to Cart!" : "Add to Cart"}
                    </Button>
                </div>
                {!selectedSize && (
                    <p className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60 text-center">Please select a size to continue</p>
                )}

                <div className="pt-6 border-t border-border/50">
                    <Button 
                        asChild
                        variant="outline" 
                        className="w-full h-14 rounded-2xl border-2 font-black hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all gap-3 group"
                    >
                        <a 
                            href={WhatsAppService.getLink(
                                WhatsAppService.getProductInquiryMessage(
                                    session?.user?.name || "a customer",
                                    product.name,
                                    product.id
                                )
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center"
                        >
                            <MessageCircle size={20} className="shrink-0" />
                            <span>Ask about this product</span>
                        </a>
                    </Button>
                </div>
            </div>
        </div>
    );
}
