import { requireAuth } from "@/lib/utils/session";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { Package, Calendar, Mail, User as UserIcon, ChevronRight, ReceiptText, Shield } from "lucide-react";
import Link from "next/link";
import { DeactivateAccount } from "@/components/account/DeactivateAccount";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account | Lead-Driven Ecommerce",
};

export default async function AccountPage() {
  const session = await requireAuth();
  
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 10,
      }
    }
  });

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-6xl">
      <div className="space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/50 pb-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">My Account</h1>
            <p className="text-muted-foreground">Manage your profile and track your handcrafted orders.</p>
          </div>
          <div className="flex gap-4">
            <DeactivateAccount />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Sidebar / Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card rounded-[2.5rem] border border-border shadow-xl overflow-hidden">
                <div className="p-8 space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <UserIcon size={32} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{user.firstName} {user.lastName}</h2>
                            <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">{user.role}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-sm">
                            <Mail size={18} className="text-muted-foreground" />
                            <span className="font-medium">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Calendar size={18} className="text-muted-foreground" />
                            <span className="font-medium text-muted-foreground">Joined {format(user.createdAt, "MMMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Shield size={18} className="text-muted-foreground" />
                            <span className="font-medium text-muted-foreground">Account Status: <span className="text-green-500 font-bold uppercase tracking-tighter">Active</span></span>
                        </div>
                    </div>
                </div>
                <div className="border-t border-border/50 bg-secondary/10 p-4">
                     <p className="text-[10px] text-center text-muted-foreground font-bold uppercase tracking-widest">
                        Handcrafted with Excellence
                     </p>
                </div>
            </div>
          </div>

          {/* Main Content / Order History */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                    <Package className="text-primary" />
                    Order History
                </h2>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    {user.orders.length} Total Orders
                </span>
            </div>

            {user.orders.length === 0 ? (
                <div className="bg-card rounded-[2rem] border border-dashed border-border p-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto">
                        <ReceiptText className="text-muted-foreground" size={32} />
                    </div>
                    <h3 className="text-xl font-bold">No orders yet</h3>
                    <p className="text-muted-foreground text-balance">When you start shopping, your handcrafted orders will appear here.</p>
                    <Link href="/products" className="inline-block text-primary font-bold hover:underline py-2">
                        Explore Collection
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {user.orders.map((order) => (
                        <Link 
                            key={order.id} 
                            href={`/orders/${order.id}/success`} // Reusing the success page as it shows order details
                            className="block group"
                        >
                            <div className="bg-card p-6 rounded-[2rem] border border-border/50 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                                
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 relative">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Order ID</span>
                                            <span className="font-mono text-sm font-bold">#{order.id.slice(0, 8)}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <p className="text-lg font-bold tracking-tight">{formatCurrency(order.totalAmount)}</p>
                                            <div className="flex items-center gap-1.5 bg-secondary/50 px-3 py-1 rounded-full">
                                                <div className={`w-2 h-2 rounded-full ${order.status === 'PAID' ? 'bg-green-500' : 'bg-orange-500'}`} />
                                                <span className="text-[10px] font-black uppercase tracking-tighter">{order.status}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between md:text-right gap-6">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">{format(order.createdAt, "MMM d, yyyy")}</p>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{order.fulfillmentStatus}</p>
                                        </div>
                                        <div className="p-2 rounded-full bg-secondary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                            <ChevronRight size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
