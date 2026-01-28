"use client";

import { createProduct, updateProduct } from "@/actions/products";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import Image from "next/image";
import { X, Plus, Loader2 } from "lucide-react";
import { ApiService } from "@/lib/api";


import { Toast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";

// Define strict type based on Prisma model
interface ProductData {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  availableSizes: number[];
  isActive: boolean;
}

export function ProductForm({ product }: { product?: ProductData }) {
    const router = useRouter();
    const isEditing = !!product;
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState<string[]>(product?.images || []);
    const [isUploading, setIsUploading] = useState(false);
    const [toast, setToast] = useState<{ isVisible: boolean; message: string }>({ isVisible: false, message: "" });
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initial values
    const defaultValues = {
        name: product?.name || "",
        description: product?.description || "",
        price: product?.price || 0,
        category: product?.category || "men",
        images: product?.images.join(", ") || "",
        availableSizes: product?.availableSizes.join(", ") || "40, 41, 42, 43, 44, 45",
        isActive: product?.isActive ?? true,
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        
        const newImages = [...images];
        if (newImages.length + files.length > 3) {
            alert("Max 3 images allowed");
            return;
        }

        setIsUploading(true);
        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const result = await ApiService.cloudinary.upload(file);
                if (result.secure_url) {
                    newImages.push(result.secure_url);
                }
            }
            setImages(newImages);
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload failed. Please try again.");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    return (
        <>
        <Toast 
            message={toast.message} 
            isVisible={toast.isVisible} 
            onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} 
        />
        
        <form 
            action={async (formData) => {
                setIsLoading(true);
                try {
                    if (isEditing && product?.id) {
                         await updateProduct(product.id, formData);
                         setToast({ isVisible: true, message: "Product updated successfully" });
                    } else {
                         await createProduct(formData);
                         setToast({ isVisible: true, message: "Product created successfully" });
                    }
                    setTimeout(() => {
                        router.push("/admin");
                    }, 1000);
                } catch (error) {
                    console.error("Form error:", error);
                    alert("An error occurred while saving the product.");
                } finally {
                    setIsLoading(false);
                }
            }} 
            className="space-y-6 max-w-2xl bg-background p-6 rounded-lg border shadow-sm"
        >
            <div className="space-y-2">
                <label className="text-sm font-medium">Product Name</label>
                <input 
                    name="name" 
                    defaultValue={defaultValues.name}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea 
                    name="description" 
                    defaultValue={defaultValues.description}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Price (NGN)</label>
                    <input 
                        type="number"
                        name="price" 
                        defaultValue={defaultValues.price}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        required
                        min="0"
                    />
                </div>
                
                <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <select 
                        name="category"
                        defaultValue={defaultValues.category}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                        <option value="men">Men</option>
                        <option value="women">Women</option>
                        <option value="sandals">Sandals</option>
                        <option value="slippers">Slippers</option>
                        <option value="slides">Slides</option>
                    </select>
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-sm font-medium">Product Images (Max 3)</label>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {images.map((url, index) => (
                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden border bg-secondary/20">
                            <Image 
                                src={url} 
                                alt={`Product ${index + 1}`} 
                                fill 
                                className="object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    
                    {images.length < 3 && (
                        <button
                            type="button"
                            disabled={isUploading}
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square rounded-xl border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                        >
                            {isUploading ? (
                                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                            ) : (
                                <>
                                    <div className="p-2 rounded-full bg-secondary group-hover:scale-110 transition-transform">
                                        <Plus className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-medium text-muted-foreground">Upload</span>
                                </>
                            )}
                        </button>
                    )}
                </div>
                
                <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                />
                
                {/* Hidden input to pass URLs to the server action */}
                <input type="hidden" name="images" value={images.join(",")} />
                
                <p className="text-xs text-muted-foreground">
                    Upload up to 3 high-quality product images. Previews will be shown above.
                </p>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Available Sizes (Comma separated)</label>
                <input 
                    name="availableSizes" 
                    defaultValue={defaultValues.availableSizes}
                    placeholder="40, 41, 42"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
            </div>

            <div className="flex items-center space-x-2">
                <input 
                    type="checkbox"
                    name="isActive" 
                    id="isActive"
                    defaultChecked={defaultValues.isActive}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="isActive" className="text-sm font-medium">Active (Visible in store)</label>
            </div>

            <div className="flex gap-4 pt-4">
                 <Button type="submit" disabled={isUploading || isLoading}>
                    {isLoading ? "Saving..." : (isEditing ? "Update Product" : "Create Product")}
                 </Button>
                 <Button type="button" variant="outline" onClick={() => window.history.back()}>
                    Cancel
                 </Button>
            </div>
        </form>
        </>
    );
}
