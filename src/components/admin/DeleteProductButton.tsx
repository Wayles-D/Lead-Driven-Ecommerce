"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { deleteProduct } from "@/actions/products";

import { Modal, ModalFooter } from "@/components/ui/Modal";

interface DeleteProductButtonProps {
  productId: string;
}

export function DeleteProductButton({ productId }: DeleteProductButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteProduct(productId);
      
      if (!result.success) {
        alert(result.message);
      }
      setShowConfirm(false);
    } catch (error) {
      console.error("Deletion failed:", error);
      alert("An error occurred while deleting the product. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setShowConfirm(true)}
        disabled={isDeleting}
        className="rounded-xl hover:bg-destructive/10 hover:text-destructive gap-2 font-bold py-0 h-9"
      >
        <Trash2 size={14} />
        Delete
      </Button>

      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Delete product?"
        description="This action cannot be undone. This product will be permanently removed."
      >
        <ModalFooter>
            <Button 
                variant="outline" 
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-2xl h-12"
            >
                Cancel
            </Button>
            <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 rounded-2xl h-12 gap-2"
            >
                {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                Delete
            </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
