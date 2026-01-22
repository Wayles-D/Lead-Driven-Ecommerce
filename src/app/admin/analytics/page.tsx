import { getRevenueAnalytics } from "@/actions/analytics";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, DollarSign, Calendar, BarChart3, CreditCard, Activity } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Analytics Dashboard | Admin",
};

export default async function AdminAnalyticsPage() {
    const analytics = await getRevenueAnalytics();

    const stats = [
        {
            label: "Total Revenue",
            value: formatCurrency(analytics.totalRevenue),
            icon: DollarSign,
            color: "text-green-500",
            bg: "bg-green-500/10",
            description: "Accumulated income from all completed orders",
        },
        {
            label: "Revenue Today",
            value: formatCurrency(analytics.revenueToday),
            icon: Activity,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            description: "Earnings since 12:00 AM today",
        },
        {
            label: "This Week",
            value: formatCurrency(analytics.revenueThisWeek),
            icon: BarChart3,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            description: "Earnings since start of the week",
        },
        {
            label: "This Month",
            value: formatCurrency(analytics.revenueThisMonth),
            icon: Calendar,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
            description: "Earnings since start of the month",
        },
    ];

    return (
        <div className="space-y-12">
            <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
                    <TrendingUp className="text-primary" />
                    Revenue Analytics
                </h1>
                <p className="text-muted-foreground">Real-time financial performance based on paid orders.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-card p-8 rounded-[2.5rem] border border-border shadow-xl hover:-translate-y-1 transition-all group">
                            <div className="space-y-6">
                                <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
                                    <Icon size={24} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">{stat.label}</p>
                                    <p className="text-3xl font-bold tracking-tighter">{stat.value}</p>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">{stat.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-card p-12 rounded-[3.5rem] border border-border shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -mr-48 -mt-48 blur-3xl" />
                
                <div className="relative space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">Performance Summary</h2>
                            <p className="text-muted-foreground text-sm">A summary of transaction volume.</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-12">
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Transactions</p>
                            <p className="text-5xl font-bold tracking-tighter">{analytics.orderCount}</p>
                            <p className="text-xs font-medium text-muted-foreground">Successful PAID orders</p>
                        </div>
                        <div className="w-[1px] bg-border/50 hidden sm:block" />
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Avg. Order Value</p>
                            <p className="text-5xl font-bold tracking-tighter">
                                {analytics.orderCount > 0 
                                    ? formatCurrency(Math.floor(analytics.totalRevenue / analytics.orderCount))
                                    : formatCurrency(0)
                                }
                            </p>
                            <p className="text-xs font-medium text-muted-foreground">Total Revenue / Paid Orders</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
