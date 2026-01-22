"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Package, ShoppingBag, Eye, Users, BarChart3 } from "lucide-react";

export function AdminHeader() {
  const pathname = usePathname();

  const links = [
    { name: "Products", href: "/admin", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  ];

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-16 z-30 overflow-hidden">
      <div className="container mx-auto h-12 flex items-center justify-between px-4">
        {/* Scrollable Navigation Container */}
        <div className="relative flex-1 overflow-hidden h-full">
          <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide h-full pr-12 md:pr-0">
            {links.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon size={14} />
                  {link.name}
                </Link>
              );
            })}
          </nav>
          
          {/* Mobile Swipe Hint (Gradient Overlay) */}
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-card/80 to-transparent pointer-events-none md:hidden" />
        </div>
        
        <Link 
          href="/" 
          className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:bg-secondary hover:text-foreground transition-all shrink-0 ml-2"
        >
          <Eye size={14} />
          <span className="hidden sm:inline">View Site</span>
        </Link>
      </div>
    </header>
  );
}
