'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Package, Heart, MapPin, Key, LogOut, ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { AnnouncementBar } from '@/components/layout/announcement-bar';
import { Footer } from '@/components/layout/footer';
import { useStore } from '@/lib/store';
import { db } from '@/lib/db';
import { Order } from '@/types';

export default function AccountPage() {
  const router = useRouter();
  const { user, logout, wishlist } = useStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile' | 'addresses' | 'security'>('orders');
  const [userOrders, setUserOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    const orders = db.getOrders();
    setUserOrders(orders);
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream/30">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full">
        {/* Welcome Card */}
        <div className="bg-white p-6 md:p-8 rounded-lg border border-brand-border shadow-sm flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-ultra font-bold text-brand-gold">CUSTOMER PORTAL</span>
            <h1 className="font-serif-title text-3xl font-bold text-brand-dark">WELCOME, {user.name.toUpperCase()}</h1>
            <p className="text-xs text-brand-muted mt-0.5">{user.email} • Member since {user.registrationDate}</p>
          </div>

          <div className="flex gap-3">
            {user.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="px-4 py-2.5 bg-brand-gold text-white text-xs font-bold uppercase tracking-wider rounded"
              >
                ADMIN PANEL
              </Link>
            )}
            <button
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="px-4 py-2.5 border border-brand-border text-xs font-semibold text-brand-dark hover:bg-brand-cream rounded flex items-center gap-1.5"
            >
              <LogOut size={14} />
              <span>LOGOUT</span>
            </button>
          </div>
        </div>

        {/* Dashboard Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3 space-y-2">
            {[
              { id: 'orders', label: 'My Orders', icon: Package, count: userOrders.length },
              { id: 'wishlist', label: 'Wishlist', icon: Heart, count: wishlist.length },
              { id: 'profile', label: 'Profile Details', icon: User },
              { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
              { id: 'security', label: 'Security & Password', icon: Key },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full p-4 rounded text-left text-xs font-semibold uppercase tracking-wider flex items-center justify-between transition-all ${
                    activeTab === tab.id
                      ? 'bg-brand-dark text-white shadow'
                      : 'bg-white text-brand-dark hover:bg-brand-cream border border-brand-border/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && (
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                      activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-brand-cream text-brand-dark'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Main Display Pane */}
          <div className="lg:col-span-9 bg-white p-6 md:p-8 rounded-lg border border-brand-border shadow-sm">
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="font-serif-title text-xl font-bold text-brand-dark uppercase tracking-wider border-b border-brand-border pb-4">
                  ORDER HISTORY
                </h2>

                {userOrders.length === 0 ? (
                  <div className="text-center py-12 text-xs text-brand-muted space-y-3">
                    <Package size={36} className="mx-auto text-brand-muted/40 stroke-1" />
                    <p className="font-serif-title text-base font-semibold text-brand-dark">No past orders placed yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userOrders.map((ord) => (
                      <div key={ord.id} className="p-5 border border-brand-border rounded space-y-3 bg-brand-cream/20">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-brand-border text-xs gap-2">
                          <div>
                            <span className="font-mono font-bold text-brand-dark">{ord.orderNumber}</span>
                            <span className="text-brand-muted block text-[11px]">Placed on {new Date(ord.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase px-2.5 py-1 rounded">
                              {ord.orderStatus}
                            </span>
                            <span className="font-bold text-brand-dark">NPR {ord.total.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="text-xs text-brand-muted space-y-1">
                          <p><span className="font-semibold text-brand-dark">Items:</span> {ord.items.map((i) => `${i.productName} (${i.size})`).join(', ')}</p>
                          <p><span className="font-semibold text-brand-dark">Payment:</span> {ord.paymentMethod.toUpperCase()} ({ord.paymentStatus})</p>
                        </div>

                        <div className="pt-2 flex justify-end">
                          <Link
                            href={`/order-confirmation/${ord.id}`}
                            className="text-xs font-bold text-brand-dark hover:text-brand-gold flex items-center gap-1 uppercase tracking-wider"
                          >
                            <span>VIEW RECEIPT</span>
                            <ArrowRight size={12} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="font-serif-title text-xl font-bold text-brand-dark uppercase tracking-wider border-b border-brand-border pb-4">
                  PERSONAL PROFILE
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-brand-dark block mb-1">FULL NAME</label>
                    <input type="text" defaultValue={user.name} className="w-full p-3 border border-brand-border rounded bg-brand-cream/30" />
                  </div>
                  <div>
                    <label className="font-semibold text-brand-dark block mb-1">EMAIL ADDRESS</label>
                    <input type="email" defaultValue={user.email} className="w-full p-3 border border-brand-border rounded bg-brand-cream/30" disabled />
                  </div>
                  <div>
                    <label className="font-semibold text-brand-dark block mb-1">MOBILE NUMBER</label>
                    <input type="text" defaultValue={user.mobile || ''} className="w-full p-3 border border-brand-border rounded" />
                  </div>
                </div>
                <button className="px-6 py-3 bg-brand-dark text-white text-xs font-bold uppercase tracking-widest">
                  SAVE CHANGES
                </button>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <h2 className="font-serif-title text-xl font-bold text-brand-dark uppercase tracking-wider border-b border-brand-border pb-4">
                  SAVED ADDRESSES
                </h2>
                <div className="p-4 border border-brand-border rounded bg-brand-cream/20 space-y-1 text-xs">
                  <span className="text-[10px] bg-brand-dark text-white font-bold px-2 py-0.5 rounded uppercase font-mono">DEFAULT</span>
                  <p className="font-bold text-brand-dark pt-2">{user.name}</p>
                  <p className="text-brand-muted">Baneshwor Height, Ward 10, Kathmandu</p>
                  <p className="text-brand-muted">Bagmati Province, Nepal</p>
                  <p className="text-brand-muted font-mono">Mobile: {user.mobile || '+977 9841234567'}</p>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6 max-w-md">
                <h2 className="font-serif-title text-xl font-bold text-brand-dark uppercase tracking-wider border-b border-brand-border pb-4">
                  CHANGE PASSWORD
                </h2>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-brand-dark block mb-1">CURRENT PASSWORD</label>
                    <input type="password" className="w-full p-3 border border-brand-border rounded" />
                  </div>
                  <div>
                    <label className="font-semibold text-brand-dark block mb-1">NEW PASSWORD</label>
                    <input type="password" className="w-full p-3 border border-brand-border rounded" />
                  </div>
                  <div>
                    <label className="font-semibold text-brand-dark block mb-1">CONFIRM NEW PASSWORD</label>
                    <input type="password" className="w-full p-3 border border-brand-border rounded" />
                  </div>
                </div>
                <button className="px-6 py-3 bg-brand-dark text-white text-xs font-bold uppercase tracking-widest">
                  UPDATE PASSWORD
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
