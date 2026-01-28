"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * A premium, debounced search input component for the navbar.
 * Automatically updates the URL with the search query.
 */
export function SearchInput({ 
  className, 
  isTransparent,
  isExpandable,
  onCollapse
}: { 
  className?: string; 
  isTransparent?: boolean;
  isExpandable?: boolean;
  onCollapse?: () => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize query from URL once
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when it becomes expandable and visible
  useEffect(() => {
    if (isExpandable && inputRef.current) {
        inputRef.current.focus();
    }
  }, [isExpandable]);

  // Stable search function
  const performSearch = useCallback((searchTerm: string) => {
    const trimmedQuery = searchTerm.trim();
    const currentQ = searchParams.get("q") || "";
    
    // Don't navigate if the query hasn't changed
    if (trimmedQuery === currentQ) return;

    if (trimmedQuery) {
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    } else if (currentQ) {
      // If query is cleared and we were on a search results page, go back to products
      router.push("/products");
    }
  }, [router, searchParams]);

  // Debounce logic: only triggers navigation, never resets local state
  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    const trimmedQuery = query.trim();
    
    // Avoid redundant navigation
    if (trimmedQuery === currentQ) return;

    const timer = setTimeout(() => {
      performSearch(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query, performSearch, searchParams]);

  // Sync state with URL ONLY when it changes externally (e.g. browser back button)
  // and NOT while the user is actively focused on the input.
  useEffect(() => {
    const q = searchParams.get("q") || "";
    if (q !== query && !isFocused) {
      setQuery(q);
    }
  }, [searchParams, isFocused, query]);

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
    // If we're on a search page, clearing should navigate away
    if (searchParams.get("q")) {
      router.push("/products");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
    inputRef.current?.blur();
    if (onCollapse) onCollapse();
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={cn("relative w-full", isExpandable ? "max-w-none" : "max-w-[320px]", className)}
    >
      <motion.div
        layoutId="search-input-container"
        animate={isFocused ? { scale: 1.01 } : { scale: 1 }}
        className={cn(
          "flex items-center gap-2 px-4 h-11 rounded-full border transition-all duration-300",
          isFocused 
            ? "border-primary bg-background shadow-sm ring-2 ring-primary/5" 
            : isTransparent
              ? "border-white/20 bg-white/10 hover:bg-white/20"
              : "border-border/40 bg-secondary/10 hover:bg-secondary/20"
        )}
      >
        <Search 
          size={18} 
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
          onBlur={() => {
            setIsFocused(false);
            if (!query && onCollapse) onCollapse();
          }}
          placeholder="Search products..."
          className={cn(
            "flex-1 bg-transparent border-none outline-none text-[14px] font-medium transition-colors h-full",
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
    </form>
  );
}

