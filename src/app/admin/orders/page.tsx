import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/utils/session";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import Link from "next/link";
import { 
    Package, 
    ArrowUpRight, 
    Clock, 
    CheckCircle2, 
    Truck, 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HorizontalTable } from "@/components/ui/HorizontalTable";

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

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "PAID": return "bg-green-500/10 text-green-500 border-green-500/20";
            case "UNPAID": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
            case "CANCELLED": return "bg-red-500/10 text-red-500 border-red-500/20";
            default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
        }
    };

    const getFulfillmentStyles = (status: string) => {
        switch (status) {
            case "DELIVERED": return "bg-primary text-primary-foreground";
            case "SHIPPED": return "bg-blue-500 text-white";
            case "SHIPPING": return "bg-indigo-500 text-white";
            default: return "bg-secondary text-secondary-foreground";
        }
    };

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

            <div className="bg-card rounded-[2.5rem] border border-border shadow-2xl overflow-hidden">
                <HorizontalTable minWidth={1000}>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-secondary/20 border-b border-border">
                                <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-muted-foreground min-w-[120px]">Order ID</th>
                                <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-muted-foreground min-w-[200px]">Customer</th>
                                <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-muted-foreground min-w-[120px]">Amount</th>
                                <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-muted-foreground min-w-[120px]">Payment</th>
                                <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-muted-foreground min-w-[150px]">Fulfillment</th>
                                <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-muted-foreground text-right min-w-[120px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-secondary/10 transition-colors group">
                                    <td className="p-6">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-mono text-sm font-bold whitespace-nowrap">#{order.id.slice(0, 8)}</span>
                                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">{format(order.createdAt, "MMM d, HH:mm")}</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-sm whitespace-nowrap">{order.user.firstName} {order.user.lastName}</span>
                                            <span className="text-xs text-muted-foreground whitespace-nowrap">{order.user.email}</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className="font-bold text-base tracking-tighter whitespace-nowrap">{formatCurrency(order.totalAmount)}</span>
                                    </td>
                                    <td className="p-6">
                                        <Badge variant="outline" className={`rounded-full px-3 py-0.5 text-[10px] font-bold ${getStatusStyles(order.status)}`}>
                                            {order.status}
                                        </Badge>
                                    </td>
                                    <td className="p-6">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold border border-transparent whitespace-nowrap ${getFulfillmentStyles(order.fulfillmentStatus)}`}>
                                            {order.fulfillmentStatus === "PROCESSING" && <Clock size={12} />}
                                            {order.fulfillmentStatus === "SHIPPING" && <Truck size={12} />}
                                            {order.fulfillmentStatus === "DELIVERED" && <CheckCircle2 size={12} />}
                                            {order.fulfillmentStatus}
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <Button asChild variant="ghost" size="sm" className="rounded-xl hover:bg-primary/10 hover:text-primary gap-2 font-bold group">
                                            <Link href={`/admin/orders/${order.id}`}>
                                                Details
                                                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                            </Link>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </HorizontalTable>
                
                {orders.length === 0 && (
                    <div className="p-20 text-center space-y-4">
                        <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto">
                            <Package className="text-muted-foreground" size={32} />
                        </div>
                        <h3 className="text-xl font-bold">No orders found</h3>
                        <p className="text-muted-foreground">Orders will appear here once customers start purchasing.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
