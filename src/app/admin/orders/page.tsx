'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Eye, CheckCircle2 } from 'lucide-react';
import { db } from '@/lib/db';
import { Order } from '@/types';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    setOrders(db.getOrders());
  }, []);

  const handleStatusChange = (orderId: string, newStatus: Order['orderStatus']) => {
    db.updateOrderStatus(orderId, newStatus);
    setOrders([...db.getOrders()]);
    setMsg(`Order status updated to "${newStatus}".`);
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif-title text-3xl font-bold text-brand-dark uppercase tracking-wider">
            ORDER FULFILLMENT
          </h1>
          <p className="text-xs text-brand-muted mt-0.5">Track, update logistics statuses, and manage customer receipts.</p>
        </div>
        {msg && <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded">{msg}</span>}
      </div>

      <div className="bg-white rounded-lg border border-brand-border shadow-sm p-6 overflow-x-auto">
        <table className="w-full text-left text-xs text-brand-dark">
          <thead className="bg-brand-cream uppercase text-[10px] font-bold tracking-wider text-brand-muted">
            <tr>
              <th className="p-3">Order Number</th>
              <th className="p-3">Date</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Items Purchased</th>
              <th className="p-3">Total Amount</th>
              <th className="p-3">Payment Method</th>
              <th className="p-3">Fulfillment Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {orders.map((ord) => (
              <tr key={ord.id} className="hover:bg-brand-cream/30">
                <td className="p-3 font-mono font-bold">{ord.orderNumber}</td>
                <td className="p-3 text-brand-muted">{new Date(ord.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  <span className="font-bold block">{ord.customerName}</span>
                  <span className="text-[10px] text-brand-muted">{ord.customerMobile}</span>
                </td>
                <td className="p-3 text-brand-muted">
                  {ord.items.map((i) => `${i.productName} (${i.size}) x${i.quantity}`).join(', ')}
                </td>
                <td className="p-3 font-bold text-sm">NPR {ord.total.toLocaleString()}</td>
                <td className="p-3">
                  <span className="font-mono uppercase font-semibold text-[11px] block">{ord.paymentMethod}</span>
                  <span className="text-[10px] text-emerald-600 font-bold">{ord.paymentStatus}</span>
                </td>
                <td className="p-3">
                  <select
                    value={ord.orderStatus}
                    onChange={(e) => handleStatusChange(ord.id, e.target.value as any)}
                    className="bg-brand-cream border border-brand-border rounded text-xs font-bold text-brand-dark p-2 focus:outline-none"
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
