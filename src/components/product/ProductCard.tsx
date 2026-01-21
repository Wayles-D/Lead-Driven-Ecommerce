"use client";

import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  images: string[];
}

export function ProductCard({ id, name, price, category, description, images }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Ensure we at least have an empty array if images is undefined, though types say string[]
  const safeImages = images?.length > 0 ? images : [];
  const visibleImages = safeImages.slice(0, 3); // Max 3 images

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (visibleImages.length <= 1) return;
    if (info.offset.x < -50) {
      // Swipe Left -> Next
      setCurrentImageIndex((prev) => (prev + 1) % visibleImages.length);
    } else if (info.offset.x > 50) {
      // Swipe Right -> Prev
      setCurrentImageIndex((prev) => (prev - 1 + visibleImages.length) % visibleImages.length);
    }
  };

  return (
    <div className="group flex flex-col w-full bg-white dark:bg-card rounded-[2.5rem] p-4 shadow-xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] hover:-translate-y-2">
      {/* Image Section */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.5rem] bg-secondary">
        <Link href={`/products/${id}`} className="absolute inset-0 block cursor-pointer">
          {safeImages.length > 0 ? (
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={currentImageIndex}
                className="absolute inset-0 h-full w-full"
                draggable="true"
                drag={visibleImages.length > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={visibleImages[currentImageIndex]}
                  alt={`${name} - View ${currentImageIndex + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={currentImageIndex === 0}
                />
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground/30 font-medium">
              {name}
            </div>
          )}
        </Link>

        {/* Badge: Best Seller Only
        {/* <div className="absolute left-4 top-4 overflow-hidden rounded-full border border-white/20 bg-white/30 backdrop-blur-md px-3 py-1.5 z-10">
          <span className="text-xs font-semibold text-white tracking-wide shadow-sm">Best Seller</span>
        </div> */}

        

        {/* Pagination Dots */}
        {visibleImages.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
            {visibleImages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentImageIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentImageIndex ? "w-4 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Text Section */}
      <div className="flex flex-col gap-3 pt-5 px-2">
        <div className="space-y-1">
           {/* Name */}
          <h3 className="font-bold text-xl tracking-tight text-foreground line-clamp-1">
            {name}
          </h3>
          {/* Category */}
          <p className="text-xs font-semibold text-muted-foreground/50 uppercase tracking-widest">
            {category}
          </p>
        </div>

        {/* Description */}
        <p className="text-[15px] text-muted-foreground/70 line-clamp-2 min-h-[44px] leading-relaxed">
          {description}
        </p>

        {/* Bottom Row: Price & CTA */}
        <div className="flex items-center justify-between gap-3 pt-3 mt-auto">
          {/* Price Pill */}
          <div className="flex items-center justify-center rounded-full bg-secondary/80 px-5 py-2.5 min-w-[90px]">
            <span className="text-lg font-bold text-foreground tracking-tight">
              {formatCurrency(price)}
            </span>
          </div>

          {/* CTA Button */}
          <Button 
            asChild 
            className="flex-1 rounded-full bg-black text-white hover:bg-black/80 h-[48px] px-6 text-base font-medium shadow-sm group min-w-[80px]"
          >
            <Link href={`/products/${id}`} className="flex items-center justify-center gap-2">
              Buy Now
              <div className="rounded-full bg-white text-black p-0.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight className="h-3.5 w-3.5 stroke-[3px]" />
              </div>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
