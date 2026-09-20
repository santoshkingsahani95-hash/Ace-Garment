'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Truck, CreditCard, Lock, CheckCircle2, Tag } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { AnnouncementBar } from '@/components/layout/announcement-bar';
import { Footer } from '@/components/layout/footer';
import { useStore } from '@/lib/store';
import { db } from '@/lib/db';
import { PaymentMethod, Order } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart, user } = useStore();

  const [formData, setFormData] = useState({
    fullName: user ? user.name : 'Aayusha Karki',
    email: user ? user.email : 'aayusha.k@example.com',
    mobile: user ? user.mobile || '9841234567' : '9841234567',
    province: 'Bagmati Province',
    district: 'Kathmandu',
    city: 'Kathmandu',
    streetAddress: 'New Baneshwor, Ward 10',
    landmark: 'Near Standard Chartered Bank',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('esewa');
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponStatus, setCouponStatus] = useState<{ valid: boolean; discountAmount: number; message: string } | null>(null);

  const subtotal = getCartTotal();
  const discount = couponStatus?.valid ? couponStatus.discountAmount : 0;
  const shipping = subtotal >= 3000 ? 0 : 150;
  const total = Math.max(0, subtotal - discount + shipping);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = db.validateCoupon(couponCode, subtotal);
    setCouponStatus(res);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsProcessing(true);

    setTimeout(() => {
      const orderId = `ord-${Date.now().toString().slice(-6)}`;
      const orderNum = `ACE-${Math.floor(100000 + Math.random() * 900000)}`;

      const newOrder: Order = {
        id: orderId,
        orderNumber: orderNum,
        createdAt: new Date().toISOString(),
        items: cart.map((c) => ({
          productId: c.productId,
          productName: c.productName,
          colorName: c.colorName,
          size: c.size,
          quantity: c.quantity,
          price: c.price,
          image: c.image,
        })),
        subtotal: subtotal,
        discount: discount,
        shipping: shipping,
        total: total,
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        orderStatus: 'Confirmed',
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerMobile: formData.mobile,
        shippingAddress: {
          fullName: formData.fullName,
          mobile: formData.mobile,
          email: formData.email,
          province: formData.province,
          district: formData.district,
          city: formData.city,
          streetAddress: formData.streetAddress,
          landmark: formData.landmark,
        },
        estimatedDelivery: '3-5 Business Days',
        trackingNumber: `ACE-TRK-${Math.floor(1000 + Math.random() * 9000)}`,
      };

      db.createOrder(newOrder);
      clearCart();
      setIsProcessing(false);
      router.push(`/order-confirmation/${newOrder.id}`);
    }, 1500);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <AnnouncementBar />
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <h2 className="font-serif-title text-2xl font-bold text-brand-dark mb-4">Your bag is empty</h2>
          <Link href="/shop" className="px-6 py-3 bg-brand-dark text-white text-xs font-semibold uppercase tracking-widest">
            RETURN TO SHOP
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream/30">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full">
        <h1 className="font-serif-title text-3xl md:text-4xl font-bold text-brand-dark mb-8 uppercase tracking-wider">
          SECURE CHECKOUT
        </h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Delivery Address & Payment */}
          <div className="lg:col-span-7 space-y-8">
            {/* Contact Details */}
            <div className="bg-white p-6 rounded-lg border border-brand-border shadow-sm space-y-4">
              <h2 className="font-serif-title text-lg font-bold text-brand-dark uppercase tracking-wider flex items-center gap-2">
                <span>1. CONTACT DETAILS</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-brand-dark block mb-1">FULL NAME *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-brand-border rounded text-xs focus:outline-none focus:border-brand-dark"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-brand-dark block mb-1">MOBILE NUMBER *</label>
                  <input
                    type="text"
                    name="mobile"
                    required
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-brand-border rounded text-xs focus:outline-none focus:border-brand-dark"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-brand-dark block mb-1">EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-brand-border rounded text-xs focus:outline-none focus:border-brand-dark"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white p-6 rounded-lg border border-brand-border shadow-sm space-y-4">
              <h2 className="font-serif-title text-lg font-bold text-brand-dark uppercase tracking-wider">
                2. SHIPPING ADDRESS (NEPAL)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-brand-dark block mb-1">PROVINCE *</label>
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-brand-border rounded text-xs focus:outline-none focus:border-brand-dark bg-white"
                  >
                    <option value="Koshi Province">Koshi Province</option>
                    <option value="Madhesh Province">Madhesh Province</option>
                    <option value="Bagmati Province">Bagmati Province</option>
                    <option value="Gandaki Province">Gandaki Province</option>
                    <option value="Lumbini Province">Lumbini Province</option>
                    <option value="Karnali Province">Karnali Province</option>
                    <option value="Sudurpashchim Province">Sudurpashchim Province</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-brand-dark block mb-1">DISTRICT *</label>
                  <input
                    type="text"
                    name="district"
                    required
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-brand-border rounded text-xs focus:outline-none focus:border-brand-dark"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-brand-dark block mb-1">CITY / TOWN *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-brand-border rounded text-xs focus:outline-none focus:border-brand-dark"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-brand-dark block mb-1">STREET ADDRESS *</label>
                  <input
                    type="text"
                    name="streetAddress"
                    required
                    value={formData.streetAddress}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-brand-border rounded text-xs focus:outline-none focus:border-brand-dark"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-brand-dark block mb-1">LANDMARK / INSTRUCTIONS (OPTIONAL)</label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    placeholder="e.g. Opposite Nepal Bank, Blue Gate"
                    className="w-full p-3 border border-brand-border rounded text-xs focus:outline-none focus:border-brand-dark"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Architecture */}
            <div className="bg-white p-6 rounded-lg border border-brand-border shadow-sm space-y-4">
              <h2 className="font-serif-title text-lg font-bold text-brand-dark uppercase tracking-wider flex items-center gap-2">
                <Lock size={18} className="text-brand-dark" />
                <span>3. SELECT PAYMENT METHOD</span>
              </h2>

              <div className="space-y-3">
                {[
                  { id: 'esewa', label: 'eSewa Mobile Wallet', badge: 'Instant Payment' },
                  { id: 'khalti', label: 'Khalti Digital Wallet', badge: 'Instant Payment' },
                  { id: 'fonepay', label: 'Fonepay QR / Mobile Banking', badge: 'QR Scan' },
                  { id: 'cod', label: 'Cash on Delivery (COD)', badge: 'Pay on Arrival' },
                  { id: 'card', label: 'Visa / Mastercard Online Card', badge: 'Encrypted' },
                ].map((pm) => (
                  <label
                    key={pm.id}
                    className={`flex items-center justify-between p-4 rounded border cursor-pointer transition-all ${
                      paymentMethod === pm.id ? 'border-brand-dark bg-brand-cream/40 font-bold' : 'border-brand-border hover:border-brand-dark'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={pm.id}
                        checked={paymentMethod === pm.id}
                        onChange={() => setPaymentMethod(pm.id as PaymentMethod)}
                        className="accent-brand-dark"
                      />
                      <span className="text-xs text-brand-dark font-medium">{pm.label}</span>
                    </div>
                    <span className="text-[10px] bg-brand-dark/10 text-brand-dark px-2 py-0.5 rounded font-mono font-semibold">
                      {pm.badge}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-lg border border-brand-border shadow-sm space-y-6 sticky top-28">
              <h2 className="font-serif-title text-lg font-bold text-brand-dark uppercase tracking-wider">
                ORDER SUMMARY ({cart.reduce((a, b) => a + b.quantity, 0)} ITEMS)
              </h2>

              {/* Items List */}
              <div className="divide-y divide-brand-border max-h-64 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 aspect-[3/4] bg-brand-cream rounded overflow-hidden shrink-0">
                        <Image src={item.image} alt={item.productName} fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-brand-dark line-clamp-1">{item.productName}</h4>
                        <p className="text-[11px] text-brand-muted">{item.colorName} / {item.size} x {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-brand-dark shrink-0">
                      NPR {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Input Form */}
              <div className="space-y-2 border-t border-brand-border pt-4">
                <label className="text-xs font-semibold text-brand-dark flex items-center gap-1">
                  <Tag size={12} /> PROMO / COUPON CODE
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. WELCOME10 or ACE500"
                    className="bg-brand-cream/60 border border-brand-border text-xs px-3 py-2 flex-1 rounded-l uppercase font-mono focus:outline-none focus:border-brand-dark"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="bg-brand-dark text-white text-xs font-bold px-4 py-2 rounded-r uppercase tracking-wider hover:bg-brand-dark/90"
                  >
                    APPLY
                  </button>
                </div>
                {couponStatus && (
                  <p className={`text-[11px] font-medium ${couponStatus.valid ? 'text-emerald-600' : 'text-brand-sale'}`}>
                    {couponStatus.message}
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-2 text-xs border-t border-brand-border pt-4">
                <div className="flex justify-between text-brand-muted">
                  <span>Subtotal</span>
                  <span className="font-bold text-brand-dark">NPR {subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon Discount</span>
                    <span>- NPR {discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-brand-muted">
                  <span>Delivery Charge</span>
                  <span>{shipping === 0 ? 'FREE' : `NPR ${shipping}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-brand-dark pt-3 border-t border-brand-border">
                  <span>TOTAL AMOUNT</span>
                  <span className="text-base font-serif-title">NPR {total.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-brand-dark text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-dark/90 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>CONFIRMING ORDER...</span>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    <span>CONFIRM & PLACE ORDER</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-brand-muted text-center italic">
                By placing your order, you agree to ACE GARMENT&apos;s Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
