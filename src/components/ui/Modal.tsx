"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: ReactNode;
    className?: string;
}

export function Modal({ isOpen, onClose, title, description, children, className }: ModalProps) {
    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal Content container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        onClick={(e) => e.stopPropagation()}
                        className={cn(
                            "relative w-full max-w-lg bg-card rounded-[2.5rem] border border-border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col",
                            className
                        )}
                    >
                        <div className="p-8 space-y-6 overflow-y-auto scrollbar-hide">
                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                                    {description && (
                                        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
                                    )}
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <div className="pt-2">
                                {children}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

export function ModalFooter({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
            {children}
        </div>
    );
}
