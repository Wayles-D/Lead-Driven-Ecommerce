import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import { deleteProduct, toggleProductStatus } from "@/actions/products";
import { HorizontalTable } from "@/components/ui/HorizontalTable";
import { Package, Plus, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboard() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your store&apos;s handcrafted collection.</p>
        </div>
        <Button asChild className="rounded-2xl h-12 px-6 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] gap-2">
          <Link href="/admin/products/new">
            <Plus size={18} />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="bg-card rounded-[2.5rem] border border-border shadow-2xl overflow-hidden">
        <HorizontalTable minWidth={800}>
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
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto">
                      <Package className="text-muted-foreground" size={32} />
                    </div>
                    <h3 className="text-xl font-bold">No products found</h3>
                    <p className="text-muted-foreground">Create your first product to start selling.</p>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
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
                        "use server";
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
                        <form action={deleteProduct.bind(null, product.id)} className="inline">
                          <Button variant="ghost" size="sm" type="submit" className="rounded-xl hover:bg-destructive/10 hover:text-destructive gap-2 font-bold py-0 h-9">
                            <Trash2 size={14} />
                            Delete
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </HorizontalTable>
      </div>
    </div>
  );
}
