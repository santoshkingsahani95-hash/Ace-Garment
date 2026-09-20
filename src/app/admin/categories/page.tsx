'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Edit2, X, Image as ImageIcon, CheckCircle2, Layers, Upload } from 'lucide-react';
import { db } from '@/lib/db';
import { Category } from '@/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [msg, setMsg] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const handleFileUpload = (file: File, callback: (dataUrl: string) => void) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        callback(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    setCategories(db.getCategories());
  }, []);

  const handleOpenEdit = (cat: Category) => {
    setSelectedCategory(cat);
    setName(cat.name);
    setDescription(cat.description);
    setImage(cat.image);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;

    db.updateCategory(selectedCategory.id, {
      name,
      description,
      image,
    });

    setCategories([...db.getCategories()]);
    setIsModalOpen(false);
    setMsg(`Category "${name}" updated successfully! Photo & details are live.`);
    setTimeout(() => setMsg(''), 3500);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif-title text-3xl font-bold text-brand-dark uppercase tracking-wider">
            CATEGORY MANAGEMENT
          </h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Edit category names, replace high-resolution hero photos, and manage subcategories.
          </p>
        </div>
        {msg && (
          <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded flex items-center gap-1">
            <CheckCircle2 size={14} /> {msg}
          </span>
        )}
      </div>

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-lg border border-brand-border shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="relative h-48 w-full bg-brand-cream">
              <Image src={cat.image} alt={cat.name} fill unoptimized className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
                <div>
                  <span className="text-[10px] text-brand-gold uppercase tracking-widest font-bold">CATEGORY</span>
                  <h3 className="font-serif-title text-2xl font-bold text-white uppercase">{cat.name}</h3>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <p className="text-brand-dark/80">{cat.description}</p>

              <div>
                <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider block mb-1.5">
                  SUBCATEGORIES ({cat.subcategories.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {cat.subcategories.map((sub) => (
                    <span key={sub} className="bg-brand-cream text-brand-dark text-[10px] font-medium px-2 py-0.5 rounded border border-brand-border">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-brand-border flex justify-between items-center">
                <span className="text-[10px] text-brand-muted font-mono uppercase">SLUG: /category/{cat.slug}</span>
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="px-4 py-2 bg-brand-dark text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-brand-dark/90 flex items-center gap-1.5"
                >
                  <Edit2 size={14} />
                  <span>EDIT NAME & PHOTO</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Category Modal */}
      {isModalOpen && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />

          <div className="relative w-full max-w-xl bg-white rounded-lg shadow-2xl z-10 p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-brand-border">
              <div>
                <span className="text-[10px] text-brand-gold font-bold uppercase tracking-widest block">CATEGORY EDITOR</span>
                <h3 className="font-serif-title text-xl font-bold text-brand-dark uppercase tracking-wider">
                  EDIT CATEGORY: {selectedCategory.name}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-brand-cream rounded-full">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Image Preview & Replacement Local Upload */}
              <div className="space-y-2">
                <label className="font-bold text-brand-dark uppercase tracking-wider block">CATEGORY PHOTO / IMAGE *</label>
                <div className="relative h-44 w-full bg-brand-cream rounded border border-brand-border overflow-hidden">
                  {image ? (
                    <Image src={image} alt="Category Photo Preview" fill unoptimized className="object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-brand-muted">
                      <ImageIcon size={32} />
                      <span className="text-[10px] mt-1">No Image Selected</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-brand-border hover:border-brand-dark bg-brand-cream/30 p-3 rounded text-center transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    id="category-photo-file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, (url) => setImage(url));
                    }}
                  />
                  <label
                    htmlFor="category-photo-file"
                    className="cursor-pointer px-4 py-2 bg-brand-dark text-white text-xs font-bold rounded uppercase tracking-wider hover:bg-brand-dark/90 flex items-center gap-2"
                  >
                    <Upload size={14} />
                    <span>Upload New Category Photo from Device</span>
                  </label>
                  <p className="text-[10px] text-brand-muted mt-1.5">Select image file from computer (PNG, JPG, WEBP)</p>
                </div>
              </div>

              {/* Category Name */}
              <div>
                <label className="font-bold text-brand-dark uppercase tracking-wider block mb-1">CATEGORY NAME *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-brand-border rounded font-semibold text-sm focus:outline-none focus:border-brand-dark"
                />
              </div>

              {/* Category Description */}
              <div>
                <label className="font-bold text-brand-dark uppercase tracking-wider block mb-1">DESCRIPTION</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 border border-brand-border rounded"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-brand-border text-brand-dark font-semibold rounded hover:bg-brand-cream"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-dark text-white font-bold uppercase tracking-widest rounded shadow"
                >
                  SAVE CATEGORY & PHOTO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
