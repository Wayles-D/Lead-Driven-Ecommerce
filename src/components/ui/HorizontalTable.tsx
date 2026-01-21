"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Hand } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface HorizontalTableProps {
  children: React.ReactNode;
  className?: string;
  minWidth?: number;
}

export function HorizontalTable({ children, className, minWidth = 800 }: HorizontalTableProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    checkScroll();

    window.addEventListener("resize", checkMobile);
    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener("scroll", checkScroll);
    }

    return () => {
      window.removeEventListener("resize", checkMobile);
      if (scrollEl) {
        scrollEl.removeEventListener("scroll", checkScroll);
      }
    };
  }, []);

  return (
    <div className={cn("relative group", className)}>
      {/* Mobile Swipe Hint */}
      {isMobile && (
        <div className="flex items-center gap-2 mb-2 text-xs font-medium text-muted-foreground animate-pulse">
          <Hand size={14} className="rotate-90" />
          <span>Swipe left or right to see more columns</span>
        </div>
      )}

      {/* Arrows */}
      <AnimatePresence>
        {showLeftArrow && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
          >
            <div className="bg-background/80 backdrop-blur-sm border shadow-lg rounded-full p-1.5 text-primary">
              <ChevronLeft size={20} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRightArrow && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none"
          >
            <div className="bg-background/80 backdrop-blur-sm border shadow-lg rounded-full p-1.5 text-primary">
              <ChevronRight size={20} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="w-full overflow-x-auto overflow-y-hidden scrollbar-hide select-none md:select-auto"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div style={{ minWidth: `${minWidth}px` }} className="pb-4">
          {children}
        </div>
      </div>
    </div>
  );
}
