'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Chrome } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { AnnouncementBar } from '@/components/layout/announcement-bar';
import { Footer } from '@/components/layout/footer';
import { useStore } from '@/lib/store';

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useStore();

  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      id: `usr-${Date.now()}`,
      name: fullName || 'New Customer',
      email: email,
      mobile: mobile,
      role: 'CUSTOMER',
      registrationDate: new Date().toISOString().split('T')[0],
    });
    router.push('/account');
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream/30">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-lg border border-brand-border shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[11px] uppercase tracking-ultra font-bold text-brand-gold">JOIN THE ACE CLUB</span>
            <h1 className="font-serif-title text-3xl font-bold text-brand-dark">CREATE ACCOUNT</h1>
            <p className="text-xs text-brand-muted">Enjoy first access to new drops, exclusive offers & order tracking.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-brand-dark block mb-1">FULL NAME *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Aayusha Karki"
                className="w-full p-3 border border-brand-border rounded text-xs focus:outline-none focus:border-brand-dark"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-brand-dark block mb-1">MOBILE NUMBER *</label>
              <input
                type="text"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="9841234567"
                className="w-full p-3 border border-brand-border rounded text-xs focus:outline-none focus:border-brand-dark"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-brand-dark block mb-1">EMAIL ADDRESS *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aayusha@example.com"
                className="w-full p-3 border border-brand-border rounded text-xs focus:outline-none focus:border-brand-dark"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-brand-dark block mb-1">PASSWORD *</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full p-3 border border-brand-border rounded text-xs focus:outline-none focus:border-brand-dark"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-brand-dark text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-dark/90 transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <span>CREATE ACCOUNT</span>
              <ArrowRight size={14} />
            </button>
          </form>

          <p className="text-xs text-brand-muted text-center pt-2">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-brand-dark hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
