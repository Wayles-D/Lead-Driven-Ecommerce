"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import  {FaWhatsapp} from "react-icons/fa";
import { ApiService } from "@/lib/api";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { 
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";


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
    const router = useRouter();
    const { data: session } = useSession();
    const { addItem } = useCart();
    const [selectedSize, setSelectedSize] = useState<number | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleAddToCart = () => {
        if (!selectedSize) return;

        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.images[currentImageIndex],
            selectedSize: selectedSize,
            quantity: quantity,
        });

        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            {/* Image Gallery */}
            <div className="space-y-6">
                <div className="aspect-square bg-secondary rounded-[2.5rem] overflow-hidden relative border border-border/50 shadow-inner group">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentImageIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="relative w-full h-full"
                        >
                            {product.images[currentImageIndex] ? (
                                <Image
                                    src={product.images[currentImageIndex]}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform group-hover:scale-105 duration-1000"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-2xl font-medium">
                                    {product.name}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {product.images.length > 1 && (
                    <div className="flex gap-4 px-1">
                        {product.images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentImageIndex(idx)}
                                className={`relative w-24 aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300
                                    ${currentImageIndex === idx ? 'border-primary scale-105' : 'border-transparent hover:border-border'}`}
                            >
                                <Image
                                    src={img}
                                    alt={`${product.name} view ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-8">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group w-fit"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Products
                </button>

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
                        className="flex-1 h-14 py-2 md:py-0 rounded-2xl text-base font-black shadow-xl shadow-primary/10 transition-all active:scale-[0.98]"
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
                            href={ApiService.whatsapp.getLink(
                                ApiService.whatsapp.getProductInquiryMessage(
                                    session?.user?.name || "a customer",
                                    product.name,
                                    product.id
                                )
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center"
                        >
                            <FaWhatsapp size={20} className="shrink-0" />
                            <span>Ask about this product</span>
                        </a>
                    </Button>
                </div>
            </div>
        </div>
    );
}
