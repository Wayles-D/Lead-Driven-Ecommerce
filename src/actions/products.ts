"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/utils/session";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { rateLimit } from "@/lib/rate-limit";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  category: z.string().min(1, "Category is required"),
  images: z.string().transform((str) => str.split(",").map((s) => s.trim()).filter(Boolean)),
  availableSizes: z.string().transform((str) => 
    str.split(",")
       .map((s) => parseInt(s.trim()))
       .filter((n) => !isNaN(n))
  ),
  isActive: z.coerce.boolean(),
});

export async function createProduct(formData: FormData) {
  await requireAdmin();

  // Rate limiting: 10 requests per minute
  const limiter = await rateLimit({ limit: 10, windowMs: 60 * 1000, identifier: "admin-mutation" });
  if (!limiter.success) throw new Error(limiter.error);

  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    category: formData.get("category"),
    images: formData.get("images"),
    availableSizes: formData.get("availableSizes"),
    isActive: formData.get("isActive") === "on",
  };

  const validated = productSchema.parse(rawData);

  await prisma.product.create({
    data: validated,
  });

  revalidatePath("/products");
  revalidatePath("/admin");
  revalidateTag("products");
  redirect("/admin");
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();

  // Rate limiting: 10 requests per minute
  const limiter = await rateLimit({ limit: 10, windowMs: 60 * 1000, identifier: "admin-mutation" });
  if (!limiter.success) throw new Error(limiter.error);

  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    category: formData.get("category"),
    images: formData.get("images"),
    availableSizes: formData.get("availableSizes"),
    isActive: formData.get("isActive") === "on",
  };

  const validated = productSchema.parse(rawData);

  await prisma.product.update({
    where: { id },
    data: validated,
  });

  revalidatePath("/products");
  revalidatePath("/admin");
  revalidateTag("products");
  redirect("/admin");
}

export async function deleteProduct(id: string) {
  await requireAdmin();

  // Rate limiting: 10 requests per minute
  const limiter = await rateLimit({ limit: 10, windowMs: 60 * 1000, identifier: "admin-mutation" });
  if (!limiter.success) throw new Error(limiter.error);

  try {
    // Check if product is in any orders
    const orderCount = await prisma.orderItem.count({
      where: { productId: id }
    });

    if (orderCount > 0) {
      return { 
        success: false, 
        message: "This product is linked to existing user orders and cannot be deleted. " + 
                "To hide it from the store, please set its status to 'Draft' instead." 
      };
    }

    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/products");
    revalidatePath("/admin");
    revalidateTag("products");
    return { success: true };
  } catch (error) {
    console.error("Delete product error:", error);
    return { 
      success: false, 
      message: "An unexpected error occurred while trying to delete the product." 
    };
  }
}

export async function toggleProductStatus(id: string, isActive: boolean) {
  await requireAdmin();

  // Rate limiting: 10 requests per minute
  const limiter = await rateLimit({ limit: 10, windowMs: 60 * 1000, identifier: "admin-mutation" });
  if (!limiter.success) throw new Error(limiter.error);

  await prisma.product.update({
    where: { id },
    data: { isActive },
  });

  revalidatePath("/products");
  revalidatePath("/admin");
  revalidateTag("products");
}

export async function searchProducts(query: string) {
  if (!query || typeof query !== "string") return [];

  const trimmedQuery = query.trim();
  if (!trimmedQuery) return [];

  return await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: trimmedQuery, mode: "insensitive" } },
        { description: { contains: trimmedQuery, mode: "insensitive" } },
        { category: { contains: trimmedQuery, mode: "insensitive" } },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
