'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { QrCode, Save, CheckCircle2, Image as ImageIcon, Upload, ShieldCheck, Cpu, Image as ImageLucide, Zap } from 'lucide-react';
import { db } from '@/lib/db';
import { HomepageCMS, FonepaySettings } from '@/types';

export default function AdminFonepayPage() {
  const [cms, setCms] = useState<HomepageCMS>(db.getCMS());
  const [saveSuccess, setSaveSuccess] = useState('');

  const [settings, setSettings] = useState<FonepaySettings>(
    cms.fonepaySettings || {
      qrMode: 'static',
      qrImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
      merchantName: 'DAISY HUB PVT LTD',
      merchantCode: 'DAISY8849',
      accountNumber: '9841234567',
      instructions: 'Scan this official Fonepay QR code using any Mobile Banking app or digital wallet to complete payment.',
      autoVerifyEnabled: true,
      apiUsername: 'demo_username',
      apiPassword: 'demo_password',
      apiKey: 'demo_secret_key',
    }
  );

  useEffect(() => {
    const loadedCms = db.getCMS();
    setCms(loadedCms);
    if (loadedCms.fonepaySettings) {
      setSettings(loadedCms.fonepaySettings);
    }
  }, []);

  const saveSettingsToDb = (newSettings: FonepaySettings) => {
    const currentCms = db.getCMS();
    const updatedCms: HomepageCMS = {
      ...currentCms,
      fonepaySettings: newSettings,
    };
    db.updateCMS(updatedCms);
    setCms(updatedCms);
  };

  const handleFileUpload = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawUrl = e.target?.result as string;
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 600;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          const next = { ...settings, qrImageUrl: compressed };
          setSettings(next);
          saveSettingsToDb(next);
        } else {
          const next = { ...settings, qrImageUrl: rawUrl };
          setSettings(next);
          saveSettingsToDb(next);
        }
      };
      img.onerror = () => {
        const next = { ...settings, qrImageUrl: rawUrl };
        setSettings(next);
        saveSettingsToDb(next);
      };
      img.src = rawUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettingsToDb(settings);
    setSaveSuccess('Fonepay QR & Payment settings saved live across storefront!');
    setTimeout(() => setSaveSuccess(''), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-title text-3xl font-bold text-brand-dark uppercase tracking-wider flex items-center gap-3">
            <QrCode className="text-brand-gold" size={28} />
            <span>FONEPAY QR & PAYMENT SETTINGS</span>
          </h1>
          <p className="text-xs text-brand-muted mt-0.5">
            Manage Fonepay mode (Static Store QR Photo vs Dynamic API), upload QR image, and edit payment details.
          </p>
        </div>
        {saveSuccess && (
          <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-2 rounded flex items-center gap-1.5 border border-emerald-200 shadow-xs">
            <CheckCircle2 size={16} /> {saveSuccess}
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* SECTION 1: QR MODE SELECTOR (STATIC VS DYNAMIC) */}
        <div className="bg-white p-6 rounded-lg border border-brand-border shadow-sm space-y-4">
          <h2 className="font-serif-title text-base font-bold text-brand-dark uppercase tracking-wider border-b border-brand-border pb-3 flex items-center justify-between">
            <span>1. CHOOSE FONEPAY QR MODE</span>
            <span className="text-[10px] font-mono text-brand-gold font-bold uppercase">CHECKOUT DISPLAY</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mode Option 1: Static Merchant QR Photo */}
            <label
              className={`p-5 rounded-lg border-2 cursor-pointer transition-all space-y-3 relative ${
                settings.qrMode === 'static'
                  ? 'border-brand-dark bg-brand-cream/30 shadow-sm'
                  : 'border-brand-border hover:border-brand-dark/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="qrMode"
                    value="static"
                    checked={settings.qrMode === 'static'}
                    onChange={() => {
                      const next = { ...settings, qrMode: 'static' as const };
                      setSettings(next);
                      saveSettingsToDb(next);
                    }}
                    className="w-4 h-4 accent-brand-dark"
                  />
                  <span className="font-serif-title font-bold text-sm text-brand-dark uppercase">STATIC STORE QR PHOTO</span>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold font-mono px-2 py-0.5 rounded">
                  RECOMMENDED
                </span>
              </div>
              <p className="text-xs text-brand-muted leading-relaxed">
                Upload your store&apos;s official Fonepay QR code image file from your computer. Customers will scan this exact QR code image during checkout.
              </p>
            </label>

            {/* Mode Option 2: Dynamic QR API */}
            <label
              className={`p-5 rounded-lg border-2 cursor-pointer transition-all space-y-3 relative ${
                settings.qrMode === 'dynamic'
                  ? 'border-brand-dark bg-brand-cream/30 shadow-sm'
                  : 'border-brand-border hover:border-brand-dark/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="qrMode"
                    value="dynamic"
                    checked={settings.qrMode === 'dynamic'}
                    onChange={() => {
                      const next = { ...settings, qrMode: 'dynamic' as const };
                      setSettings(next);
                      saveSettingsToDb(next);
                    }}
                    className="w-4 h-4 accent-brand-dark"
                  />
                  <span className="font-serif-title font-bold text-sm text-brand-dark uppercase">DYNAMIC QR API</span>
                </div>
                <span className="bg-blue-100 text-blue-800 text-[9px] font-bold font-mono px-2 py-0.5 rounded">
                  AUTOMATED API
                </span>
              </div>
              <p className="text-xs text-brand-muted leading-relaxed">
                Generates a unique dynamic QR code for every checkout via Fonepay REST API with real-time WebSocket payment listening.
              </p>
            </label>
          </div>
        </div>

        {/* SECTION 2: STATIC FONEPAY QR CODE IMAGE UPLOAD */}
        <div className="bg-white p-6 rounded-lg border border-brand-border shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-brand-border pb-3">
            <h2 className="font-serif-title text-base font-bold text-brand-dark uppercase tracking-wider flex items-center gap-2">
              <Upload size={18} className="text-brand-gold" />
              <span>2. UPLOAD STORE FONEPAY QR CODE IMAGE</span>
            </h2>
            <span className="text-[10px] text-brand-muted font-mono font-bold">LOCAL FILE / URL</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Live QR Image Preview */}
            <div className="md:col-span-5 space-y-2 text-center">
              <label className="text-xs font-bold text-brand-dark uppercase tracking-wider block">
                LIVE STORE QR PREVIEW
              </label>
              <div className="relative aspect-square w-52 mx-auto bg-white rounded-xl border-4 border-brand-dark overflow-hidden p-3 shadow-md flex items-center justify-center">
                {settings.qrImageUrl ? (
                  <img src={settings.qrImageUrl} alt="Store Fonepay QR Preview" className="w-full h-full object-contain p-1" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-brand-muted">
                    <ImageIcon size={36} />
                    <span className="text-[10px] mt-2">No Image Uploaded</span>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Controls */}
            <div className="md:col-span-7 space-y-4 text-xs">
              <div>
                <label className="font-bold text-brand-dark uppercase tracking-wider block mb-2">
                  UPLOAD LOCAL QR PHOTO FROM COMPUTER *
                </label>
                <div className="border-2 border-dashed border-brand-border hover:border-brand-dark bg-brand-cream/30 p-4 rounded-lg text-center transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    id="fonepay-admin-qr-file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                  />
                  <label
                    htmlFor="fonepay-admin-qr-file"
                    className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-brand-dark text-white text-xs font-bold rounded uppercase tracking-wider hover:bg-brand-dark/90 shadow"
                  >
                    <Upload size={16} />
                    <span>Choose Photo File from Device</span>
                  </label>
                  <p className="text-[10px] text-brand-muted mt-2">
                    Supports PNG, JPG, WEBP, GIF (Recommended size: square 500x500px)
                  </p>
                </div>
              </div>

              <div>
                <label className="font-semibold text-brand-dark block mb-1">OR PASTE EXTERNAL QR IMAGE LINK / URL</label>
                <input
                  type="url"
                  value={settings.qrImageUrl}
                  onChange={(e) => {
                    const next = { ...settings, qrImageUrl: e.target.value };
                    setSettings(next);
                    saveSettingsToDb(next);
                  }}
                  placeholder="https://..."
                  className="w-full p-3 border border-brand-border rounded text-xs bg-white focus:outline-none focus:border-brand-dark"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: MERCHANT & ACCOUNT DETAILS */}
        <div className="bg-white p-6 rounded-lg border border-brand-border shadow-sm space-y-4">
          <h2 className="font-serif-title text-base font-bold text-brand-dark uppercase tracking-wider border-b border-brand-border pb-3">
            3. MERCHANT STORE DETAILS & INSTRUCTIONS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-brand-dark block mb-1">STORE / MERCHANT NAME *</label>
              <input
                type="text"
                required
                value={settings.merchantName}
                onChange={(e) => setSettings({ ...settings, merchantName: e.target.value })}
                placeholder="e.g. DAISY HUB PVT LTD"
                className="w-full p-3 border border-brand-border rounded font-bold text-sm focus:outline-none focus:border-brand-dark"
              />
            </div>

            <div>
              <label className="font-semibold text-brand-dark block mb-1">FONEPAY MOBILE / ACCOUNT NUMBER *</label>
              <input
                type="text"
                required
                value={settings.accountNumber}
                onChange={(e) => setSettings({ ...settings, accountNumber: e.target.value })}
                placeholder="e.g. 9841234567"
                className="w-full p-3 border border-brand-border rounded font-mono font-bold text-sm focus:outline-none focus:border-brand-dark"
              />
            </div>

            <div>
              <label className="font-semibold text-brand-dark block mb-1">FONEPAY MERCHANT CODE</label>
              <input
                type="text"
                value={settings.merchantCode}
                onChange={(e) => setSettings({ ...settings, merchantCode: e.target.value })}
                placeholder="e.g. ACEG8849"
                className="w-full p-3 border border-brand-border rounded font-mono font-bold uppercase"
              />
            </div>

            <div>
              <label className="font-semibold text-brand-dark block mb-1">AUTO REST VERIFY ON CHECKOUT</label>
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="autoVerify"
                  checked={settings.autoVerifyEnabled}
                  onChange={(e) => setSettings({ ...settings, autoVerifyEnabled: e.target.checked })}
                  className="w-4 h-4 accent-brand-dark"
                />
                <label htmlFor="autoVerify" className="text-xs text-brand-dark font-medium">
                  Require REST payment verification before allowing checkout completion
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="font-semibold text-brand-dark block mb-1">CUSTOMER PAYMENT INSTRUCTIONS</label>
              <textarea
                rows={3}
                value={settings.instructions}
                onChange={(e) => setSettings({ ...settings, instructions: e.target.value })}
                placeholder="Instructions shown to customers under the QR code during checkout..."
                className="w-full p-3 border border-brand-border rounded text-xs"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: DYNAMIC QR API CREDENTIALS (IF DYNAMIC MODE USED) */}
        {settings.qrMode === 'dynamic' && (
          <div className="bg-white p-6 rounded-lg border border-brand-border shadow-sm space-y-4">
            <h2 className="font-serif-title text-base font-bold text-brand-dark uppercase tracking-wider border-b border-brand-border pb-3 flex items-center gap-2">
              <Zap size={18} className="text-brand-gold" />
              <span>4. FONEPAY DYNAMIC QR API CREDENTIALS</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-semibold text-brand-dark block mb-1">API USERNAME</label>
                <input
                  type="text"
                  value={settings.apiUsername || ''}
                  onChange={(e) => setSettings({ ...settings, apiUsername: e.target.value })}
                  placeholder="demo_username"
                  className="w-full p-2.5 border border-brand-border rounded font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-brand-dark block mb-1">API PASSWORD</label>
                <input
                  type="password"
                  value={settings.apiPassword || ''}
                  onChange={(e) => setSettings({ ...settings, apiPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full p-2.5 border border-brand-border rounded font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-brand-dark block mb-1">API KEY (HMAC SECRET)</label>
                <input
                  type="password"
                  value={settings.apiKey || ''}
                  onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                  placeholder="demo_secret_key"
                  className="w-full p-2.5 border border-brand-border rounded font-mono"
                />
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-4 bg-brand-dark text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-dark/90 transition-all flex items-center justify-center gap-2 shadow-lg rounded"
        >
          <Save size={18} />
          <span>SAVE & PUBLISH FONEPAY QR SETTINGS</span>
        </button>
      </form>
    </div>
  );
}
