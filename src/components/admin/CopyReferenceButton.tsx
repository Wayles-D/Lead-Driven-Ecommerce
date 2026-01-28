"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Toast } from "@/components/ui/Toast";

export function CopyReferenceButton({ reference }: { reference: string }) {
    const [copied, setCopied] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(reference);
            setCopied(true);
            setShowToast(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <>
            <Toast 
                isVisible={showToast} 
                message="Reference copied to clipboard" 
                onClose={() => setShowToast(false)} 
            />
            <button 
                onClick={handleCopy}
                className="p-1 hover:bg-secondary rounded transition-colors text-muted-foreground hover:text-primary"
                title="Copy Reference"
            >
                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            </button>
        </>
    );
}
