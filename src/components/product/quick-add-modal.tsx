'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Check, ShoppingBag } from 'lucide-react';
import { useStore } from '@/lib/store';

export const QuickAddModal: React.FC = () => {
  const { quickAddProduct, closeQuickAdd, addToCart } = useStore();
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | ''>('');
  const [quantity, setQuantity] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (quickAddProduct) {
      setSelectedColor(quickAddProduct.colors[0]?.name || '');
      setSelectedSize('');
      setQuantity(1);
      setErrorMsg('');
    }
  }, [quickAddProduct]);

  if (!quickAddProduct) return null;

  const activeColorObj = quickAddProduct.colors.find((c) => c.name === selectedColor) || quickAddProduct.colors[0];
  const activeImage = activeColorObj?.images[0] || quickAddProduct.colors[0]?.images[0] || '';
  const displayPrice = quickAddProduct.salePrice || quickAddProduct.price;

  const handleAdd = () => {
    if (!selectedSize) {
      setErrorMsg('Please select a size before adding to bag.');
      return;
    }
    addToCart(quickAddProduct, selectedColor, selectedSize as any, quantity);
    closeQuickAdd();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 transition-opacity backdrop-blur-xs" onClick={closeQuickAdd} />

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-white rounded-lg shadow-2xl z-10 overflow-hidden">
        <button
          onClick={closeQuickAdd}
          className="absolute top-4 right-4 z-20 p-2 bg-white/80 rounded-full text-brand-dark hover:bg-brand-cream transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-[3/4] bg-brand-cream md:h-full">
            <Image src={activeImage} alt={quickAddProduct.name} fill className="object-cover" />
          </div>

          {/* Details & Controls */}
          <div className="p-6 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] text-brand-muted uppercase tracking-widest font-semibold">QUICK ADD</span>
              <h3 className="font-serif-title text-xl font-bold text-brand-dark mt-1">{quickAddProduct.name}</h3>

              {/* Price */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-base font-bold text-brand-dark">NPR {displayPrice.toLocaleString()}</span>
                {quickAddProduct.salePrice && (
                  <>
                    <span className="text-xs text-brand-muted line-through">NPR {quickAddProduct.price.toLocaleString()}</span>
                    <span className="text-[10px] bg-brand-sale/10 text-brand-sale font-bold px-1.5 py-0.5 rounded">
                      {quickAddProduct.discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Colors */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-brand-dark block mb-2">
                COLOR: <span className="font-normal text-brand-muted">{selectedColor}</span>
              </label>
              <div className="flex items-center gap-2">
                {quickAddProduct.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedColor === color.name ? 'border-brand-dark scale-110 shadow-sm' : 'border-transparent hover:scale-105'
                    }`}
                    title={color.name}
                  >
                    <span className="w-5 h-5 rounded-full border border-black/10" style={{ backgroundColor: color.code }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-brand-dark">
                  SELECT SIZE: {selectedSize && <span className="font-bold">{selectedSize}</span>}
                </label>
              </div>

              <div className="grid grid-cols-6 gap-1.5">
                {quickAddProduct.sizes.map((s) => {
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
                      className={`py-2 text-xs font-semibold rounded border transition-all ${
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
              {errorMsg && <p className="text-[11px] text-brand-sale font-medium mt-1.5">{errorMsg}</p>}
            </div>

            {/* Action */}
            <button
              onClick={handleAdd}
              className="w-full py-3.5 bg-brand-dark text-white text-xs font-semibold uppercase tracking-widest hover:bg-brand-dark/90 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag size={16} />
              <span>ADD TO BAG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
