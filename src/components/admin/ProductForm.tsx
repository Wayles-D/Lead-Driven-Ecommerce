"use client";

import { createProduct, updateProduct } from "@/actions/products";
import { Button } from "@/components/ui/button";
import { useState } from "react";


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
    const isEditing = !!product;
    const [isLoading, setIsLoading] = useState(false);

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

    return (
        <form 
            action={async (formData) => {
                setIsLoading(true);
                try {
                    if (isEditing && product?.id) {
                         await updateProduct(product.id, formData);
                    } else {
                         await createProduct(formData);
                    }
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

            <div className="space-y-2">
                <label className="text-sm font-medium">Images (Comma separated URLs)</label>
                <input 
                    name="images" 
                    defaultValue={defaultValues.images}
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                <p className="text-xs text-muted-foreground">For Phase 3, paste manual Cloudinary URLs here.</p>
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
                 <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : (isEditing ? "Update Product" : "Create Product")}
                 </Button>
                 <Button type="button" variant="outline" onClick={() => window.history.back()}>
                    Cancel
                 </Button>
            </div>
        </form>
    );
}
