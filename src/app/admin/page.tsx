import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ProductTable } from "@/components/admin/ProductTable";

export default async function AdminDashboard() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight">Products Dashboard</h1>
          <p className="text-muted-foreground">Manage your store&apos;s handcrafted collection.</p>
        </div>
        <Button asChild className="rounded-2xl h-12 px-6 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] gap-2">
          <Link href="/admin/products/new">
            <Plus size={18} />
            Add Product
          </Link>
        </Button>
      </div>

      <ProductTable initialProducts={products} />
    </div>
  );
}

