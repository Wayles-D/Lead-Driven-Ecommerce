export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="font-bold text-lg mb-4">LDE Store</h3>
            <p className="text-muted-foreground max-w-sm">
              Premium quality products for discerning customers. 
              We prioritize quality, service, and transparent communication.
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
          &copy; {new Date().getFullYear()} Lead-Driven Ecommerce. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
