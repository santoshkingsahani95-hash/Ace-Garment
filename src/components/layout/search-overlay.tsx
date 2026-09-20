'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Search, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import { db } from '@/lib/db';
import { Product } from '@/types';

export const SearchOverlay: React.FC = () => {
  const { isSearchOpen, closeSearch } = useStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);

  const popularSearches = ['Satin Dress', 'Ribbed Top', 'Cargo Pants', 'Co-ord Set', 'White Shirt', 'Mini Skirt'];

  useEffect(() => {
    if (query.trim().length > 1) {
      const allProducts = db.getProducts();
      const q = query.toLowerCase();
      const filtered = allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subcategory?.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white/98 backdrop-blur-md flex flex-col transition-all duration-300">
      {/* Top Search Input Header */}
      <div className="max-w-4xl mx-auto w-full pt-10 px-6 pb-6 border-b border-brand-border flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-3">
          <Search size={24} className="text-brand-dark/50" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for dresses, tops, jeans, co-ords..."
            autoFocus
            className="w-full bg-transparent text-xl md:text-2xl font-serif-title text-brand-dark focus:outline-none placeholder:text-brand-dark/30"
          />
        </div>
        <button
          onClick={closeSearch}
          className="p-2 text-brand-dark hover:bg-brand-cream rounded-full transition-colors"
          aria-label="Close search"
        >
          <X size={24} />
        </button>
      </div>

      {/* Main Results / Suggestions Content */}
      <div className="max-w-4xl mx-auto w-full flex-1 overflow-y-auto px-6 py-8">
        {query.trim().length <= 1 ? (
          <div>
            <h3 className="text-xs uppercase tracking-widest font-semibold text-brand-muted mb-4">
              POPULAR SEARCHES
            </h3>
            <div className="flex flex-wrap gap-2 mb-10">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-4 py-2 bg-brand-cream rounded-full text-xs font-medium text-brand-dark hover:bg-brand-dark hover:text-white transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>

            <h3 className="text-xs uppercase tracking-widest font-semibold text-brand-muted mb-4">
              FEATURED CATEGORIES
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Dresses', slug: 'dresses', img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400&auto=format&fit=crop' },
                { name: 'Tops', slug: 'tops', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400&auto=format&fit=crop' },
                { name: 'Bottoms', slug: 'bottoms', img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=400&auto=format&fit=crop' },
                { name: 'Co-ord Sets', slug: 'sets', img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=400&auto=format&fit=crop' },
              ].map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  onClick={closeSearch}
                  className="relative h-28 rounded overflow-hidden group block"
                >
                  <Image src={cat.img} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-2">
                    <span className="text-white text-xs font-bold uppercase tracking-wider">{cat.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                {results.length} {results.length === 1 ? 'RESULT' : 'RESULTS'} FOUND FOR &quot;{query}&quot;
              </span>
            </div>

            {results.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-base text-brand-muted font-serif-title mb-2">No matching fashion pieces found.</p>
                <p className="text-xs text-brand-muted">Try searching with a different term like &quot;satin&quot;, &quot;crop&quot;, or &quot;skirt&quot;.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {results.map((product) => {
                  const displayPrice = product.salePrice || product.price;
                  return (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      onClick={closeSearch}
                      className="group block space-y-2"
                    >
                      <div className="relative aspect-[3/4] bg-brand-cream rounded overflow-hidden">
                        <Image
                          src={product.colors[0]?.images[0] || ''}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-brand-muted uppercase tracking-wider">{product.category}</span>
                        <h4 className="text-xs font-semibold text-brand-dark group-hover:text-brand-gold truncate">
                          {product.name}
                        </h4>
                        <p className="text-xs font-medium text-brand-dark">NPR {displayPrice.toLocaleString()}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
