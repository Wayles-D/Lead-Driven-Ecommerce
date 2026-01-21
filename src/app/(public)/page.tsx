"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { img } from "framer-motion/m";

export default function Home() {
  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-16">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex flex-col items-center justify-center text-center px-4 bg-secondary/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl space-y-6"
        >
          <span className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
            Est. 2026
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary">
            Crafted for Excellence.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience premium quality with a seamless shopping experience. 
            We prioritize craftsmanship, transparency, and personal service.
          </p>
          <div className="pt-4 flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/products">Shop Collection</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">Our Story</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Featured Categories */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Collections
            </span>
            <h2 className="text-3xl font-bold mt-2">Curated for You</h2>
          </div>
          <Link href="/products" className="text-sm font-semibold hover:text-primary/70 flex items-center gap-2 mt-4 md:mt-0">
             View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Timeless Comfort", img: "https://plus.unsplash.com/premium_photo-1729104895426-24d9a3cecc97?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Njd8fHRpbWVsZXNzJTIwY29tZm9ydCUyMGxlYXRoZXIlMjBzaG9lfGVufDB8fDB8fHww", category: "sandals", color: "bg-stone-100" },
            { name: "Modern Steps", img: "https://plus.unsplash.com/premium_photo-1673367751771-f13597abadf3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDR8fHxlbnwwfHx8fHw%3D",category: "slides", color: "bg-neutral-100" },
            { name: "Premium Essentials", img: "https://res.cloudinary.com/dmb5ggmvg/image/upload/v1764972050/9176554c-fe50-4561-8e55-842be195866e.png", category: "slippers", color: "bg-orange-50/50" },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group cursor-pointer"
            >
              <Link href={`/products?category=${item.category}`}>
                <div className={`aspect-[4/5] ${item.color} rounded-lg mb-4 overflow-hidden relative`}>
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500" />
                    {/* Placeholder for real image */}
                    <div className="flex items-center justify-center h-full text-muted-foreground/30 font-medium text-lg">
                        <img src={item.img} alt={item.name} />
                    </div>
                </div>
                <h3 className="font-semibold text-lg group-hover:text-primary/80 transition-colors">
                  {item.name}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Signals */}
      <section className="bg-secondary/30 py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h3 className="font-bold text-lg mb-2">Secure Payments</h3>
              <p className="text-muted-foreground">Protected by Paystack for 100% secure transactions.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">WhatsApp Priority</h3>
              <p className="text-muted-foreground">Instant order confirmation via direct WhatsApp line.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Premium Quality</h3>
              <p className="text-muted-foreground">Handpicked materials for lasting comfort and style.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
