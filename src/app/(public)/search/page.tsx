import { searchProducts } from "@/actions/products";
import { ProductCard } from "@/components/product/ProductCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Results | OML Soles",
  description: "Search results for footwear in our collection.",
};

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

/**
 * Search results page that fetches and displays products based on a query.
 * Reuses the ProductCard component for consistency.
 */
export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const query = searchParams.q || "";
  const products = await searchProducts(query);

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 min-h-[70vh]">
      <div className="max-w-4xl mb-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 playfair-black">
          {query ? `Results for "${query}"` : "Search Collection"}
        </h1>
        <p className="text-muted-foreground text-lg font-medium italic">
          {products.length > 0 
            ? `We found ${products.length} exquisite ${products.length === 1 ? "piece" : "pieces"} matching your request.`
            : query 
              ? `No products found matching "${query}".`
              : "Try searching for a product name, category, or description."
          }
        </p>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-16 bg-secondary/10 rounded-[3rem] border border-dashed border-border/40">
          <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mb-8 animate-pulse">
             <span className="text-3xl">🔍</span>
          </div>
          <h2 className="text-2xl font-bold mb-4 tracking-tight">No matching products found</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-10 leading-relaxed font-medium">
            It seems we don&apos;t have exactly what you&apos;re looking for right now. 
            Try a different keyword or browse our full artisan collection.
          </p>
          <a
            href="/products"
            className="px-10 py-4 bg-primary text-primary-foreground rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20 active:scale-95"
          >
            Browse All Collection
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
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
