import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image?: string;
}

export function ProductCard({ id, name, price, category, description, image }: ProductCardProps) {
  return (
    <div className="group flex flex-col bg-card border border-border rounded-[2rem] overflow-hidden transition-all hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1">
      {/* Product Image only */}
      <Link href={`/products/${id}`} className="aspect-[4/5] overflow-hidden bg-secondary relative block">
        {image ? (
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 font-medium">
             {name}
          </div>
        )}
      </Link>

      <div className="p-6 flex flex-col flex-1 gap-4">
        <div className="space-y-1">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-lg leading-tight text-foreground line-clamp-1">
              {name}
            </h3>
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground/50 shrink-0">
              {category}
            </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
            {description}
          </p>
        </div>

        <div className="mt-auto pt-2 flex flex-col gap-4">
          <p className="text-xl font-black tracking-tighter text-primary">
            {formatCurrency(price)}
          </p>
          
          <Button asChild className="w-full h-12 rounded-xl font-bold group" variant="secondary">
            <Link href={`/products/${id}`}>
              View Product
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
