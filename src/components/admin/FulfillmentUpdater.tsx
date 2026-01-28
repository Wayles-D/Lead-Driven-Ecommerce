"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateFulfillmentStatus } from "@/actions/orders";
import { Toast } from "@/components/ui/Toast";
import { Loader2 } from "lucide-react";

interface FulfillmentUpdaterProps {
    orderId: string;
    initialStatus: string;
}

export function FulfillmentUpdater({ orderId, initialStatus }: FulfillmentUpdaterProps) {
    const [status, setStatus] = useState(initialStatus);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<{ isVisible: boolean; message: string }>({ 
        isVisible: false, 
        message: "" 
    });

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newStatus = formData.get("status") as string;
        
        setIsLoading(true);
        try {
            await updateFulfillmentStatus(orderId, newStatus);
            setStatus(newStatus);
            setToast({ 
                isVisible: true, 
                message: "Order status updated successfully. Customer has been notified by email." 
            });
        } catch (error) {
            console.error("Failed to update status:", error);
            alert("Failed to update status. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Toast 
                isVisible={toast.isVisible} 
                message={toast.message} 
                onClose={() => setToast({ ...toast, isVisible: false })} 
            />
            
            <div className="flex flex-col items-end gap-2">
                <span className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Fulfillment Cycle</span>
                <form onSubmit={handleUpdate} className="flex gap-2">
                    <select 
                        name="status" 
                        defaultValue={status}
                        className="bg-card border border-border rounded-xl px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-primary focus:outline-none appearance-none cursor-pointer"
                    >
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPING">Shipping</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                    </select>
                    <Button type="submit" disabled={isLoading} className="rounded-xl font-bold min-w-[80px]">
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : "Update"}
                    </Button>
                </form>
            </div>
        </>
    );
}
