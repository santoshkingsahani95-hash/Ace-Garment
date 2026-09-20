'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Instagram, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { AnnouncementBar } from '@/components/layout/announcement-bar';
import { Footer } from '@/components/layout/footer';
import { ProductCard } from '@/components/product/product-card';
import { QuickAddModal } from '@/components/product/quick-add-modal';
import { SizeGuideModal } from '@/components/product/size-guide-modal';
import { MiniCart } from '@/components/cart/mini-cart';
import { SearchOverlay } from '@/components/layout/search-overlay';
import { db } from '@/lib/db';
import { Product, Category, Collection, HomepageCMS } from '@/types';
import { useStore } from '@/lib/store';

export default function HomePage() {
  const [cms, setCms] = useState<HomepageCMS>(db.getCMS());
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    setCms(db.getCMS());
    setAllProducts(db.getProducts());
    setCategories(db.getCategories());
    setCollections(db.getCollections());
  }, []);

  const trendingProducts = allProducts.filter((p) => p.isTrending).slice(0, 8);
  const newArrivals = allProducts.filter((p) => p.isNewArrival || p.collections?.includes('new-arrivals')).slice(0, 8);
  const bestSellers = allProducts.filter((p) => p.isBestSeller || p.reviewCount > 30).slice(0, 8);
  const saleProducts = allProducts.filter((p) => p.isSale || p.salePrice !== undefined).slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Banner */}
      <AnnouncementBar text={cms.announcementBar.text} enabled={cms.announcementBar.enabled} />

      {/* Sticky Header */}
      <Header />

      <main className="flex-1">
        {/* 1. HERO SECTION */}
        <section className="relative w-full h-[85vh] md:h-[90vh] bg-brand-dark overflow-hidden flex items-center justify-center">
          {/* Desktop & Mobile Hero Background Images */}
          <div className="absolute inset-0">
            <picture className="w-full h-full block">
              <source media="(min-width: 768px)" srcSet={cms.hero.desktopImage} />
              <Image
                src={cms.hero.mobileImage}
                alt="ACE Garment Hero"
                fill
                priority
                className="object-cover object-center brightness-[0.78]"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
          </div>

          {/* Hero Text Overlay */}
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white space-y-6">
            <span className="text-xs md:text-sm font-semibold tracking-ultra uppercase text-brand-gold bg-black/40 px-4 py-1.5 rounded-full inline-block backdrop-blur-xs border border-brand-gold/30">
              NEW SEASON COLLECTION 2026
            </span>

            <h1 className="font-serif-title text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] whitespace-pre-line">
              {cms.hero.heading}
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-2xl mx-auto font-sans font-light leading-relaxed">
              {cms.hero.subtitle}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={cms.hero.buttonUrl}
                className="w-full sm:w-auto px-8 py-4 bg-white text-brand-dark hover:bg-brand-cream text-xs font-bold uppercase tracking-widest transition-all shadow-xl hover:scale-105"
              >
                {cms.hero.buttonText}
              </Link>
              <Link
                href={cms.hero.secondaryButtonUrl}
                className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white text-white hover:bg-white/10 text-xs font-bold uppercase tracking-widest transition-all"
              >
                {cms.hero.secondaryButtonText}
              </Link>
            </div>
          </div>
        </section>

        {/* Brand Value Props */}
        <section className="border-b border-brand-border bg-brand-cream/60 py-6">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <Truck size={20} className="text-brand-dark" />
              <div className="text-left">
                <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wider">EXPRESS NEPAL DELIVERY</h4>
                <p className="text-[11px] text-brand-muted">Free shipping on orders above NPR 3,000</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <RefreshCw size={20} className="text-brand-dark" />
              <div className="text-left">
                <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wider">EASY 7-DAY EXCHANGES</h4>
                <p className="text-[11px] text-brand-muted">Hassle-free size replacement guarantee</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <ShieldCheck size={20} className="text-brand-dark" />
              <div className="text-left">
                <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wider">100% ORIGINAL DESIGN</h4>
                <p className="text-[11px] text-brand-muted">Premium fabrics & custom women&apos;s tailoring</p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. SHOP BY CATEGORY */}
        <section className="py-20 max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
            <span className="text-xs uppercase tracking-widest text-brand-gold font-semibold">CURATED SILHOUETTES</span>
            <h2 className="font-serif-title text-3xl md:text-4xl font-bold text-brand-dark">SHOP BY CATEGORY</h2>
            <div className="w-12 h-[2px] bg-brand-dark mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group relative aspect-[3/4] rounded-lg overflow-hidden block shadow-card"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-[10px] uppercase tracking-widest text-white/70 font-semibold mb-1">
                    EXPLORE COLLECTION
                  </span>
                  <h3 className="font-serif-title text-2xl font-bold">{cat.name}</h3>
                  <div className="pt-3 flex items-center gap-2 text-xs font-semibold tracking-wider text-brand-gold group-hover:translate-x-1 transition-transform">
                    <span>SHOP NOW</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. TRENDING NOW */}
        <section className="py-16 bg-brand-cream/40 border-y border-brand-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-brand-gold font-semibold flex items-center gap-1">
                  <Sparkles size={14} /> HIGH DEMAND LOOKS
                </span>
                <h2 className="font-serif-title text-3xl md:text-4xl font-bold text-brand-dark mt-1">TRENDING NOW</h2>
              </div>
              <Link
                href="/category/trending"
                className="text-xs font-semibold uppercase tracking-widest text-brand-dark hover:text-brand-gold flex items-center gap-1 group"
              >
                <span>VIEW ALL TRENDING</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {trendingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* 4. NEW ARRIVALS */}
        <section className="py-20 max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
            <span className="text-xs uppercase tracking-widest text-brand-gold font-semibold">FRESH DROPS</span>
            <h2 className="font-serif-title text-3xl md:text-4xl font-bold text-brand-dark">NEW ARRIVALS</h2>
            <p className="text-xs text-brand-muted">Fresh pieces you&apos;ll want to wear on repeat.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/category/new-arrivals"
              className="inline-block px-8 py-4 border border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white text-xs font-bold uppercase tracking-widest transition-all"
            >
              VIEW ALL NEW ARRIVALS
            </Link>
          </div>
        </section>

        {/* 5. EDITORIAL BANNER */}
        <section className="relative w-full h-[65vh] md:h-[75vh] bg-brand-dark overflow-hidden flex items-center justify-center">
          <Image
            src={cms.editorialBanner.image}
            alt="Editorial Campaign"
            fill
            className="object-cover object-center brightness-[0.70]"
          />
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-10 max-w-3xl mx-auto px-6 text-center text-white space-y-4">
            <span className="text-xs font-semibold tracking-ultra uppercase text-brand-gold">
              EDITORIAL CAMPAIGN
            </span>
            <h2 className="font-serif-title text-4xl md:text-6xl font-bold tracking-tight">
              {cms.editorialBanner.heading}
            </h2>
            <p className="text-sm md:text-base text-white/90 max-w-lg mx-auto font-sans font-light">
              {cms.editorialBanner.subtitle}
            </p>
            <div className="pt-4">
              <Link
                href={cms.editorialBanner.buttonUrl}
                className="inline-block px-8 py-4 bg-white text-brand-dark hover:bg-brand-cream text-xs font-bold uppercase tracking-widest transition-all shadow-xl"
              >
                {cms.editorialBanner.buttonText}
              </Link>
            </div>
          </div>
        </section>

        {/* 6. BEST SELLERS */}
        <section className="py-20 max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-brand-gold font-semibold">CUSTOMER FAVORITES</span>
              <h2 className="font-serif-title text-3xl md:text-4xl font-bold text-brand-dark mt-1">BEST SELLERS</h2>
            </div>
            <Link
              href="/category/best-sellers"
              className="text-xs font-semibold uppercase tracking-widest text-brand-dark hover:text-brand-gold flex items-center gap-1 group"
            >
              <span>SHOP BEST SELLERS</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* 7. SHOP BY STYLE / COLLECTIONS */}
        <section className="py-16 bg-brand-cream/50 border-y border-brand-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
              <span className="text-xs uppercase tracking-widest text-brand-gold font-semibold">STYLED FOR OCCASIONS</span>
              <h2 className="font-serif-title text-3xl md:text-4xl font-bold text-brand-dark">SHOP BY STYLE</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {collections.slice(0, 3).map((col) => (
                <Link
                  key={col.id}
                  href={`/shop?collection=${col.slug}`}
                  className="group relative h-80 rounded-lg overflow-hidden block shadow-card"
                >
                  <Image src={col.image} alt={col.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
                    <h3 className="font-serif-title text-2xl font-bold">{col.name}</h3>
                    <p className="text-xs text-white/80 line-clamp-1 mt-1 font-light">{col.description}</p>
                    <span className="text-[11px] font-bold text-brand-gold uppercase tracking-widest pt-3 inline-block">
                      EXPLORE LOOKS →
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {collections.slice(3, 5).map((col) => (
                <Link
                  key={col.id}
                  href={`/shop?collection=${col.slug}`}
                  className="group relative h-72 rounded-lg overflow-hidden block shadow-card"
                >
                  <Image src={col.image} alt={col.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
                    <h3 className="font-serif-title text-2xl font-bold">{col.name}</h3>
                    <p className="text-xs text-white/80 line-clamp-1 mt-1 font-light">{col.description}</p>
                    <span className="text-[11px] font-bold text-brand-gold uppercase tracking-widest pt-3 inline-block">
                      EXPLORE LOOKS →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 8. SALE EDIT */}
        <section className="py-20 max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-brand-sale font-semibold">SPECIAL PRICING</span>
              <h2 className="font-serif-title text-3xl md:text-4xl font-bold text-brand-dark mt-1">SALE EDIT</h2>
              <p className="text-xs text-brand-muted">Your favorites, now at special prices.</p>
            </div>
            <Link
              href="/category/sale"
              className="text-xs font-semibold uppercase tracking-widest text-brand-sale hover:opacity-80 flex items-center gap-1 group"
            >
              <span>SHOP ALL SALE</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {saleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* 9. INSTAGRAM / SOCIAL SECTION */}
        <section className="py-16 bg-white border-t border-brand-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-md mx-auto mb-10 space-y-1">
              <span className="text-xs uppercase tracking-widest text-brand-muted font-semibold flex items-center justify-center gap-1">
                <Instagram size={14} /> @ACEGARMENT
              </span>
              <h2 className="font-serif-title text-2xl md:text-3xl font-bold text-brand-dark">STYLED BY YOU</h2>
              <p className="text-xs text-brand-muted">Tag #AceGarment on Instagram for a chance to be featured.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {cms.instagramImages.map((img) => (
                <a
                  key={img.id}
                  href={img.postUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative aspect-square rounded overflow-hidden block bg-brand-cream"
                >
                  <Image src={img.imageUrl} alt="Instagram style" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Instagram size={24} />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Overlays & Modals */}
      <QuickAddModal />
      <SizeGuideModal />
      <MiniCart />
      <SearchOverlay />
    </div>
  );
}
