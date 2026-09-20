'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Boxes, Plus, Save, X, CheckCircle2, Image as ImageIcon, Camera, Edit3, Upload } from 'lucide-react';
import { db } from '@/lib/db';
import { Product } from '@/types';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [updateMsg, setUpdateMsg] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Photo Replace Modal State
  const [photoModalProd, setPhotoModalProd] = useState<Product | null>(null);
  const [photoUrlInput, setPhotoUrlInput] = useState('');

  // Form State for Adding New Inventory Item
  const [newItemData, setNewItemData] = useState({
    name: '',
    category: 'tops',
    sku: '',
    price: 1999,
    salePrice: 1599,
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
    colorName: 'Black',
    colorCode: '#111111',
    stockXS: 10,
    stockS: 15,
    stockM: 20,
    stockL: 12,
    stockXL: 5,
    stockXXL: 2,
  });

  useEffect(() => {
    setProducts(db.getProducts());
  }, []);

  const handleStockChange = (productId: string, size: string, newStock: number) => {
    db.updateInventory(productId, size, newStock);
    setProducts([...db.getProducts()]);
    setUpdateMsg('Inventory stock level updated dynamically.');
    setTimeout(() => setUpdateMsg(''), 3000);
  };

  const handleOpenPhotoModal = (prod: Product) => {
    setPhotoModalProd(prod);
    setPhotoUrlInput(prod.colors[0]?.images[0] || '');
  };

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoModalProd || !photoUrlInput.trim()) return;

    db.updateProductPhoto(photoModalProd.id, photoUrlInput.trim());
    setProducts([...db.getProducts()]);
    setPhotoModalProd(null);
    setUpdateMsg(`Photo for "${photoModalProd.name}" updated successfully!`);
    setTimeout(() => setUpdateMsg(''), 3500);
  };

  const handleOpenAddModal = () => {
    setNewItemData({
      name: '',
      category: 'tops',
      sku: `ACE-INV-${Math.floor(1000 + Math.random() * 9000)}`,
      price: 2499,
      salePrice: 1999,
      description: 'Elevated women’s clothing piece designed with premium finish and custom fit.',
      imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
      colorName: 'Black',
      colorCode: '#111111',
      stockXS: 10,
      stockS: 15,
      stockM: 20,
      stockL: 12,
      stockXL: 5,
      stockXXL: 2,
    });
    setIsAddModalOpen(true);
  };

  const handleSaveNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemData.name.trim()) return;

    const slug = newItemData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      slug: slug,
      name: newItemData.name,
      description: newItemData.description,
      category: newItemData.category,
      price: Number(newItemData.price),
      salePrice: Number(newItemData.salePrice) > 0 ? Number(newItemData.salePrice) : undefined,
      discountPercentage:
        Number(newItemData.salePrice) > 0
          ? Math.round(((newItemData.price - newItemData.salePrice) / newItemData.price) * 100)
          : undefined,
      rating: 5.0,
      reviewCount: 1,
      sku: newItemData.sku || `ACE-SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      colors: [
        {
          name: newItemData.colorName,
          code: newItemData.colorCode,
          images: [newItemData.imageUrl, newItemData.imageUrl],
        },
      ],
      sizes: [
        { size: 'XS', stock: Number(newItemData.stockXS) },
        { size: 'S', stock: Number(newItemData.stockS) },
        { size: 'M', stock: Number(newItemData.stockM) },
        { size: 'L', stock: Number(newItemData.stockL) },
        { size: 'XL', stock: Number(newItemData.stockXL) },
        { size: 'XXL', stock: Number(newItemData.stockXXL) },
      ],
    };

    db.saveProduct(newProd);
    setProducts([...db.getProducts()]);
    setIsAddModalOpen(false);
    setUpdateMsg(`New inventory item "${newProd.name}" added successfully with size & color specs!`);
    setTimeout(() => setUpdateMsg(''), 4000);
  };

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

  return (
    <div className="space-y-6">
      {/* Top Header & Add Inventory Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-title text-3xl font-bold text-brand-dark uppercase tracking-wider">
            INVENTORY MANAGER
          </h1>
          <p className="text-xs text-brand-muted mt-0.5">Real-time stock levels, SKU tracking and variant availability controls.</p>
        </div>

        <div className="flex items-center gap-3">
          {updateMsg && (
            <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded flex items-center gap-1">
              <CheckCircle2 size={14} /> {updateMsg}
            </span>
          )}
          <button
            onClick={handleOpenAddModal}
            className="px-5 py-3 bg-brand-dark text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-dark/90 flex items-center justify-center gap-2 rounded shadow"
          >
            <Plus size={16} />
            <span>ADD NEW INVENTORY ITEM</span>
          </button>
        </div>
      </div>

      {/* Main Inventory Table */}
      <div className="bg-white rounded-lg border border-brand-border shadow-sm p-6 overflow-x-auto">
        <table className="w-full text-left text-xs text-brand-dark">
          <thead className="bg-brand-cream uppercase text-[10px] font-bold tracking-wider text-brand-muted">
            <tr>
              <th className="p-3">Product Name & Picture</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Color Swatch</th>
              <th className="p-3">Size Variant</th>
              <th className="p-3">Stock Level</th>
              <th className="p-3">Availability Status</th>
              <th className="p-3 text-right">Keyboard / Quick Stock Adjustment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {products.flatMap((prod) =>
              prod.sizes.map((s) => {
                const isOutOfStock = s.stock === 0;
                const isLowStock = s.stock > 0 && s.stock <= 5;
                const displayImg = prod.colors[0]?.images[0] || '';
                const mainColor = prod.colors[0];

                return (
                  <tr key={`${prod.id}-${s.size}`} className="hover:bg-brand-cream/30">
                    <td className="p-3 font-semibold">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleOpenPhotoModal(prod)}
                          className="relative w-10 h-12 bg-brand-cream rounded overflow-hidden shrink-0 border border-brand-border group"
                          title="Click to Replace Photo"
                        >
                          {displayImg ? (
                            <Image src={displayImg} alt={prod.name} fill unoptimized className="object-cover group-hover:opacity-75 transition-opacity" />
                          ) : (
                            <ImageIcon size={16} className="m-auto text-brand-muted" />
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                            <Camera size={12} />
                          </div>
                        </button>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold block line-clamp-1">{prod.name}</span>
                            <button
                              onClick={() => handleOpenPhotoModal(prod)}
                              className="text-[10px] text-brand-gold hover:underline font-semibold"
                            >
                              [Replace Photo]
                            </button>
                          </div>
                          <span className="text-[10px] text-brand-muted uppercase">{prod.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-[11px] text-brand-muted">{prod.sku}</td>
                    <td className="p-3">
                      {mainColor && (
                        <div className="flex items-center gap-1.5">
                          <span className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs" style={{ backgroundColor: mainColor.code }} />
                          <span className="text-[11px] font-medium">{mainColor.name}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-3 font-bold font-mono text-xs">{s.size}</td>
                    <td className="p-3 font-bold text-sm">{s.stock}</td>
                    <td className="p-3">
                      {isOutOfStock ? (
                        <span className="bg-rose-100 text-brand-sale text-[10px] font-bold px-2 py-0.5 rounded">
                          OUT OF STOCK
                        </span>
                      ) : isLowStock ? (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                          LOW STOCK
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">
                          IN STOCK
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleStockChange(prod.id, s.size, Math.max(0, s.stock - 1))}
                          className="px-2 py-1 bg-brand-cream hover:bg-brand-border text-brand-dark font-bold rounded"
                          title="Decrease stock"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={0}
                          value={s.stock}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            handleStockChange(prod.id, s.size, isNaN(val) ? 0 : Math.max(0, val));
                          }}
                          className="w-16 px-2 py-1 border border-brand-border rounded text-center font-mono font-bold focus:outline-none focus:border-brand-dark bg-white"
                          title="Type stock quantity with keyboard"
                        />
                        <button
                          type="button"
                          onClick={() => handleStockChange(prod.id, s.size, s.stock + 1)}
                          className="px-2 py-1 bg-brand-cream hover:bg-brand-border text-brand-dark font-bold rounded"
                          title="Increase stock"
                        >
                          +
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Replace Stock Photo Modal */}
      {photoModalProd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setPhotoModalProd(null)} />

          <div className="relative w-full max-w-md bg-white rounded-lg shadow-2xl z-10 p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-brand-border">
              <h3 className="font-serif-title text-lg font-bold text-brand-dark uppercase tracking-wider">
                REPLACE STOCK PHOTO
              </h3>
              <button onClick={() => setPhotoModalProd(null)} className="p-1 hover:bg-brand-cream rounded-full">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSavePhoto} className="space-y-4 text-xs">
              <p className="text-brand-muted">
                Updating image for <span className="font-bold text-brand-dark">{photoModalProd.name}</span> ({photoModalProd.sku})
              </p>

              <div className="relative aspect-[3/4] w-36 mx-auto bg-brand-cream rounded border border-brand-border overflow-hidden">
                {photoUrlInput ? (
                  <Image src={photoUrlInput} alt="Preview" fill unoptimized className="object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-brand-muted">
                    <ImageIcon size={28} />
                    <span className="text-[10px] mt-1">No Image Selected</span>
                  </div>
                )}
              </div>

              <div>
                <label className="font-bold text-brand-dark uppercase tracking-wider block mb-1">
                  UPLOAD LOCAL IMAGE FILE *
                </label>
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-brand-border hover:border-brand-dark bg-brand-cream/30 p-4 rounded text-center transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    id="replace-photo-file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, (url) => setPhotoUrlInput(url));
                    }}
                  />
                  <label
                    htmlFor="replace-photo-file"
                    className="cursor-pointer px-4 py-2 bg-brand-dark text-white text-xs font-bold rounded uppercase tracking-wider hover:bg-brand-dark/90 flex items-center gap-2"
                  >
                    <Upload size={14} />
                    <span>Choose Photo from Device</span>
                  </label>
                  <p className="text-[10px] text-brand-muted mt-2">Supports JPG, PNG, WEBP, GIF</p>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPhotoModalProd(null)}
                  className="px-4 py-2 border border-brand-border text-brand-dark font-semibold rounded"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={!photoUrlInput}
                  className="px-6 py-2 bg-brand-dark text-white font-bold uppercase tracking-wider rounded disabled:opacity-50"
                >
                  SAVE NEW PHOTO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Inventory Modal (Picture + Details + Colors + Sizes Matrix) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsAddModalOpen(false)} />

          <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-2xl z-10 p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-brand-border">
              <div>
                <span className="text-[10px] text-brand-gold font-bold uppercase tracking-widest block">INVENTORY ENTRY</span>
                <h3 className="font-serif-title text-xl font-bold text-brand-dark uppercase tracking-wider">
                  ADD NEW INVENTORY ITEM
                </h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 hover:bg-brand-cream rounded-full">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveNewItem} className="space-y-6 text-xs">
              {/* Top Section: Picture URL & Live Preview + Main Details */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Image Preview & Local Upload */}
                <div className="md:col-span-4 space-y-2">
                  <label className="font-bold text-brand-dark uppercase tracking-wider block">CLOTHING PICTURE *</label>
                  <div className="relative aspect-[3/4] bg-brand-cream rounded border border-brand-border overflow-hidden">
                    {newItemData.imageUrl ? (
                      <Image src={newItemData.imageUrl} alt="Preview" fill unoptimized className="object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-brand-muted">
                        <ImageIcon size={32} />
                        <span className="text-[10px] mt-1">No Image Uploaded</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-brand-border hover:border-brand-dark bg-brand-cream/30 p-3 rounded text-center transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      id="add-inventory-file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, (url) => setNewItemData({ ...newItemData, imageUrl: url }));
                      }}
                    />
                    <label
                      htmlFor="add-inventory-file"
                      className="cursor-pointer px-3 py-1.5 bg-brand-dark text-white text-[11px] font-bold rounded uppercase tracking-wider hover:bg-brand-dark/90 flex items-center gap-1.5"
                    >
                      <Upload size={14} />
                      <span>Upload Local Photo</span>
                    </label>
                    <p className="text-[9px] text-brand-muted mt-1.5">Pick image from local device</p>
                  </div>
                </div>

                {/* Main Product Details */}
                <div className="md:col-span-8 space-y-4">
                  <div>
                    <label className="font-bold text-brand-dark uppercase tracking-wider block mb-1">CLOTHES NAME / TITLE *</label>
                    <input
                      type="text"
                      required
                      value={newItemData.name}
                      onChange={(e) => setNewItemData({ ...newItemData, name: e.target.value })}
                      placeholder="e.g. Satin Cowl Neck Midi Dress"
                      className="w-full p-3 border border-brand-border rounded font-semibold text-sm focus:outline-none focus:border-brand-dark"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-brand-dark block mb-1">CATEGORY *</label>
                      <select
                        value={newItemData.category}
                        onChange={(e) => setNewItemData({ ...newItemData, category: e.target.value })}
                        className="w-full p-2.5 border border-brand-border rounded bg-white"
                      >
                        <option value="tops">Tops & Blouses</option>
                        <option value="dresses">Dresses</option>
                        <option value="bottoms">Bottoms & Jeans</option>
                        <option value="sets">Co-ord Sets</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-brand-dark block mb-1">SKU CODE *</label>
                      <input
                        type="text"
                        required
                        value={newItemData.sku}
                        onChange={(e) => setNewItemData({ ...newItemData, sku: e.target.value })}
                        className="w-full p-2.5 border border-brand-border rounded font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-brand-dark block mb-1">REGULAR PRICE (NPR) *</label>
                      <input
                        type="number"
                        required
                        min={0}
                        value={newItemData.price}
                        onChange={(e) => setNewItemData({ ...newItemData, price: Number(e.target.value) })}
                        className="w-full p-2.5 border border-brand-border rounded font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-brand-dark block mb-1">SALE PRICE (NPR OPTIONAL)</label>
                      <input
                        type="number"
                        min={0}
                        value={newItemData.salePrice}
                        onChange={(e) => setNewItemData({ ...newItemData, salePrice: Number(e.target.value) })}
                        className="w-full p-2.5 border border-brand-border rounded font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-brand-dark block mb-1">CLOTHING DESCRIPTION & FABRIC DETAILS</label>
                    <textarea
                      rows={2}
                      value={newItemData.description}
                      onChange={(e) => setNewItemData({ ...newItemData, description: e.target.value })}
                      placeholder="Specify fabric weave, fit notes, and garment care instructions..."
                      className="w-full p-2.5 border border-brand-border rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Color Specifications */}
              <div className="p-4 bg-brand-cream/40 border border-brand-border rounded space-y-3">
                <h4 className="font-serif-title font-bold text-brand-dark uppercase tracking-wider">
                  COLOR SPECIFICATION
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="col-span-2">
                    <label className="font-semibold text-brand-dark block mb-1">COLOR NAME</label>
                    <input
                      type="text"
                      value={newItemData.colorName}
                      onChange={(e) => setNewItemData({ ...newItemData, colorName: e.target.value })}
                      placeholder="e.g. Rose Pink, Black, Beige"
                      className="w-full p-2.5 border border-brand-border rounded bg-white"
                    />
                  </div>
                  <div className="col-span-2 flex items-end gap-3">
                    <div className="flex-1">
                      <label className="font-semibold text-brand-dark block mb-1">COLOR SWATCH CODE</label>
                      <input
                        type="text"
                        value={newItemData.colorCode}
                        onChange={(e) => setNewItemData({ ...newItemData, colorCode: e.target.value })}
                        placeholder="#111111"
                        className="w-full p-2.5 border border-brand-border rounded font-mono bg-white uppercase"
                      />
                    </div>
                    <div
                      className="w-9 h-9 rounded-full border border-black/20 shrink-0 shadow-xs mb-0.5"
                      style={{ backgroundColor: newItemData.colorCode }}
                      title="Color Preview"
                    />
                  </div>
                </div>
              </div>

              {/* Size & Stock Level Matrix */}
              <div className="p-4 bg-brand-cream/40 border border-brand-border rounded space-y-3">
                <h4 className="font-serif-title font-bold text-brand-dark uppercase tracking-wider">
                  SIZES & STOCK LEVEL ALLOCATION
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {[
                    { key: 'stockXS', label: 'XS STOCK' },
                    { key: 'stockS', label: 'S STOCK' },
                    { key: 'stockM', label: 'M STOCK' },
                    { key: 'stockL', label: 'L STOCK' },
                    { key: 'stockXL', label: 'XL STOCK' },
                    { key: 'stockXXL', label: 'XXL STOCK' },
                  ].map((sz) => (
                    <div key={sz.key}>
                      <label className="font-mono font-bold text-brand-dark text-[10px] block mb-1">{sz.label}</label>
                      <input
                        type="number"
                        min={0}
                        value={(newItemData as any)[sz.key]}
                        onChange={(e) => setNewItemData({ ...newItemData, [sz.key]: Number(e.target.value) })}
                        className="w-full p-2 border border-brand-border rounded text-center font-mono font-bold bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Actions */}
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-3 border border-brand-border text-brand-dark font-semibold rounded hover:bg-brand-cream"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-brand-dark text-white font-bold uppercase tracking-widest rounded hover:bg-brand-dark/90 shadow-md"
                >
                  SAVE & ADD TO INVENTORY
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
