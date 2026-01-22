"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deactivateAccount } from "@/actions/account";
import { signOut, useSession } from "next-auth/react";
import { Modal, ModalFooter } from "@/components/ui/Modal";
import { AlertTriangle, Loader2, ShieldAlert } from "lucide-react";

export function DeactivateAccount() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = session?.user?.role === "ADMIN";

  const handleDeactivate = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await deactivateAccount();
      if (result.success) {
        await signOut({ callbackUrl: "/" });
      } else if (result.error) {
        setError(result.error);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button 
        variant="destructive" 
        className="rounded-xl px-8 font-bold"
        onClick={() => setIsOpen(true)}
      >
        Deactivate Account
      </Button>

      <Modal 
      
        isOpen={isOpen} 
        onClose={() => !isLoading && setIsOpen(false)}
        title="Deactivate Account"
        description={isAdmin 
            ? "This action will deactivate your administrative account. You will lose all management privileges and access to the dashboard."
            : "This action will deactivate your account. You will no longer be able to log in or access your order history."
        }
      >
        <div className="space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive mx-auto sm:mx-0">
            {isAdmin ? <ShieldAlert size={24} /> : <AlertTriangle size={24} />}
          </div>

          <p className="text-sm font-bold text-amber-600 leading-relaxed bg-amber-50 p-4 rounded-xl border border-amber-200">
             Warning: This is a permanent action. All your profile data and access will be restricted immediately.
          </p>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-xl border border-destructive/20 font-medium">
              {error}
            </div>
          )}

          <ModalFooter>
            <Button
              type="button"
              variant="ghost"
              className="rounded-xl font-bold flex-1 order-2 sm:order-1"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="rounded-xl font-bold flex-1 order-1 sm:order-2 bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20"
              onClick={handleDeactivate}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Deactivate
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </>
  );
}
