'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, Search, X, Check, Image as ImageIcon, Upload } from 'lucide-react';
import { db } from '@/lib/db';
import { Product } from '@/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    category: 'tops',
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

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      sku: `ACE-PROD-${Math.floor(100 + Math.random() * 900)}`,
      category: 'tops',
      price: 1999,
      salePrice: 1599,
      description: 'Elegant women’s fashion piece designed for effortless confidence.',
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
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    const getStock = (sz: string) => p.sizes.find((s) => s.size === sz)?.stock ?? 0;
    setFormData({
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      category: p.category,
      price: p.price,
      salePrice: p.salePrice || 0,
      description: p.description,
      imageUrl: p.colors[0]?.images[0] || '',
      colorName: p.colors[0]?.name || 'Black',
      colorCode: p.colors[0]?.code || '#111111',
      stockXS: getStock('XS'),
      stockS: getStock('S'),
      stockM: getStock('M'),
      stockL: getStock('L'),
      stockXL: getStock('XL'),
      stockXXL: getStock('XXL'),
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      db.deleteProduct(id);
      setProducts(db.getProducts());
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const slugGen = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newProd: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      slug: slugGen,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      price: Number(formData.price),
      salePrice: Number(formData.salePrice) > 0 ? Number(formData.salePrice) : undefined,
      discountPercentage: Number(formData.salePrice) > 0 ? Math.round(((formData.price - formData.salePrice) / formData.price) * 100) : undefined,
      rating: editingProduct ? editingProduct.rating : 4.8,
      reviewCount: editingProduct ? editingProduct.reviewCount : 1,
      sku: formData.sku,
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString(),
      colors: [
        {
          name: formData.colorName,
          code: formData.colorCode,
          images: [formData.imageUrl, formData.imageUrl],
        },
      ],
      sizes: [
        { size: 'XS', stock: Number(formData.stockXS) },
        { size: 'S', stock: Number(formData.stockS) },
        { size: 'M', stock: Number(formData.stockM) },
        { size: 'L', stock: Number(formData.stockL) },
        { size: 'XL', stock: Number(formData.stockXL) },
        { size: 'XXL', stock: Number(formData.stockXXL) },
      ],
    };

    db.saveProduct(newProd);
    setProducts(db.getProducts());
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-title text-3xl font-bold text-brand-dark uppercase tracking-wider">
            PRODUCT MANAGEMENT
          </h1>
          <p className="text-xs text-brand-muted mt-0.5">Manage women&apos;s fashion catalog, prices, images & stock setup.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 bg-brand-dark text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-dark/90 flex items-center justify-center gap-2 rounded shadow"
        >
          <Plus size={16} />
          <span>ADD NEW PRODUCT</span>
        </button>
      </div>

      {/* Table & Controls */}
      <div className="bg-white rounded-lg border border-brand-border shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-3 bg-brand-cream/60 px-4 py-2.5 rounded max-w-md border border-brand-border">
          <Search size={16} className="text-brand-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, SKU, category..."
            className="bg-transparent text-xs w-full focus:outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-brand-dark">
            <thead className="bg-brand-cream uppercase text-[10px] font-bold tracking-wider text-brand-muted">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Total Stock</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {filtered.map((p) => {
                const totalStock = p.sizes.reduce((acc, s) => acc + s.stock, 0);
                const displayImg = p.colors[0]?.images[0] || '';
                return (
                  <tr key={p.id} className="hover:bg-brand-cream/30">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-12 bg-brand-cream rounded overflow-hidden shrink-0 border border-brand-border">
                          {displayImg ? (
                            <Image src={displayImg} alt={p.name} fill unoptimized className="object-cover" />
                          ) : (
                            <ImageIcon size={16} className="m-auto text-brand-muted" />
                          )}
                        </div>
                        <div>
                          <span className="font-bold block line-clamp-1">{p.name}</span>
                          <span className="text-[10px] text-brand-muted">{p.colors.map((c) => c.name).join(', ')}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-[11px] font-semibold">{p.sku}</td>
                    <td className="p-3 uppercase font-medium text-brand-muted">{p.category}</td>
                    <td className="p-3 font-bold">
                      NPR {(p.salePrice || p.price).toLocaleString()}
                      {p.salePrice && <span className="text-brand-muted line-through font-normal text-[10px] block">NPR {p.price.toLocaleString()}</span>}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        totalStock > 20 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-brand-sale'
                      }`}>
                        {totalStock} UNITS
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-brand-dark hover:bg-brand-cream rounded"
                          title="Edit Product"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 text-brand-sale hover:bg-rose-50 rounded"
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />

          <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-2xl z-10 p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-brand-border">
              <h3 className="font-serif-title text-lg font-bold text-brand-dark uppercase tracking-wider">
                {editingProduct ? 'EDIT PRODUCT & INVENTORY' : 'CREATE NEW PRODUCT'}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-brand-dark block mb-1">PRODUCT NAME *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 border border-brand-border rounded focus:outline-none focus:border-brand-dark"
                  />
                </div>
                <div>
                  <label className="font-semibold text-brand-dark block mb-1">SKU CODE *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full p-2.5 border border-brand-border rounded font-mono focus:outline-none focus:border-brand-dark"
                  />
                </div>
                <div>
                  <label className="font-semibold text-brand-dark block mb-1">CATEGORY *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 border border-brand-border rounded bg-white"
                  >
                    <option value="tops">Tops & Blouses</option>
                    <option value="dresses">Dresses</option>
                    <option value="bottoms">Bottoms & Jeans</option>
                    <option value="sets">Co-ord Sets</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-brand-dark block mb-1">ORIGINAL PRICE (NPR) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full p-2.5 border border-brand-border rounded font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-brand-dark block mb-1">SALE PRICE (NPR)</label>
                  <input
                    type="number"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: Number(e.target.value) })}
                    className="w-full p-2.5 border border-brand-border rounded font-mono font-bold"
                  />
                </div>
                <div className="md:col-span-2 space-y-2 pt-2 border-t border-brand-border">
                  <label className="font-bold text-brand-dark uppercase tracking-wider block">CLOTHING PICTURE *</label>
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-24 bg-brand-cream rounded border border-brand-border overflow-hidden shrink-0">
                      {formData.imageUrl ? (
                        <Image src={formData.imageUrl} alt="Preview" fill unoptimized className="object-cover" />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-brand-muted">
                          <ImageIcon size={20} />
                          <span className="text-[9px] mt-1">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 border-2 border-dashed border-brand-border hover:border-brand-dark bg-brand-cream/30 p-3 rounded text-center transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        id="product-photo-file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, (url) => setFormData({ ...formData, imageUrl: url }));
                        }}
                      />
                      <label
                        htmlFor="product-photo-file"
                        className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-brand-dark text-white text-xs font-bold rounded uppercase tracking-wider hover:bg-brand-dark/90"
                      >
                        <Upload size={14} />
                        <span>Upload Photo from Local Device</span>
                      </label>
                      <p className="text-[10px] text-brand-muted mt-1.5">Select image file from computer (PNG, JPG, WEBP)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-brand-dark block mb-1">CLOTHES DESCRIPTION & DETAILS</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 border border-brand-border rounded"
                />
              </div>

              {/* Color Details */}
              <div className="p-4 bg-brand-cream/40 border border-brand-border rounded space-y-3">
                <h4 className="font-serif-title font-bold text-brand-dark uppercase tracking-wider">
                  COLOR SPECIFICATIONS
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-brand-dark block mb-1">COLOR NAME</label>
                    <input
                      type="text"
                      value={formData.colorName}
                      onChange={(e) => setFormData({ ...formData, colorName: e.target.value })}
                      className="w-full p-2 border border-brand-border rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-brand-dark block mb-1">COLOR HEX CODE</label>
                    <input
                      type="text"
                      value={formData.colorCode}
                      onChange={(e) => setFormData({ ...formData, colorCode: e.target.value })}
                      className="w-full p-2 border border-brand-border rounded font-mono bg-white uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Size & Stock Allocation */}
              <div className="p-4 bg-brand-cream/40 border border-brand-border rounded space-y-3">
                <h4 className="font-serif-title font-bold text-brand-dark uppercase tracking-wider">
                  SIZE-BY-SIZE STOCK ALLOCATION
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
                        value={(formData as any)[sz.key]}
                        onChange={(e) => setFormData({ ...formData, [sz.key]: Number(e.target.value) })}
                        className="w-full p-2 border border-brand-border rounded text-center font-mono font-bold bg-white"
                      />
                    </div>
                  ))}
                </div>
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
                  SAVE PRODUCT & INVENTORY
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
