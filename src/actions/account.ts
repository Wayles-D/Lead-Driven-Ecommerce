"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/utils/session";

/**
 * Account Management Actions
 */

export async function deactivateAccount() {
    const session = await requireAuth();
    const userId = session.user.id;

    // Deactivation rules:
    // User CANNOT deactivate if they have any PAID orders that are NOT fully fulfilled (not DELIVERED)
    const activeOrders = await prisma.order.findFirst({
        where: {
            userId,
            status: "PAID",
            fulfillmentStatus: {
                not: "DELIVERED"
            }
        }
    });

    if (activeOrders) {
        return { 
            error: "Cannot deactivate account with active orders. Please wait for your orders to be delivered." 
        };
    }

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { isActive: false }
        });

        // The user will be logged out by the client after this action returns success
        return { success: true };
    } catch (error) {
        console.error("Account deactivation error:", error);
        return { error: "Failed to deactivate account. Please try again later." };
    }
}

export async function getUserOrders() {
    const session = await requireAuth();
    
    return await prisma.order.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        include: {
            items: true
        }
    });
}
