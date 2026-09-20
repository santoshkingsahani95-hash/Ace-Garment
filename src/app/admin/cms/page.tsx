'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Sliders, Save, CheckCircle2, Image as ImageIcon, Upload } from 'lucide-react';
import { db } from '@/lib/db';
import { HomepageCMS } from '@/types';

export default function AdminCMSPage() {
  const [cms, setCms] = useState<HomepageCMS>(db.getCMS());
  const [saveSuccess, setSaveSuccess] = useState('');

  useEffect(() => {
    setCms(db.getCMS());
  }, []);

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateCMS(cms);
    setSaveSuccess('Homepage CMS settings updated and live instantly!');
    setTimeout(() => setSaveSuccess(''), 3500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif-title text-3xl font-bold text-brand-dark uppercase tracking-wider">
            HOMEPAGE CMS MANAGEMENT
          </h1>
          <p className="text-xs text-brand-muted mt-0.5">Edit store banners, hero headlines, announcement text & promotional content live without code.</p>
        </div>
        {saveSuccess && (
          <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded flex items-center gap-1">
            <CheckCircle2 size={14} /> {saveSuccess}
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Announcement Bar */}
        <div className="bg-white p-6 rounded-lg border border-brand-border shadow-sm space-y-4">
          <h2 className="font-serif-title text-lg font-bold text-brand-dark uppercase tracking-wider border-b border-brand-border pb-3">
            1. ANNOUNCEMENT BAR CONTROL
          </h2>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="annEnable"
              checked={cms.announcementBar.enabled}
              onChange={(e) => setCms({ ...cms, announcementBar: { ...cms.announcementBar, enabled: e.target.checked } })}
              className="w-4 h-4 accent-brand-dark"
            />
            <label htmlFor="annEnable" className="text-xs font-bold text-brand-dark">Enable Top Announcement Bar</label>
          </div>

          <div>
            <label className="text-xs font-semibold text-brand-dark block mb-1">ANNOUNCEMENT TEXT</label>
            <input
              type="text"
              value={cms.announcementBar.text}
              onChange={(e) => setCms({ ...cms, announcementBar: { ...cms.announcementBar, text: e.target.value } })}
              className="w-full p-3 border border-brand-border rounded text-xs font-medium focus:outline-none focus:border-brand-dark"
            />
          </div>
        </div>

        {/* Section 2: Hero Section */}
        <div className="bg-white p-6 rounded-lg border border-brand-border shadow-sm space-y-4">
          <h2 className="font-serif-title text-lg font-bold text-brand-dark uppercase tracking-wider border-b border-brand-border pb-3">
            2. MAIN FASHION HERO BANNER
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="md:col-span-2">
              <label className="font-semibold text-brand-dark block mb-1">HERO MAIN HEADLINE</label>
              <textarea
                rows={2}
                value={cms.hero.heading}
                onChange={(e) => setCms({ ...cms, hero: { ...cms.hero, heading: e.target.value } })}
                className="w-full p-3 border border-brand-border rounded font-serif-title text-sm focus:outline-none focus:border-brand-dark"
              />
            </div>

            <div className="md:col-span-2">
              <label className="font-semibold text-brand-dark block mb-1">HERO SUBTITLE</label>
              <textarea
                rows={2}
                value={cms.hero.subtitle}
                onChange={(e) => setCms({ ...cms, hero: { ...cms.hero, subtitle: e.target.value } })}
                className="w-full p-3 border border-brand-border rounded focus:outline-none focus:border-brand-dark"
              />
            </div>

            <div>
              <label className="font-semibold text-brand-dark block mb-1">PRIMARY BUTTON TEXT</label>
              <input
                type="text"
                value={cms.hero.buttonText}
                onChange={(e) => setCms({ ...cms, hero: { ...cms.hero, buttonText: e.target.value } })}
                className="w-full p-2.5 border border-brand-border rounded"
              />
            </div>

            <div>
              <label className="font-semibold text-brand-dark block mb-1">PRIMARY BUTTON URL</label>
              <input
                type="text"
                value={cms.hero.buttonUrl}
                onChange={(e) => setCms({ ...cms, hero: { ...cms.hero, buttonUrl: e.target.value } })}
                className="w-full p-2.5 border border-brand-border rounded"
              />
            </div>

            {/* Desktop Hero Image Local Upload */}
            <div className="space-y-2">
              <label className="font-semibold text-brand-dark block">DESKTOP HERO IMAGE *</label>
              <div className="relative h-28 w-full bg-brand-cream rounded border border-brand-border overflow-hidden">
                {cms.hero.desktopImage ? (
                  <Image src={cms.hero.desktopImage} alt="Desktop Hero Preview" fill unoptimized className="object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-brand-muted">
                    <ImageIcon size={24} />
                    <span className="text-[10px] mt-1">No Image Selected</span>
                  </div>
                )}
              </div>
              <div className="border-2 border-dashed border-brand-border hover:border-brand-dark bg-brand-cream/30 p-2.5 rounded text-center transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  id="hero-desktop-file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, (url) => setCms({ ...cms, hero: { ...cms.hero, desktopImage: url } }));
                  }}
                />
                <label
                  htmlFor="hero-desktop-file"
                  className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-dark text-white text-[11px] font-bold rounded uppercase tracking-wider hover:bg-brand-dark/90"
                >
                  <Upload size={14} />
                  <span>Upload Desktop Photo</span>
                </label>
              </div>
            </div>

            {/* Mobile Hero Image Local Upload */}
            <div className="space-y-2">
              <label className="font-semibold text-brand-dark block">MOBILE HERO IMAGE *</label>
              <div className="relative h-28 w-full bg-brand-cream rounded border border-brand-border overflow-hidden">
                {cms.hero.mobileImage ? (
                  <Image src={cms.hero.mobileImage} alt="Mobile Hero Preview" fill unoptimized className="object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-brand-muted">
                    <ImageIcon size={24} />
                    <span className="text-[10px] mt-1">No Image Selected</span>
                  </div>
                )}
              </div>
              <div className="border-2 border-dashed border-brand-border hover:border-brand-dark bg-brand-cream/30 p-2.5 rounded text-center transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  id="hero-mobile-file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, (url) => setCms({ ...cms, hero: { ...cms.hero, mobileImage: url } }));
                  }}
                />
                <label
                  htmlFor="hero-mobile-file"
                  className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-dark text-white text-[11px] font-bold rounded uppercase tracking-wider hover:bg-brand-dark/90"
                >
                  <Upload size={14} />
                  <span>Upload Mobile Photo</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Editorial Banner */}
        <div className="bg-white p-6 rounded-lg border border-brand-border shadow-sm space-y-4">
          <h2 className="font-serif-title text-lg font-bold text-brand-dark uppercase tracking-wider border-b border-brand-border pb-3">
            3. EDITORIAL CAMPAIGN BANNER
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-brand-dark block mb-1">EDITORIAL HEADLINE</label>
              <input
                type="text"
                value={cms.editorialBanner.heading}
                onChange={(e) => setCms({ ...cms, editorialBanner: { ...cms.editorialBanner, heading: e.target.value } })}
                className="w-full p-2.5 border border-brand-border rounded font-serif-title"
              />
            </div>
            <div>
              <label className="font-semibold text-brand-dark block mb-1">BUTTON TEXT</label>
              <input
                type="text"
                value={cms.editorialBanner.buttonText}
                onChange={(e) => setCms({ ...cms, editorialBanner: { ...cms.editorialBanner, buttonText: e.target.value } })}
                className="w-full p-2.5 border border-brand-border rounded"
              />
            </div>

            {/* Campaign Image Local Upload */}
            <div className="md:col-span-2 space-y-2">
              <label className="font-semibold text-brand-dark block">CAMPAIGN IMAGE *</label>
              <div className="relative h-32 w-full bg-brand-cream rounded border border-brand-border overflow-hidden">
                {cms.editorialBanner.image ? (
                  <Image src={cms.editorialBanner.image} alt="Campaign Preview" fill unoptimized className="object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-brand-muted">
                    <ImageIcon size={28} />
                    <span className="text-[10px] mt-1">No Image Selected</span>
                  </div>
                )}
              </div>
              <div className="border-2 border-dashed border-brand-border hover:border-brand-dark bg-brand-cream/30 p-3 rounded text-center transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  id="campaign-photo-file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, (url) => setCms({ ...cms, editorialBanner: { ...cms.editorialBanner, image: url } }));
                  }}
                />
                <label
                  htmlFor="campaign-photo-file"
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-brand-dark text-white text-xs font-bold rounded uppercase tracking-wider hover:bg-brand-dark/90"
                >
                  <Upload size={14} />
                  <span>Upload Campaign Photo from Device</span>
                </label>
                <p className="text-[10px] text-brand-muted mt-1.5">Select image file from local device (PNG, JPG, WEBP)</p>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-brand-dark text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-dark/90 transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          <Save size={16} />
          <span>PUBLISH CMS CHANGES TO LIVE STORE</span>
        </button>
      </form>
    </div>
  );
}
