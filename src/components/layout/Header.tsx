"use client";

import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
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
import { SearchInput } from "@/components/ui/SearchInput";

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
  const [isScrolled, setIsScrolled] = useState(false);
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

  // Handle scroll for transparent navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = pathname === "/";
  const isTransparent = isHome && !isScrolled && !mobileMenuOpen;

  return (
    <header 
      className={cn(
        "fixed top-0 z-[60] w-full transition-all duration-500",
        isTransparent 
          ? "bg-transparent border-transparent shadow-none" 
          : "bg-background border-b border-border shadow-sm backdrop-blur-md"
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button 
            className={cn(
              "md:hidden p-2 -ml-2 rounded-lg transition-colors",
              isTransparent ? "text-white hover:bg-white/10" : "text-foreground hover:bg-secondary"
            )}
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
                <h1 className={cn(
                  "relative text-2xl poppins-black hidden lg:block playfair-black transition-colors duration-500",
                  isTransparent ? "text-white" : "text-black"
                )}>OML SOLES</h1>
                <p className={cn(
                  "relative text-[8px] hidden lg:block text-right transition-colors duration-500",
                  isTransparent ? "text-white/70" : "text-black"
                )}>...the soft feel your feet needs</p>
              </div>
          </Link>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex items-center flex-1 max-w-[320px] mx-8">
          <Suspense fallback={<div className="w-full h-10 bg-secondary/10 rounded-full animate-pulse" />}>
            <SearchInput isTransparent={isTransparent} />
          </Suspense>
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
                  "text-sm font-bold transition-colors h-full flex items-center relative",
                  isActive 
                    ? "text-primary" 
                    : isTransparent ? "text-white/80 hover:text-white" : "text-muted-foreground hover:text-primary"
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
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 relative",
              isTransparent ? "bg-white/10 text-white hover:bg-white/20" : "bg-secondary hover:bg-secondary/80 text-foreground"
            )}
            title="Cart"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className={cn(
                "absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center bg-primary text-primary-foreground text-[10px] font-black rounded-full px-1 border-2",
                isTransparent ? "border-transparent" : "border-background"
              )}>
                {totalItems}
              </span>
            )}
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={cn(
                "flex items-center gap-1 md:gap-2 p-1 md:pl-1 md:pr-2 rounded-full transition-all duration-300 group",
                isTransparent ? "hover:bg-white/10" : "hover:bg-secondary"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300",
                isTransparent 
                  ? "bg-white/10 text-white border-white/20 group-hover:bg-white/20" 
                  : "bg-primary/10 text-primary border-primary/20 group-hover:bg-primary/20"
              )}>
                <User size={18} />
              </div>
              <span className={cn(
                "hidden md:inline text-sm font-bold transition-colors duration-300",
                isTransparent ? "text-white" : "text-foreground"
              )}>
                {session?.user?.name || "Guest"}
              </span>
              <ChevronDown 
                size={14} 
                className={cn(
                  "hidden md:block transition-all duration-200", 
                  isTransparent ? "text-white/70" : "text-muted-foreground",
                  dropdownOpen && "rotate-180"
                )} 
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
            <nav className="flex flex-col p-4 gap-4">
              <Suspense fallback={<div className="w-full h-10 bg-secondary/10 rounded-full animate-pulse" />}>
                <SearchInput className="max-w-none" />
              </Suspense>
              <div className="flex flex-col gap-2">
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
              </div>
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
