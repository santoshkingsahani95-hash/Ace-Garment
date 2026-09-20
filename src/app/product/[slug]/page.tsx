'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, ShoppingBag, Ruler, Shield, Truck, RefreshCw, ChevronDown, Check, Share2 } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { AnnouncementBar } from '@/components/layout/announcement-bar';
import { Footer } from '@/components/layout/footer';
import { QuickAddModal } from '@/components/product/quick-add-modal';
import { SizeGuideModal } from '@/components/product/size-guide-modal';
import { MiniCart } from '@/components/cart/mini-cart';
import { SearchOverlay } from '@/components/layout/search-overlay';
import { ProductCard } from '@/components/product/product-card';
import { db } from '@/lib/db';
import { Product, ProductReview } from '@/types';
import { useStore } from '@/lib/store';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColorName, setSelectedColorName] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | ''>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Review form state
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewSuccess, setReviewSuccess] = useState<string>('');

  const { addToCart, toggleWishlist, isInWishlist, openSizeGuide, user } = useStore();

  useEffect(() => {
    const found = db.getProductBySlug(slug);
    if (found) {
      setProduct(found);
      if (found.colors.length > 0) {
        setSelectedColorName(found.colors[0].name);
      }
      setSelectedImageIndex(0);
      setSelectedSize('');
      setQuantity(1);
    }
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <AnnouncementBar />
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <h2 className="font-serif-title text-2xl font-bold text-brand-dark mb-4">Product Not Found</h2>
          <Link href="/shop" className="px-6 py-3 bg-brand-dark text-white text-xs font-semibold uppercase tracking-widest">
            RETURN TO SHOP
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const activeColorObj = product.colors.find((c) => c.name === selectedColorName) || product.colors[0];
  const galleryImages = activeColorObj?.images.length ? activeColorObj.images : product.colors[0]?.images || [];
  const activeMainImg = galleryImages[selectedImageIndex] || galleryImages[0] || '';
  const displayPrice = product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;
  const inWishlist = isInWishlist(product.id);
  const relatedProducts = db.getProductsByCategory(product.category).filter((p) => p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setErrorMsg('Please select your size before adding to bag.');
      return;
    }
    addToCart(product, selectedColorName, selectedSize as any, quantity);
    setErrorMsg('');
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      setErrorMsg('Please select your size before proceeding.');
      return;
    }
    addToCart(product, selectedColorName, selectedSize as any, quantity);
    router.push('/checkout');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      userName: user ? user.name : 'Anonymous Guest',
      rating: reviewRating,
      comment: reviewComment,
      createdAt: new Date().toISOString().split('T')[0],
      verifiedPurchase: true,
    };

    db.addReview(product.id, newRev);
    setReviewSuccess('Thank you! Your review has been submitted.');
    setReviewComment('');
    setProduct({ ...product, rating: db.getProductBySlug(product.slug)?.rating || product.rating, reviewCount: (product.reviewCount || 0) + 1 });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-brand-muted mb-8 font-sans">
          <Link href="/" className="hover:text-brand-dark">Home</Link>
          <span>/</span>
          <Link href={`/category/${product.category}`} className="hover:text-brand-dark uppercase font-medium">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-brand-dark font-medium line-clamp-1">{product.name}</span>
        </div>

        {/* Product Core Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Image Gallery (7 cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails list */}
            <div className="flex md:flex-col gap-3 overflow-x-auto shrink-0">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-16 h-20 md:w-20 md:h-24 rounded overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx ? 'border-brand-dark opacity-100 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`${product.name} thumbnail ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>

            {/* Main Featured Image */}
            <div className="relative aspect-[3/4] w-full bg-brand-cream rounded-lg overflow-hidden img-zoom-container">
              <Image src={activeMainImg} alt={product.name} fill priority className="object-cover" />
              {product.isNewArrival && (
                <span className="absolute top-4 left-4 bg-brand-dark text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-xs">
                  NEW ARRIVAL
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Product Specs & Actions (5 cols on desktop) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-brand-muted font-semibold">{product.category}</span>
              <h1 className="font-serif-title text-3xl md:text-4xl font-bold text-brand-dark mt-1">{product.name}</h1>

              {/* Rating & SKU */}
              <div className="flex items-center gap-4 mt-3 text-xs">
                <div className="flex items-center gap-1 text-brand-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.floor(product.rating) ? 'fill-brand-gold' : 'text-brand-border'}
                    />
                  ))}
                  <span className="font-bold text-brand-dark ml-1">{product.rating}</span>
                  <span className="text-brand-muted">({product.reviewCount} reviews)</span>
                </div>
                <span className="text-brand-border">•</span>
                <span className="text-brand-muted font-mono">SKU: {product.sku}</span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="flex items-baseline gap-3 border-y border-brand-border py-4">
              <span className="text-2xl md:text-3xl font-bold text-brand-dark">
                NPR {displayPrice.toLocaleString()}
              </span>
              {product.salePrice && (
                <>
                  <span className="text-base text-brand-muted line-through">NPR {product.price.toLocaleString()}</span>
                  <span className="bg-brand-sale/10 text-brand-sale text-xs font-bold px-2 py-0.5 rounded">
                    SAVE {product.discountPercentage}%
                  </span>
                </>
              )}
            </div>

            {/* Description Short */}
            <p className="text-xs md:text-sm text-brand-dark/80 leading-relaxed font-sans">{product.description}</p>

            {/* Color Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-brand-dark block">
                COLOR: <span className="font-normal text-brand-muted">{selectedColorName}</span>
              </label>
              <div className="flex items-center gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => {
                      setSelectedColorName(color.name);
                      setSelectedImageIndex(0);
                    }}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedColorName === color.name ? 'border-brand-dark scale-110 shadow-sm' : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.code }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector & Size Guide */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-dark">
                  SELECT SIZE: {selectedSize && <span className="font-bold">{selectedSize}</span>}
                </label>
                <button
                  onClick={() => openSizeGuide(product.category)}
                  className="text-xs font-semibold text-brand-dark hover:text-brand-gold flex items-center gap-1 underline underline-offset-4"
                >
                  <Ruler size={14} />
                  <span>SIZE GUIDE</span>
                </button>
              </div>

              <div className="grid grid-cols-6 gap-2">
                {product.sizes.map((s) => {
                  const isOutOfStock = s.stock === 0;
                  const isSelected = selectedSize === s.size;
                  return (
                    <button
                      key={s.size}
                      disabled={isOutOfStock}
                      onClick={() => {
                        setSelectedSize(s.size);
                        setErrorMsg('');
                      }}
                      className={`py-3 text-xs font-semibold rounded border transition-all ${
                        isOutOfStock
                          ? 'border-brand-border text-brand-border cursor-not-allowed line-through bg-brand-cream/40'
                          : isSelected
                          ? 'border-brand-dark bg-brand-dark text-white'
                          : 'border-brand-border text-brand-dark hover:border-brand-dark'
                      }`}
                    >
                      {s.size}
                    </button>
                  );
                })}
              </div>
              {errorMsg && <p className="text-xs text-brand-sale font-medium mt-1">{errorMsg}</p>}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-dark">QUANTITY:</span>
              <div className="flex items-center border border-brand-border rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 hover:bg-brand-cream text-brand-dark font-bold text-sm"
                >
                  -
                </button>
                <span className="px-4 text-xs font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 hover:bg-brand-cream text-brand-dark font-bold text-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-brand-dark text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-dark/90 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <ShoppingBag size={18} />
                <span>ADD TO BAG</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full py-4 border-2 border-brand-dark text-brand-dark hover:bg-brand-cream text-xs font-bold uppercase tracking-widest transition-all"
              >
                BUY IT NOW
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`w-full py-3 border border-brand-border text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${
                  inWishlist ? 'text-brand-sale border-brand-sale' : 'text-brand-dark hover:border-brand-dark'
                }`}
              >
                <Heart size={16} className={inWishlist ? 'fill-brand-sale' : ''} />
                <span>{inWishlist ? 'ADDED TO WISHLIST' : 'ADD TO WISHLIST'}</span>
              </button>
            </div>

            {/* Feature Guarantees */}
            <div className="pt-6 border-t border-brand-border space-y-2 text-xs text-brand-muted">
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-brand-dark" />
                <span>Fast express delivery across Nepal within 2-4 business days.</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw size={16} className="text-brand-dark" />
                <span>Easy 7-day hassle-free size replacement policy.</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-brand-dark" />
                <span>100% Authentic ACE Garment quality guaranteed.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Product Details & Customer Reviews */}
        <div className="mt-20 border-t border-brand-border pt-10">
          <div className="flex border-b border-brand-border max-w-md">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-3 px-6 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
                activeTab === 'details' ? 'border-brand-dark text-brand-dark' : 'border-transparent text-brand-muted'
              }`}
            >
              PRODUCT DETAILS
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-3 px-6 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
                activeTab === 'reviews' ? 'border-brand-dark text-brand-dark' : 'border-transparent text-brand-muted'
              }`}
            >
              REVIEWS ({product.reviewCount || 0})
            </button>
          </div>

          {activeTab === 'details' ? (
            <div className="py-8 space-y-6 max-w-3xl text-xs md:text-sm text-brand-dark/80 leading-relaxed">
              <div>
                <h3 className="font-serif-title text-lg font-bold text-brand-dark mb-2">FABRIC & FIT DETAILS</h3>
                <ul className="list-disc pl-5 space-y-1 text-brand-muted">
                  {product.details?.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  )) || <li>100% Premium Women&apos;s Fashion Weave</li>}
                </ul>
              </div>

              <div>
                <h3 className="font-serif-title text-lg font-bold text-brand-dark mb-2">CARE INSTRUCTIONS</h3>
                <p className="text-brand-muted">{product.fabricCare || 'Machine wash cold with like colors. Do not bleach. Lay flat to dry.'}</p>
              </div>
            </div>
          ) : (
            <div className="py-8 space-y-10 max-w-3xl">
              {/* Existing Reviews List */}
              <div className="space-y-6">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 bg-brand-cream/40 rounded border border-brand-border/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-brand-dark">{rev.userName}</span>
                        <span className="text-[10px] text-brand-muted">{rev.createdAt}</span>
                      </div>
                      <div className="flex text-brand-gold">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={12} className={i < rev.rating ? 'fill-brand-gold' : 'text-brand-border'} />
                        ))}
                      </div>
                      <p className="text-xs text-brand-dark/80">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-brand-muted">No reviews yet for this product. Be the first to review!</p>
                )}
              </div>

              {/* Submit Review Form */}
              <div className="p-6 border border-brand-border rounded bg-white space-y-4">
                <h3 className="font-serif-title text-base font-bold text-brand-dark uppercase tracking-wider">WRITE A REVIEW</h3>
                {reviewSuccess && <p className="text-xs font-bold text-emerald-600">{reviewSuccess}</p>}
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-brand-dark block mb-1">RATING</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1 text-brand-gold focus:outline-none"
                        >
                          <Star size={18} className={star <= reviewRating ? 'fill-brand-gold' : 'text-brand-border'} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-brand-dark block mb-1">YOUR COMMENT</label>
                    <textarea
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience regarding fit, fabric, and style..."
                      className="w-full p-3 border border-brand-border rounded text-xs focus:outline-none focus:border-brand-dark"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-brand-dark text-white text-xs font-bold uppercase tracking-widest"
                  >
                    SUBMIT REVIEW
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 border-t border-brand-border pt-12">
            <h2 className="font-serif-title text-2xl font-bold text-brand-dark mb-8 uppercase tracking-wider">
              YOU MAY ALSO LIKE
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
      <QuickAddModal />
      <SizeGuideModal />
      <MiniCart />
      <SearchOverlay />
    </div>
  );
}
