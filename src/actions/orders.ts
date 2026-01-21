"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireAuth } from "@/lib/utils/session";
import { revalidatePath } from "next/cache";
import { EmailService } from "@/lib/email";


const orderSchema = z.object({
  shippingAddress: z.string().min(5, "Address is too short"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    selectedSize: z.number(),
  })).min(1, "Cart is empty"),
});

export async function createOrder(formData: FormData, cartItemsJson: string) {
  const session = await requireAuth();
  
  // Parse inputs
  const rawItems = JSON.parse(cartItemsJson);
  const rawData = {
    shippingAddress: formData.get("address"),
    city: formData.get("city"),
    state: formData.get("state"),
    items: rawItems,
  };

  const validated = orderSchema.parse(rawData);

  // Re-fetch products to ensure valid prices and existence
  const productIds = validated.items.map(i => i.productId);
  const dbProducts = await prisma.product.findMany({
    where: { id: { in: productIds } }
  });

  const productMap = new Map(dbProducts.map(p => [p.id, p]));

  // Calculate totals and prepare items
  let totalAmount = 0;
  const orderItemsData: {
    productId: string;
    productName: string;
    priceAtPurchase: number;
    quantity: number;
    selectedSize: number;
  }[] = [];

  for (const item of validated.items) {
    const product = productMap.get(item.productId);
    
    if (!product) {
      throw new Error(`Product ${item.productId} not found or unavailable`);
    }

    if (!product.isActive) {
        throw new Error(`Product ${product.name} is no longer available`);
    }

    const price = product.price;
    totalAmount += price * item.quantity;

    orderItemsData.push({
      productId: product.id,
      productName: product.name,
      priceAtPurchase: price,
      quantity: item.quantity,
      selectedSize: item.selectedSize,
    });
  }

  // Transaction: Create Order + Items
  const order = await prisma.$transaction(async (tx) => {
    return await tx.order.create({
      data: {
        userId: session.user.id,
        status: "UNPAID",
        fulfillmentStatus: "PROCESSING",
        totalAmount,
        shippingAddress: validated.shippingAddress,
        city: validated.city,
        state: validated.state,
        items: {
          create: orderItemsData,
        },
      },
    });
  });

  // Order Confirmation Email (Non-blocking)
  if (session.user.email) {
    EmailService.sendOrderConfirmation(session.user.email, order.id, totalAmount);
  }

  return { success: true, orderId: order.id };
}

export async function updateFulfillmentStatus(orderId: string, status: any) {
  await requireAdmin();

  const fulfillmentStatusSchema = z.enum(["PROCESSING", "SHIPPING", "SHIPPED", "DELIVERED"]);
  const validatedStatus = fulfillmentStatusSchema.parse(status);

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      fulfillmentStatus: validatedStatus,
    },
    include: {
        user: true
    }
  });

  // Fulfillment Email (Non-blocking)
  if (updatedOrder.user.email) {
    EmailService.sendFulfillmentUpdate(updatedOrder.user.email, orderId, validatedStatus);
  }

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  return { success: true };
}
