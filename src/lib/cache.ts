import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

/**
 * Tag-based caching for product-related data.
 * All public reads are cached to reduce DB load.
 */

export const getCachedProducts = unstable_cache(
  async (category?: string) => {
    return await prisma.product.findMany({
      where: {
        isActive: true,
        ...(category ? { category: category } : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },
  ["products-list"],
  { tags: ["products"] }
);

export const getCachedProductById = unstable_cache(
  async (id: string) => {
    return await prisma.product.findUnique({
      where: { id },
    });
  },
  ["product-detail"],
  { tags: ["products"] }
);

export const getCachedCategories = unstable_cache(
  async () => {
    // In this app, categories are derived/static
    return ["sandals", "slides", "slippers", "men", "women"];
  },
  ["product-categories"],
  { tags: ["products"] }
);

export const getCachedSearchResults = unstable_cache(
  async (query: string) => {
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
  },
  ["product-search"],
  { tags: ["products"] }
);
