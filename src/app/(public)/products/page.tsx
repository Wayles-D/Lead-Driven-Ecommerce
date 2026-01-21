import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/ProductCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Collection | Lead-Driven Ecommerce",
  description: "Browse our premium collection of footwear.",
};

interface ProductsPageProps {
  searchParams: {
    category?: string;
  };
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const category = searchParams.category;

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(category ? { category: category } : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const categories = ["sandals", "slides", "slippers", "men", "women"];

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            {category
              ? `${
                  category.charAt(0).toUpperCase() + category.slice(1)
                } Collection`
              : "All Products"}
          </h1>
          <p className="text-muted-foreground mt-2">
            Showing {products.length}{" "}
            {products.length === 1 ? "product" : "products"}
          </p>
        </div>

        {/* Simple Category Filter */}
        <div className="flex flex-wrap gap-2">
          <a
            href="/products"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !category
                ? "bg-primary text-primary-foreground"
                : "bg-secondary hover:bg-secondary/80"
            }`}
          >
            All
          </a>
          {categories.map((cat) => (
            <a
              key={cat}
              href={`/products?category=${cat}`}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                category === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-secondary/80"
              }`}
            >
              {cat}
            </a>
          ))}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center p-8 bg-secondary/20 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">No products found</h2>
          <p className="text-muted-foreground">
            Try selecting a different category or checking back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              category={product.category}
              description={product.description}
              images={product.images}
            />
          ))}
        </div>
      )}
    </div>
  );
}
