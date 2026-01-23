import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 overflow-hidden rounded-lg shadow-xl border border-border/50">
                <Image 
                  src="https://res.cloudinary.com/dmb5ggmvg/image/upload/v1765226721/Brown_and_Beige_Modern_Aesthetic_Fashion_Store_Design_Logo_2_ladbpd.png" 
                  alt="OML Soles" 
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold playfair-black">OML SOLES</h3>
                <p className="text-[8px] text-black noto-sans-light-300">...the soft feel your feet needs</p>
              </div>
            </div>
            <p className="text-muted-foreground max-w-sm">
              Artisan footwear handcrafted with intention and premium materials. 
              We believe in the beauty of made-to-order craftsmanship and the comfort of quality.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="/products" className="hover:text-primary transition-colors">All Products</a></li>
              <li><a href="/products?category=new" className="hover:text-primary transition-colors">New Arrivals</a></li>
              <li><a href="/products?category=featured" className="hover:text-primary transition-colors">Featured</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Help</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="/faq" className="hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="/shipping" className="hover:text-primary transition-colors">Shipping</a></li>
              <li><a href="/returns" className="hover:text-primary transition-colors">Returns</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} OML Soles. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
