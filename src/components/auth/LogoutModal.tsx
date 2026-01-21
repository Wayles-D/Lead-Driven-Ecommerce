"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[100] cursor-pointer"
          />

          {/* Modal Content */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[101] pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-black border border-white/10 rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.5)] p-10 pointer-events-auto relative overflow-hidden text-white"
            >
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center gap-8">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center text-white">
                  <LogOut size={36} />
                </div>

                <div className="space-y-3">
                  <h2 className="text-3xl font-black tracking-tighter">Sign Out?</h2>
                  <p className="text-white/60 text-sm font-medium leading-relaxed">
                    Are you sure you want to log out of your handcrafted collection?
                  </p>
                </div>

                <div className="flex flex-col gap-3 w-full">
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full h-14 bg-white text-black rounded-2xl font-black text-lg transition-all hover:bg-white/90 active:scale-[0.98]"
                  >
                    Log Out
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full h-14 bg-transparent text-white border-2 border-white/10 rounded-2xl font-bold text-lg transition-all hover:bg-white/5 hover:border-white/20 active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
