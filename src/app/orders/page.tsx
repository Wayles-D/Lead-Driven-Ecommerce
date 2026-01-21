import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/utils/session";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShoppingBag, ChevronRight, Clock, CheckCircle2, Package, Truck, XCircle } from "lucide-react";
import { format } from "date-fns";
import { initiateCheckoutPayment } from "@/actions/payment";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Order History | LDE Store",
    description: "View and track your previous orders",
};

export default async function OrdersPage() {
    const session = await requireAuth();

    const orders = await prisma.order.findMany({
        where: {
            userId: session.user.id,
        },
        include: {
            items: true,
            payment: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "PAID": return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case "UNPAID": return <Clock className="w-4 h-4 text-orange-500" />;
            case "CANCELLED": return <XCircle className="w-4 h-4 text-destructive" />;
            default: return <Clock className="w-4 h-4 text-muted-foreground" />;
        }
    };

    const getFulfillmentIcon = (status: string) => {
        switch (status) {
            case "PROCESSING": return <Package className="w-4 h-4" />;
            case "SHIPPING":
            case "SHIPPED": return <Truck className="w-4 h-4" />;
            case "DELIVERED": return <CheckCircle2 className="w-4 h-4" />;
            default: return <Package className="w-4 h-4" />;
        }
    };

    if (orders.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20">
                <div className="max-w-md mx-auto text-center space-y-6">
                    <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mx-auto">
                        <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">No orders yet</h1>
                        <p className="text-muted-foreground">Once you place an order, it will appear here for you to track.</p>
                    </div>
                    <Button asChild rounded-full px-8>
                        <Link href="/products">Browse Products</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl space-y-10">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
                <p className="text-muted-foreground">Manage and track all your handcrafted purchases.</p>
            </div>

            <div className="space-y-6">
                {orders.map((order) => (
                    <div 
                        key={order.id} 
                        className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden group hover:border-primary/20 transition-all duration-300"
                    >
                        {/* Order Header */}
                        <div className="p-6 md:p-8 border-b border-border/50 bg-secondary/10 flex flex-wrap gap-6 justify-between items-center">
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Order ID</p>
                                <p className="font-mono font-bold text-sm">#{order.id}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Placed On</p>
                                <p className="text-sm font-medium">{format(order.createdAt, "MMM d, yyyy")}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Total Amount</p>
                                <p className="text-sm font-bold text-primary">{formatCurrency(order.totalAmount)}</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex items-center gap-2 bg-background border rounded-full px-4 py-1.5 text-xs font-bold shadow-sm">
                                    {getStatusIcon(order.status)}
                                    <span className="uppercase tracking-tight">{order.status}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-background border rounded-full px-4 py-1.5 text-xs font-bold shadow-sm text-muted-foreground">
                                    {getFulfillmentIcon(order.fulfillmentStatus)}
                                    <span className="uppercase tracking-tight">{order.fulfillmentStatus}</span>
                                </div>
                            </div>
                        </div>

                        {/* Order Content */}
                        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 justify-between">
                            <div className="flex-1 space-y-4">
                                <div className="space-y-3">
                                    {order.items.slice(0, 3).map((item) => (
                                        <div key={item.id} className="flex gap-4 items-center">
                                            <div className="w-12 h-12 bg-secondary/50 rounded-lg flex items-center justify-center text-[10px] font-bold border border-border/50 overflow-hidden">
                                                {/* In a real app, you'd show a thumbnail here */}
                                                <Package className="w-5 h-5 text-muted-foreground/50" />
                                            </div>
                                            <div className="flex-1 text-sm">
                                                <p className="font-semibold">{item.productName}</p>
                                                <p className="text-muted-foreground text-xs">Size: {item.selectedSize} • Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {order.items.length > 3 && (
                                        <p className="text-xs text-muted-foreground pl-16">
                                            + {order.items.length - 3} more items
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 justify-center min-w-[200px]">
                                {order.status === "UNPAID" ? (
                                    <form action={async () => {
                                        "use server";
                                        const result = await initiateCheckoutPayment(order.id);
                                        if (result?.url) {
                                            redirect(result.url);
                                        }
                                    }}>
                                        <Button className="w-full h-11 rounded-2xl font-bold group" size="sm">
                                            Complete Payment
                                            <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                        </Button>
                                    </form>
                                ) : (
                                    <Button variant="outline" className="w-full h-11 rounded-2xl font-bold" size="sm" asChild>
                                        <Link href={`/orders/${order.id}/success`}>
                                            View Order
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
