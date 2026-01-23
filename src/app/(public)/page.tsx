"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Package, MessageSquare, Star } from "lucide-react";
import { ApiService } from "@/lib/api";
import { FaWhatsapp } from "react-icons/fa";

export default function Home() {
  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-16">
      {/* Hero Slider Section */}
      <section className="relative h-[85vh] md:h-[90vh] lg:h-[85vh] flex flex-col items-center justify-center overflow-hidden">
        <HeroSlider />
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
            { name: "Timeless Comfort",  img: ApiService.assets.placeholders.sandals, category: "all" },
            { name: "Modern Steps", img: ApiService.assets.placeholders.slides, category: "all"},
            { name: "Premium Essentials", img: ApiService.assets.placeholders.slippers, category: "all" },
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
                <div className={`aspect-[4/5] rounded-lg mb-4 overflow-hidden relative`}>
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

      {/* Why OML Soles / Trust Section */}
      <section className="py-24 md:py-32 bg-secondary/10">
        <div className="container mx-auto px-4 text-center mb-16">
          <motion.span 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase"
          >
            Our Philosophy
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4">Why OML Soles?</h2>
        </div>

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
                  staggerChildren: 0.1,
                }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {[
              {
                title: "Handcrafted on Demand",
                description: "Built specifically for you, reducing waste and ensuring maximum attention to detail.",
                icon: <Package className="w-6 h-6" />
              },
              {
                title: "Premium Materials",
                description: "We source only the finest leathers and textiles that get better with every wear.",
                icon: <Star className="w-6 h-6" />
              },
              {
                title: "Comfort-First Design",
                description: "Anatomically conscious soles designed for a soft, natural feel all day long.",
                icon: <ArrowRight className="w-6 h-6 rotate-45" />
              },
              {
                title: "Built to Last",
                description: "Timed-honored techniques that prioritize longevity over disposable fashion.",
                icon: <ShieldCheck className="w-6 h-6" />
              },
              {
                title: "Secure Payments",
                description: "Protected by Paystack for 100% secure transactions.",
                icon: <ShieldCheck className="w-6 h-6 text-primary/70" />
              },
              {
                title: "WhatsApp Priority",
                description: "Instant order confirmation via direct WhatsApp line.",
                icon: <FaWhatsapp className="w-6 h-6 text-primary/70" />
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
                }}
                className="group p-8 rounded-[2.5rem] bg-card border border-border/40 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2 flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-secondary/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 text-primary">
                  {item.icon}
                </div>
                <h3 className="font-bold text-xl mb-4 tracking-tight">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm font-medium">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  );
}

function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const slides = ApiService.assets.hero;

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="relative w-full h-full group">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={slides[current].url}
              alt={slides[current].headline}
              fill
              className="object-cover"
              priority
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full container mx-auto px-4 flex flex-col items-center justify-center text-center text-white z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="max-w-4xl space-y-6 md:space-y-8"
            >
              <div className="space-y-2 md:space-y-4">
                <span className="text-[10px] md:text-sm font-bold tracking-[0.4em] uppercase text-white/70">
                  Artisan Collective
                </span>
                <h2 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] playfair-black">
                  {slides[current].headline}
                </h2>
              </div>
              
              <p className="text-sm md:text-xl lg:text-2xl text-white/80 max-w-2xl mx-auto font-medium leading-relaxed poppins-black">
                {slides[current].subtext}
              </p>
              
              <div className="pt-6 md:pt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" asChild className="h-12 md:h-16 px-8 md:px-12 rounded-2xl text-sm md:text-lg font-black bg-white text-black hover:bg-white/90 shadow-2xl transition-all duration-500">
                  <Link href="/products">View Collection</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="h-12 md:h-16 px-8 md:px-12 rounded-2xl text-sm md:text-lg font-black border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-500">
                  <Link href={ApiService.whatsapp.getLink(`Hello OML Soles! I'm interested in the ${slides[current].headline} series.`)} target="_blank">
                    Ask on WhatsApp
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Manual Controls (Invisible overlay for swipe logic) */}
      <motion.div 
        className="absolute inset-0 z-20 md:hidden cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -50) nextSlide();
          if (info.offset.x > 50) setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
        }}
      />

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={cn(
              "w-2 md:w-2.5 h-2 md:h-2.5 rounded-full transition-all duration-500",
              current === index ? "bg-white w-8 md:w-10" : "bg-white/30 hover:bg-white/50"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-10 hidden lg:block z-30"
      >
        <div className="flex items-center gap-4 text-white/30 text-[10px] uppercase tracking-[0.3em] font-bold vertical-text">
          <span>Scroll to explore</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </motion.div>
    </div>
  );
}

