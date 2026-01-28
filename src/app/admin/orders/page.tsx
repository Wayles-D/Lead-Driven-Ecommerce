import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/utils/session";
import { Package } from "lucide-react";
import { OrderTable } from "@/components/admin/OrderTable";

export default async function AdminOrdersPage() {
    await requireAdmin();

    const orders = await prisma.order.findMany({
        include: {
            user: true,
            items: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-bold tracking-tight">System Orders</h1>
                    <p className="text-muted-foreground">Manage and fulfill handcrafted orders across the platform.</p>
                </div>
                
                <div className="flex items-center gap-4 bg-card p-1.5 rounded-2xl border border-border shadow-sm">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/50 border border-border/50">
                        <Package size={16} className="text-primary" />
                        <span className="text-sm font-bold">{orders.length} Total</span>
                    </div>
                </div>
            </div>

            <OrderTable initialOrders={orders} />
        </div>
    );
}
