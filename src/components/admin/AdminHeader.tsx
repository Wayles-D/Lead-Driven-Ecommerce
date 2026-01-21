"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Package, ShoppingBag, Eye } from "lucide-react";

export function AdminHeader() {
  const pathname = usePathname();

  const links = [
    { name: "Products", href: "/admin", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  ];

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-16 z-30">
      <div className="container mx-auto px-4 h-12 flex items-center justify-between">
        <nav className="flex items-center gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all",
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
        
        <Link 
          href="/" 
          className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] uppercase tracking-widest font-bold text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
        >
          <Eye size={14} />
          <span className="hidden sm:inline">View Site</span>
        </Link>
      </div>
    </header>
  );
}
