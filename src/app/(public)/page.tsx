"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, MessageSquare, Star } from "lucide-react";
import { ApiService } from "@/lib/api";

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
            { name: "Timeless Comfort",  img: ApiService.assets.placeholders.sandals, category: "sandals", color: "bg-stone-100" },
            { name: "Modern Steps", img: ApiService.assets.placeholders.slides, category: "slides", color: "bg-neutral-100" },
            { name: "Premium Essentials", img: ApiService.assets.placeholders.slippers, category: "slippers", color: "bg-orange-50/50" },
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
                    <div className="flex items-center justify-center h-full text-muted-foreground/30 font-medium text-lg relative">
                        <Image src={item.img} alt={item.name} fill className="object-cover" />
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
      <section className="py-24 bg-white dark:bg-transparent">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15,
                }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                title: "Secure Payments",
                description: "Protected by Paystack for 100% secure transactions.",
                icon: <ShieldCheck className="w-6 h-6 text-primary/70" />
              },
              {
                title: "WhatsApp Priority",
                description: "Instant order confirmation via direct WhatsApp line.",
                icon: <MessageSquare className="w-6 h-6 text-primary/70" />
              },
              {
                title: "Premium Quality",
                description: "Handpicked materials for lasting comfort and style.",
                icon: <Star className="w-6 h-6 text-primary/70" />
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } }
                }}
                className="group p-8 rounded-[2rem] bg-card border border-border/50 shadow-xl transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-secondary shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  {item.icon}
                </div>
                <h3 className="font-bold text-xl mb-3 tracking-tight">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
