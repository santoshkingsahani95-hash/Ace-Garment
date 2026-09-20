'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="absolute top-full left-0 w-full bg-white border-b border-brand-border shadow-dropdown z-40 transition-all duration-300"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-5 gap-8">
        {/* Column 1: TOPS */}
        <div>
          <Link
            href="/category/tops"
            onClick={onClose}
            className="font-serif-title font-semibold text-base text-brand-dark hover:text-brand-gold uppercase tracking-wider block mb-4"
          >
            TOPS
          </Link>
          <ul className="space-y-2.5 text-xs text-brand-dark/70">
            {['Basic Tops', 'Crop Tops', 'Ribbed Tops', 'Shirts', 'Blouses', 'Tank Tops'].map((item) => (
              <li key={item}>
                <Link
                  href={`/shop?category=tops&subcategory=${encodeURIComponent(item)}`}
                  onClick={onClose}
                  className="hover:text-brand-dark hover:translate-x-1 transition-all inline-block"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: BOTTOMS */}
        <div>
          <Link
            href="/category/bottoms"
            onClick={onClose}
            className="font-serif-title font-semibold text-base text-brand-dark hover:text-brand-gold uppercase tracking-wider block mb-4"
          >
            BOTTOMS
          </Link>
          <ul className="space-y-2.5 text-xs text-brand-dark/70">
            {['Jeans', 'Trousers', 'Cargo Pants', 'Skirts', 'Shorts'].map((item) => (
              <li key={item}>
                <Link
                  href={`/shop?category=bottoms&subcategory=${encodeURIComponent(item)}`}
                  onClick={onClose}
                  className="hover:text-brand-dark hover:translate-x-1 transition-all inline-block"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: DRESSES */}
        <div>
          <Link
            href="/category/dresses"
            onClick={onClose}
            className="font-serif-title font-semibold text-base text-brand-dark hover:text-brand-gold uppercase tracking-wider block mb-4"
          >
            DRESSES
          </Link>
          <ul className="space-y-2.5 text-xs text-brand-dark/70">
            {['Mini Dresses', 'Midi Dresses', 'Maxi Dresses', 'Casual Dresses', 'Party Dresses'].map((item) => (
              <li key={item}>
                <Link
                  href={`/shop?category=dresses&subcategory=${encodeURIComponent(item)}`}
                  onClick={onClose}
                  className="hover:text-brand-dark hover:translate-x-1 transition-all inline-block"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: SETS & COLLECTIONS */}
        <div>
          <Link
            href="/category/sets"
            onClick={onClose}
            className="font-serif-title font-semibold text-base text-brand-dark hover:text-brand-gold uppercase tracking-wider block mb-4"
          >
            SETS
          </Link>
          <ul className="space-y-2.5 text-xs text-brand-dark/70 mb-6">
            {['Co-ord Sets', 'Two Piece Sets', 'Casual Sets'].map((item) => (
              <li key={item}>
                <Link
                  href={`/shop?category=sets&subcategory=${encodeURIComponent(item)}`}
                  onClick={onClose}
                  className="hover:text-brand-dark hover:translate-x-1 transition-all inline-block"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>

          <span className="font-serif-title font-semibold text-base text-brand-dark uppercase tracking-wider block mb-3">
            COLLECTIONS
          </span>
          <ul className="space-y-2 text-xs text-brand-dark/70">
            <li>
              <Link href="/category/new-arrivals" onClick={onClose} className="hover:text-brand-dark font-medium text-brand-gold">
                ✨ New Arrivals
              </Link>
            </li>
            <li>
              <Link href="/category/best-sellers" onClick={onClose} className="hover:text-brand-dark font-medium">
                🔥 Best Sellers
              </Link>
            </li>
            <li>
              <Link href="/category/sale" onClick={onClose} className="hover:text-brand-sale font-medium text-brand-sale">
                🏷️ Sale Edit
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 5: Editorial Image Cards */}
        <div className="flex flex-col gap-4">
          <div className="relative h-44 rounded overflow-hidden group">
            <Image
              src="https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600&auto=format&fit=crop"
              alt="Party Edit"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-3">
              <span className="text-[10px] tracking-widest text-white/80 uppercase font-semibold">COLLECTION</span>
              <span className="text-white text-xs font-serif-title font-bold">Party Edits 2026</span>
            </div>
          </div>

          <div className="relative h-28 rounded overflow-hidden group">
            <Image
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop"
              alt="New Arrivals"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-2 text-center">
              <span className="text-white text-xs tracking-widest font-semibold uppercase">SHOP THE DROP →</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
