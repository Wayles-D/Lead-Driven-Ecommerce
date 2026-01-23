"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { 
  User, 
  LogIn, 
  ShoppingCart, 
  ChevronDown, 
  LayoutDashboard, 
  Package, 
  LogOut,
  UserPlus,
  Menu,
  X
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { LogoutModal } from "@/components/auth/LogoutModal";

const navItems = [
  { name: "Shop", href: "/products" },
  { name: "About", href: "/about" },
];

export function Header() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-0 z-[60] w-full border-b bg-background/95 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 -ml-2 hover:bg-secondary rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-lg shadow-md md:shadow-lg border border-border/50">
              <Image 
                src="https://res.cloudinary.com/dmb5ggmvg/image/upload/v1765226721/Brown_and_Beige_Modern_Aesthetic_Fashion_Store_Design_Logo_2_ladbpd.png" 
                alt="OML Soles" 
                fill
                className="object-cover"
                priority
              />
            </div>
           <div className="gap-y-0">
                <h1 className="relative text-2xl poppins-black text-black hidden lg:block playfair-black">OML SOLES</h1>
                <p className="relative text-[8px] hidden lg:block text-right text-black">...the soft feel your feet needs</p>
              </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 items-center h-full">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-bold transition-colors hover:text-primary h-full flex items-center relative",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <Link
            href="/cart"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 transition-colors relative"
            title="Cart"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center bg-primary text-primary-foreground text-[10px] font-black rounded-full px-1 border-2 border-background">
                {totalItems}
              </span>
            )}
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 md:gap-2 p-1 md:pl-1 md:pr-2 rounded-full hover:bg-secondary transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-colors">
                <User size={18} />
              </div>
              <span className="hidden md:inline text-sm font-bold">
                {session?.user?.name || "Guest"}
              </span>
              <ChevronDown 
                size={14} 
                className={cn("hidden md:block text-muted-foreground transition-transform duration-200", dropdownOpen && "rotate-180")} 
              />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  className="absolute right-0 mt-3 w-64 dropdown-menu-strict z-[100]"
                  style={{ transformOrigin: "top right" }}
                >
                  {status === "unauthenticated" ? (
                    <>
                      <Link href="/login" className="dropdown-item-strict">
                        <LogIn size={18} />
                        <span>Login</span>
                      </Link>
                      <Link href="/signup" className="dropdown-item-strict">
                        <UserPlus size={18} />
                        <span>Sign Up</span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/account" className="dropdown-item-strict">
                        <User size={18} />
                        <span>My Account</span>
                      </Link>

                      {session?.user?.role === "ADMIN" && (
                        <Link href="/admin" className="dropdown-item-strict">
                          <LayoutDashboard size={18} />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <Link href="/orders" className="dropdown-item-strict">
                        <Package size={18} />
                        <span>My Orders</span>
                      </Link>
                      
                      <div className="h-px bg-white/10 my-1 mx-2" />
                      <button 
                        onClick={() => {
                          setDropdownOpen(false);
                          setLogoutModalOpen(true);
                        }}
                        className="w-full dropdown-item-strict"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden border-t bg-background overflow-hidden"
          >
            <nav className="flex flex-col p-4 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-4 py-3 rounded-xl text-lg font-bold transition-colors",
                    pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <LogoutModal 
        isOpen={logoutModalOpen} 
        onClose={() => setLogoutModalOpen(false)} 
      />
    </header>
  );
}
