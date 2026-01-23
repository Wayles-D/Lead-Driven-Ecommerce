"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * A premium, debounced search input component for the navbar.
 * Automatically updates the URL with the search query.
 */
export function SearchInput({ className, isTransparent }: { className?: string; isTransparent?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use a ref to track if this is the initial mount to prevent immediate navigation on page load
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const trimmedQuery = query.trim();
      if (trimmedQuery) {
        router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      } else if (searchParams.get("q")) {
        // If query is cleared and we were on a search results page, go back to products
        router.push("/products");
      }
    }, 400); // 400ms debounce for a snappy feel

    return () => clearTimeout(timer);
  }, [query, router, searchParams]);

  // Sync state with URL when it changes externally (e.g. browser back button)
  useEffect(() => {
    const q = searchParams.get("q") || "";
    if (q !== query) {
      setQuery(q);
    }
  }, [searchParams, query]);

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <div className={cn("relative w-full max-w-[320px]", className)}>
      <motion.div
        animate={isFocused ? { scale: 1.01 } : { scale: 1 }}
        className={cn(
          "flex items-center gap-2 px-4 h-10 rounded-full border transition-all duration-300",
          isFocused 
            ? "border-primary bg-background shadow-sm ring-2 ring-primary/5" 
            : isTransparent
              ? "border-white/20 bg-white/10 hover:bg-white/20"
              : "border-border/40 bg-secondary/10 hover:bg-secondary/20"
        )}
      >
        <Search 
          size={17} 
          className={cn(
            "transition-colors duration-300", 
            isFocused ? "text-primary" : isTransparent ? "text-white/70" : "text-muted-foreground",
            query && !isFocused && (isTransparent ? "text-white" : "text-foreground")
          )} 
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search footwear..."
          className={cn(
            "flex-1 bg-transparent border-none outline-none text-[13px] font-medium transition-colors",
            isTransparent && !isFocused ? "text-white placeholder:text-white/50" : "text-foreground placeholder:text-muted-foreground/50"
          )}
        />
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClear}
              className="p-1 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center"
              type="button"
            >
              <X size={14} className={cn(isTransparent ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-foreground", "transition-colors")} />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
