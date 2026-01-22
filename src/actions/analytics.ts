"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/utils/session";
import { startOfDay, startOfWeek, startOfMonth } from "date-fns";

/**
 * Admin Analytics Actions
 */

export async function getAdminUsers() {
    await requireAdmin();

    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            _count: {
                select: { orders: true }
            },
            orders: {
                select: { totalAmount: true }
            }
        }
    });

    return users.map(user => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        totalOrders: user._count.orders,
        totalSpent: user.orders.reduce((sum, order) => sum + order.totalAmount, 0),
        isActive: user.isActive
    }));
}

export async function getRevenueAnalytics() {
    await requireAdmin();

    const now = new Date();
    const todayStart = startOfDay(now);
    const weekStart = startOfWeek(now);
    const monthStart = startOfMonth(now);

    // Fetch all PAID orders to calculate analytics
    // In a real large-scale app, we might use aggregate queries, 
    // but for this phase, we'll fetch then calculate to ensure precision and logic.
    const paidOrders = await prisma.order.findMany({
        where: { status: "PAID" },
        select: {
            totalAmount: true,
            createdAt: true
        }
    });

    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    
    const revenueToday = paidOrders
        .filter(o => o.createdAt >= todayStart)
        .reduce((sum, o) => sum + o.totalAmount, 0);

    const revenueThisWeek = paidOrders
        .filter(o => o.createdAt >= weekStart)
        .reduce((sum, o) => sum + o.totalAmount, 0);

    const revenueThisMonth = paidOrders
        .filter(o => o.createdAt >= monthStart)
        .reduce((sum, o) => sum + o.totalAmount, 0);

    return {
        totalRevenue,
        revenueToday,
        revenueThisWeek,
        revenueThisMonth,
        orderCount: paidOrders.length
    };
}
