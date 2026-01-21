import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, Clock, MessageCircle, ArrowRight, Package, Calendar, MapPin, ReceiptText } from "lucide-react";
import { format } from "date-fns";
import { initiateCheckoutPayment } from "@/actions/payment";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/utils/session";
import { notFound, redirect } from "next/navigation";
import { WhatsAppService } from "@/lib/whatsapp";

interface SuccessPageProps {
  params: { id: string };
}

export default async function OrderSuccessPage({ params }: SuccessPageProps) {
  const session = await requireAuth();

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: true,
      user: true,
    },
  });

  if (!order) return notFound();
  if (order.userId !== session.user.id) return redirect("/");

  const isPaid = order.status === "PAID";

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="bg-card rounded-[3rem] border border-border shadow-2xl overflow-hidden">
        {/* Top Status Bar */}
        <div className={`p-8 md:p-12 text-center text-white space-y-4 ${isPaid ? 'bg-primary' : 'bg-orange-600'}`}>
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-md animate-in zoom-in duration-500">
            {isPaid ? (
              <CheckCircle2 className="w-10 h-10 text-white" />
            ) : (
              <Clock className="w-10 h-10 text-white" />
            )}
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {isPaid ? "Order Confirmed!" : "Order Received"}
            </h1>
            <p className="text-white/80 font-medium">
              {isPaid 
                ? "Your handcrafted items are now being prepared for you." 
                : "Your order is in our system, but the payment is still pending."
              }
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-8 md:p-12 space-y-12">
          {/* Order Snapshot */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <ReceiptText size={14} className="text-primary/60" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Order ID</span>
                </div>
                <p className="font-mono text-sm font-bold">#{order.id.slice(0, 8)}</p>
            </div>
            <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar size={14} className="text-primary/60" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Date</span>
                </div>
                <p className="text-sm font-medium">{format(order.createdAt, "MMM d, yyyy")}</p>
            </div>
            <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Package size={14} className="text-primary/60" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Status</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${isPaid ? 'bg-green-500' : 'bg-orange-500'}`} />
                    <p className="text-sm font-bold uppercase tracking-tighter">{order.status}</p>
                </div>
            </div>
            <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin size={14} className="text-primary/60" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Ship To</span>
                </div>
                <p className="text-sm font-medium truncate">{order.city}</p>
            </div>
          </div>

          <hr className="border-border/50" />

          {/* Items Summary */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight">Order Items</h2>
            <div className="space-y-4">
                {order.items.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-secondary/20 p-4 rounded-2xl border border-border/30 gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-background rounded-xl border border-border/50 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                                {item.quantity}x
                            </div>
                            <div className="min-w-0">
                                <p className="font-semibold text-sm break-words">{item.productName}</p>
                                <p className="text-xs text-muted-foreground">Size: {item.selectedSize} • {formatCurrency(item.priceAtPurchase)} ea</p>
                            </div>
                        </div>
                        <p className="font-bold text-sm tracking-tight sm:text-right whitespace-nowrap">{formatCurrency(item.priceAtPurchase * item.quantity)}</p>
                    </div>
                ))}
            </div>
            <div className="flex justify-between items-baseline pt-4 px-2 sm:px-4 gap-2">
                <span className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Total Amount</span>
                <span className="text-2xl sm:text-3xl font-bold tracking-tighter text-primary whitespace-nowrap">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
            {isPaid ? (
              <Button asChild className="h-14 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white border-none shadow-lg shadow-[#25D366]/20 transition-all font-bold gap-2" size="lg">
                <a 
                    href={WhatsAppService.getLink(WhatsAppService.getOrderConfirmationMessage(session.user.name || "Customer", order.id))} 
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <MessageCircle className="w-5 h-5" />
                    Confirm on WhatsApp
                </a>
              </Button>
            ) : (
                <form action={async () => {
                    "use server";
                    const result = await initiateCheckoutPayment(order.id);
                    if (result?.url) redirect(result.url);
                }}>
                  <Button className="w-full h-14 rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all gap-2" size="lg">
                    Re-initialize Payment
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
            )}
            
            <Button variant="outline" asChild className="h-14 rounded-2xl border-2 font-bold hover:bg-secondary/50" size="lg">
                <Link href="/products">
                    Continue Shopping
                </Link>
            </Button>
          </div>
          
          <div className="text-center">
            <Link href="/orders" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors underline underline-offset-4 decoration-border/50">
                View all orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
