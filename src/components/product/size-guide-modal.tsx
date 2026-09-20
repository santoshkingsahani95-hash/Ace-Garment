'use client';

import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';
import { useStore } from '@/lib/store';

export const SizeGuideModal: React.FC = () => {
  const { sizeGuideCategory, closeSizeGuide } = useStore();
  const [activeTab, setActiveTab] = useState<'TOPS' | 'DRESSES' | 'BOTTOMS'>('TOPS');

  if (!sizeGuideCategory) return null;

  const topsData = [
    { size: 'XS', bust: '31 - 32"', waist: '24 - 25"', length: '16.5"' },
    { size: 'S', bust: '33 - 34"', waist: '26 - 27"', length: '17.0"' },
    { size: 'M', bust: '35 - 36"', waist: '28 - 29"', length: '17.5"' },
    { size: 'L', bust: '37 - 39"', waist: '30 - 32"', length: '18.0"' },
    { size: 'XL', bust: '40 - 42"', waist: '33 - 35"', length: '18.5"' },
    { size: 'XXL', bust: '43 - 45"', waist: '36 - 38"', length: '19.0"' },
  ];

  const dressesData = [
    { size: 'XS', bust: '31 - 32"', waist: '24 - 25"', hip: '34 - 35"', length: '33"' },
    { size: 'S', bust: '33 - 34"', waist: '26 - 27"', hip: '36 - 37"', length: '34"' },
    { size: 'M', bust: '35 - 36"', waist: '28 - 29"', hip: '38 - 39"', length: '35"' },
    { size: 'L', bust: '37 - 39"', waist: '30 - 32"', hip: '40 - 42"', length: '36"' },
    { size: 'XL', bust: '40 - 42"', waist: '33 - 35"', hip: '43 - 45"', length: '37"' },
    { size: 'XXL', bust: '43 - 45"', waist: '36 - 38"', hip: '46 - 48"', length: '38"' },
  ];

  const bottomsData = [
    { size: 'XS', waist: '24 - 25"', hip: '34 - 35"', length: '40"' },
    { size: 'S', waist: '26 - 27"', hip: '36 - 37"', length: '40.5"' },
    { size: 'M', waist: '28 - 29"', hip: '38 - 39"', length: '41"' },
    { size: 'L', waist: '30 - 32"', hip: '40 - 42"', length: '41.5"' },
    { size: 'XL', waist: '33 - 35"', hip: '43 - 45"', length: '42"' },
    { size: 'XXL', waist: '36 - 38"', hip: '46 - 48"', length: '42.5"' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 transition-opacity backdrop-blur-xs" onClick={closeSizeGuide} />

      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl z-10 p-6 md:p-8 overflow-hidden">
        <div className="flex justify-between items-center pb-4 border-b border-brand-border">
          <div className="flex items-center gap-2">
            <Ruler size={20} className="text-brand-dark" />
            <h3 className="font-serif-title font-bold text-xl text-brand-dark tracking-wider">SIZE GUIDE</h3>
          </div>
          <button
            onClick={closeSizeGuide}
            className="p-2 text-brand-dark hover:bg-brand-cream rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex border-b border-brand-border mt-6">
          {(['TOPS', 'DRESSES', 'BOTTOMS'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-xs font-semibold tracking-widest uppercase text-center border-b-2 transition-all ${
                activeTab === tab ? 'border-brand-dark text-brand-dark' : 'border-transparent text-brand-muted hover:text-brand-dark'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table Content */}
        <div className="mt-6 overflow-x-auto">
          {activeTab === 'TOPS' && (
            <table className="w-full text-xs text-left text-brand-dark">
              <thead className="bg-brand-cream uppercase text-[10px] tracking-wider text-brand-muted font-semibold">
                <tr>
                  <th className="px-4 py-3">Size</th>
                  <th className="px-4 py-3">Bust</th>
                  <th className="px-4 py-3">Waist</th>
                  <th className="px-4 py-3">Approx Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {topsData.map((row) => (
                  <tr key={row.size} className="hover:bg-brand-cream/30">
                    <td className="px-4 py-3 font-bold">{row.size}</td>
                    <td className="px-4 py-3">{row.bust}</td>
                    <td className="px-4 py-3">{row.waist}</td>
                    <td className="px-4 py-3">{row.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'DRESSES' && (
            <table className="w-full text-xs text-left text-brand-dark">
              <thead className="bg-brand-cream uppercase text-[10px] tracking-wider text-brand-muted font-semibold">
                <tr>
                  <th className="px-4 py-3">Size</th>
                  <th className="px-4 py-3">Bust</th>
                  <th className="px-4 py-3">Waist</th>
                  <th className="px-4 py-3">Hip</th>
                  <th className="px-4 py-3">Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {dressesData.map((row) => (
                  <tr key={row.size} className="hover:bg-brand-cream/30">
                    <td className="px-4 py-3 font-bold">{row.size}</td>
                    <td className="px-4 py-3">{row.bust}</td>
                    <td className="px-4 py-3">{row.waist}</td>
                    <td className="px-4 py-3">{row.hip}</td>
                    <td className="px-4 py-3">{row.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'BOTTOMS' && (
            <table className="w-full text-xs text-left text-brand-dark">
              <thead className="bg-brand-cream uppercase text-[10px] tracking-wider text-brand-muted font-semibold">
                <tr>
                  <th className="px-4 py-3">Size</th>
                  <th className="px-4 py-3">Waist</th>
                  <th className="px-4 py-3">Hip</th>
                  <th className="px-4 py-3">Outseam Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {bottomsData.map((row) => (
                  <tr key={row.size} className="hover:bg-brand-cream/30">
                    <td className="px-4 py-3 font-bold">{row.size}</td>
                    <td className="px-4 py-3">{row.waist}</td>
                    <td className="px-4 py-3">{row.hip}</td>
                    <td className="px-4 py-3">{row.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p className="text-[11px] text-brand-muted mt-6 text-center italic">
          Measurements are in inches. If you fall between two sizes, we recommend sizing up for a relaxed fit or sizing down for a contour bodycon fit.
        </p>
      </div>
    </div>
  );
};
