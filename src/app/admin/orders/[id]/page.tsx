import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/utils/session";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { 
    Package, 
    MapPin, 
    User, 
    CreditCard, 
    ArrowLeft,
    CheckCircle2,
    Clock
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FulfillmentUpdater } from "@/components/admin/FulfillmentUpdater";
import { CopyReferenceButton } from "@/components/admin/CopyReferenceButton";

interface AdminOrderDetailPageProps {
    params: { id: string };
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
    await requireAdmin();

    const order = await prisma.order.findUnique({
        where: { id: params.id },
        include: {
            user: true,
            items: true,
            payment: true,
        },
    });

    if (!order) return notFound();

    const isPaid = order.status === "PAID";

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl space-y-10">
            <Link 
                href="/admin/orders" 
                className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
            </Link>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-bold tracking-tighter">Order #{order.id.slice(0, 8)}</h1>
                    <p className="text-muted-foreground">Detailed overview and fulfillment management.</p>
                </div>

                <FulfillmentUpdater orderId={order.id} initialStatus={order.fulfillmentStatus} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Items & Summary */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-card rounded-[2rem] border border-border shadow-xl p-8 space-y-6">
                        <div className="flex items-center gap-3 border-b border-border/50 pb-6">
                            <Package className="text-primary" />
                            <h2 className="text-xl font-bold">Ordered Items</h2>
                        </div>
                        
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center bg-secondary/10 p-4 rounded-2xl border border-border/30">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-background rounded-xl border border-border/50 flex items-center justify-center text-[10px] font-black">
                                            {item.quantity}x
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{item.productName}</p>
                                            <p className="text-xs text-muted-foreground">Size: {item.selectedSize} • {formatCurrency(item.priceAtPurchase)} ea</p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-sm tracking-tight">{formatCurrency(item.priceAtPurchase * item.quantity)}</p>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-border/50 flex justify-between items-baseline px-4">
                            <span className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Grand Total</span>
                            <span className="text-4xl font-bold tracking-tighter text-primary">{formatCurrency(order.totalAmount)}</span>
                        </div>
                    </div>

                    <div className="bg-card rounded-[2rem] border border-border shadow-xl p-8 space-y-6">
                        <div className="flex items-center gap-3 border-b border-border/50 pb-6">
                            <MapPin className="text-primary" />
                            <h2 className="text-xl font-bold">Shipping Details</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Address</span>
                                    <p className="text-sm font-medium leading-relaxed">{order.shippingAddress}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Location</span>
                                    <p className="text-sm font-medium">{order.city}, {order.state}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Customer & Payment */}
                <div className="space-y-8">
                    <div className="bg-card rounded-[2rem] border border-border shadow-xl p-8 space-y-6">
                        <div className="flex items-center gap-3 border-b border-border/50 pb-6">
                            <User className="text-primary" />
                            <h2 className="text-xl font-bold">Customer</h2>
                        </div>
                        <div className="px-4 space-y-4">
                            <div className="space-y-1">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Full Name</span>
                                <p className="font-bold">{order.user.firstName} {order.user.lastName}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Contact</span>
                                <p className="text-sm">{order.user.email}</p>
                                <p className="text-sm">{order.user.phoneNumber}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-[2rem] border border-border shadow-xl p-8 space-y-6 overflow-hidden">
                        <div className="flex items-center gap-3 border-b border-border/50 pb-6">
                            <CreditCard className="text-primary" />
                            <h2 className="text-xl font-bold">Payment</h2>
                        </div>
                        <div className="px-4 space-y-4">
                            <div className={`p-4 rounded-xl border flex items-center justify-between ${isPaid ? 'bg-green-500/10 border-green-500/20 text-green-600' : 'bg-orange-500/10 border-orange-500/20 text-orange-600'}`}>
                                <span className="text-xs font-black uppercase tracking-widest">{order.status}</span>
                                {isPaid ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                            </div>
                            
                            {order.payment && (
                                <div className="space-y-3 text-xs">
                                     <div className="flex justify-between">
                                        <span className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">Provider</span>
                                        <span className="font-mono">{order.payment.provider}</span>
                                    </div>
                                    <div className="space-y-1 py-1">
                                        <div className="flex justify-between items-start">
                                            <span className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">Reference</span>
                                            <CopyReferenceButton reference={order.payment.reference} />
                                        </div>
                                        <p className="font-mono break-all text-muted-foreground bg-secondary/30 p-2 rounded-lg border border-border/50">
                                            {order.payment.reference}
                                        </p>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">Paid At</span>
                                        <span className="font-mono">
                                            {order.payment.paidAt ? format(order.payment.paidAt, "MMM d, HH:mm") : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
