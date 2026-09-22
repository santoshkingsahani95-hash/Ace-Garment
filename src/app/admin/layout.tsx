'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Boxes,
  Layers,
  ShoppingBag,
  Sliders,
  Tag,
  Star,
  QrCode,
  ArrowLeft,
  Menu,
  X,
  LogOut,
  ExternalLink,
  Globe,
  User as UserIcon,
} from 'lucide-react';
import { useStore } from '@/lib/store';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout, switchRole } = useStore();

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Categories', href: '/admin/categories', icon: Layers },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Inventory', href: '/admin/inventory', icon: Boxes },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Fonepay QR Settings', href: '/admin/fonepay', icon: QrCode },
    { label: 'Homepage CMS', href: '/admin/cms', icon: Sliders },
    { label: 'Coupons', href: '/admin/coupons', icon: Tag },
    { label: 'Reviews', href: '/admin/reviews', icon: Star },
  ];

  return (
    <div className="min-h-screen flex bg-brand-cream/40 font-sans">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-dark text-white flex flex-col justify-between transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Header Branding */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-brand-gold uppercase tracking-ultra font-bold block">SaaS CONTROL CENTER</span>
              <span className="font-serif-title text-xl font-bold tracking-wider text-white">DAISY HUB</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-white/70 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1 text-xs uppercase tracking-wider font-semibold">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded transition-all ${
                    isActive
                      ? 'bg-white text-brand-dark font-bold shadow-md'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2.5 text-xs text-brand-gold hover:text-white transition-colors font-bold uppercase tracking-wider bg-white/5 rounded hover:bg-white/10"
          >
            <Globe size={16} />
            <span>View Live Website ↗</span>
          </Link>

          <Link
            href="/account"
            className="flex items-center gap-2 px-4 py-2.5 text-xs text-white/70 hover:text-white transition-colors"
          >
            <UserIcon size={16} />
            <span>Customer Account View</span>
          </Link>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-rose-400 hover:text-rose-300 transition-colors"
          >
            <LogOut size={16} />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="bg-white border-b border-brand-border px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-subtle">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden text-brand-dark"
          >
            <Menu size={22} />
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-brand-dark">Administrator Portal</span>
            <span className="bg-brand-dark text-white text-[10px] font-bold font-mono px-2 py-0.5 rounded">
              v1.0 LIVE
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {/* View Storefront Quick Button */}
            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-1.5 bg-brand-cream hover:bg-brand-dark hover:text-white text-brand-dark text-[11px] font-bold uppercase tracking-wider rounded border border-brand-border transition-all flex items-center gap-1.5 shadow-xs"
              title="Open storefront in new tab"
            >
              <Globe size={14} className="text-brand-gold" />
              <span>View Store Front</span>
              <ExternalLink size={12} />
            </Link>

            <span className="font-bold text-brand-dark hidden sm:inline">{user?.name || 'Admin Manager'}</span>
            <div className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center font-bold text-xs shadow-xs">
              AG
            </div>
          </div>
        </header>

        {/* Dynamic Page Container */}
        <main className="p-6 md:p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
