"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
    Package, 
    Plus, 
    Edit, 
    Search, 
    X, 
    Filter, 
    ChevronDown 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HorizontalTable } from "@/components/ui/HorizontalTable";
import { cn, formatCurrency } from "@/lib/utils";
import { toggleProductStatus } from "@/actions/products";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

interface ProductRow {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    isActive: boolean;
    createdAt: Date;
}

export function ProductTable({ initialProducts }: { initialProducts: ProductRow[] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    // Get unique categories
    const categories = ["all", ...Array.from(new Set(initialProducts.map(p => p.category)))];

    const filteredProducts = initialProducts.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
        const matchesStatus = statusFilter === "all" || 
            (statusFilter === "active" ? product.isActive : !product.isActive);
        
        return matchesSearch && matchesCategory && matchesStatus;
    });

    return (
        <div className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                        type="text"
                        placeholder="Search products by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-10 h-12 rounded-2xl border border-border bg-card shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm"
                    />
                    {searchQuery && (
                        <button 
                            onClick={() => setSearchQuery("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className="relative inline-block">
                        <select 
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="appearance-none h-12 pl-4 pr-10 rounded-2xl border border-border bg-card shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-medium capitalize cursor-pointer min-w-[140px]"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat === "all" ? "All Categories" : cat}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={14} />
                    </div>

                    <div className="relative inline-block">
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none h-12 pl-4 pr-10 rounded-2xl border border-border bg-card shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm font-medium cursor-pointer min-w-[140px]"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="draft">Draft</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={14} />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-card rounded-[2.5rem] border border-border shadow-2xl overflow-hidden">
                <HorizontalTable minWidth={900}>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-secondary/20 border-b border-border">
                                <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-muted-foreground min-w-[250px]">Product</th>
                                <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-muted-foreground min-w-[120px]">Price</th>
                                <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-muted-foreground min-w-[150px]">Category</th>
                                <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-muted-foreground min-w-[120px]">Status</th>
                                <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-muted-foreground text-right min-w-[150px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-secondary/10 transition-colors group">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-secondary overflow-hidden border border-border flex items-center justify-center relative">
                                                {product.images[0] ? (
                                                    <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                                                ) : (
                                                    <Package size={20} className="text-muted-foreground/30" />
                                                )}
                                            </div>
                                            <span className="font-bold text-sm">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className="font-bold text-base tracking-tighter">{formatCurrency(product.price)}</span>
                                    </td>
                                    <td className="p-6 capitalize">
                                        <Badge variant="secondary" className="rounded-full px-3 py-0.5 text-[10px] font-bold">
                                            {product.category}
                                        </Badge>
                                    </td>
                                    <td className="p-6">
                                        <form action={async () => {
                                            await toggleProductStatus(product.id, !product.isActive);
                                        }}>
                                            <button className={cn(
                                                "px-3 py-1 rounded-full text-[10px] font-bold border transition-colors",
                                                product.isActive 
                                                    ? "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20" 
                                                    : "bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20"
                                            )}>
                                                {product.isActive ? 'Active' : 'Draft'}
                                            </button>
                                        </form>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="sm" className="rounded-xl hover:bg-primary/10 hover:text-primary gap-2 font-bold group" asChild>
                                                <Link href={`/admin/products/${product.id}`}>
                                                    <Edit size={14} />
                                                    Edit
                                                </Link>
                                            </Button>
                                            <DeleteProductButton productId={product.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </HorizontalTable>
                
                {filteredProducts.length === 0 && (
                    <div className="p-20 text-center space-y-4">
                        <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto">
                            <Package className="text-muted-foreground" size={32} />
                        </div>
                        <h3 className="text-xl font-bold">No products found</h3>
                        <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
                        <button 
                            onClick={() => {
                                setSearchQuery("");
                                setCategoryFilter("all");
                                setStatusFilter("all");
                            }}
                            className="text-primary font-bold hover:underline"
                        >
                            Reset filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
