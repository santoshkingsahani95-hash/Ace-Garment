'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Instagram, Facebook, ArrowRight, CheckCircle2 } from 'lucide-react';
import { db } from '@/lib/db';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }
    const res = db.addNewsletterSubscriber(email);
    setStatus({ type: 'success', message: res.message });
    setEmail('');
  };

  return (
    <footer className="bg-brand-dark text-white pt-16 pb-12 border-t border-brand-dark">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-white/10">
          {/* Column 1: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="font-serif-title text-2xl md:text-3xl font-bold tracking-widest block text-white">
              ACE GARMENT
            </Link>
            <p className="text-xs text-white/70 max-w-sm leading-relaxed font-sans">
              Modern women’s fashion made for your everyday confidence. Clean silhouettes, luxury fabrics, and understated elegance.
            </p>

            <div className="pt-4">
              <span className="text-[11px] uppercase tracking-widest text-white/50 block mb-2 font-semibold">JOIN THE ACE CLUB</span>
              <form onSubmit={handleSubscribe} className="flex max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-white/10 text-white placeholder:text-white/40 text-xs px-4 py-3 focus:outline-none flex-1 border border-white/20 border-r-0 rounded-l"
                />
                <button
                  type="submit"
                  className="bg-white text-brand-dark hover:bg-brand-cream text-xs font-semibold px-5 py-3 rounded-r uppercase tracking-wider transition-colors flex items-center justify-center"
                >
                  <ArrowRight size={16} />
                </button>
              </form>
              {status.type === 'success' && (
                <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
                  <CheckCircle2 size={12} /> {status.message}
                </p>
              )}
              {status.type === 'error' && (
                <p className="text-[11px] text-rose-400 mt-2">{status.message}</p>
              )}
            </div>
          </div>

          {/* Column 2: SHOP */}
          <div>
            <h4 className="font-serif-title text-sm font-semibold tracking-wider text-white uppercase mb-4">
              SHOP
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70 font-sans">
              <li>
                <Link href="/category/new-arrivals" className="hover:text-white transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/category/tops" className="hover:text-white transition-colors">
                  Tops & Blouses
                </Link>
              </li>
              <li>
                <Link href="/category/dresses" className="hover:text-white transition-colors">
                  Dresses
                </Link>
              </li>
              <li>
                <Link href="/category/bottoms" className="hover:text-white transition-colors">
                  Bottoms & Jeans
                </Link>
              </li>
              <li>
                <Link href="/category/sets" className="hover:text-white transition-colors">
                  Co-ord Sets
                </Link>
              </li>
              <li>
                <Link href="/category/sale" className="text-brand-gold font-medium hover:text-white transition-colors">
                  Sale Edit
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: HELP */}
          <div>
            <h4 className="font-serif-title text-sm font-semibold tracking-wider text-white uppercase mb-4">
              HELP
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70 font-sans">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="hover:text-white transition-colors">
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: COMPANY & SOCIAL */}
          <div>
            <h4 className="font-serif-title text-sm font-semibold tracking-wider text-white uppercase mb-4">
              COMPANY
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70 font-sans mb-6">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About ACE Garment
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>

            <span className="text-[11px] uppercase tracking-widest text-white/50 block mb-3 font-semibold">FOLLOW US</span>
            <div className="flex gap-3 text-white/70">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-white/10 rounded-full hover:bg-white hover:text-brand-dark transition-all"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-white/10 rounded-full hover:bg-white hover:text-brand-dark transition-all"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-white/50 gap-4 font-sans">
          <p>© 2026 ACE GARMENT. All Rights Reserved. Designed for modern women.</p>
          <div className="flex gap-4 text-[11px]">
            <span>Secured Payments: eSewa • Khalti • Fonepay • COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
