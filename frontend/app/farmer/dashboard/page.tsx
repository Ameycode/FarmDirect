'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, TrendingUp, Star, Plus, ClipboardList, IndianRupee, Clock, CheckCircle, Truck, MessageCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ordersAPI, farmsAPI, negotiationsAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import type { Order } from '@/lib/types';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PREPARING: 'bg-purple-100 text-purple-700',
  OUT_FOR_DELIVERY: 'bg-indigo-100 text-indigo-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-600',
};

const NEXT_STATUS: Record<string, string> = {
  PENDING: 'CONFIRMED',
  CONFIRMED: 'PREPARING',
  PREPARING: 'OUT_FOR_DELIVERY',
  OUT_FOR_DELIVERY: 'DELIVERED',
};

export default function FarmerDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) { router.push('/auth'); return; }
    if (user.role !== 'FARMER') { router.push('/discover'); }
  }, [user, router]);

  const { data: earnings } = useQuery({
    queryKey: ['earnings'],
    queryFn: () => ordersAPI.earnings().then((r) => r.data),
    enabled: !!user,
  });

  const { data: orders = [], refetch } = useQuery({
    queryKey: ['farmer-orders'],
    queryFn: () => ordersAPI.farmerOrders().then((r) => r.data),
    enabled: !!user,
  });

  const { data: farm } = useQuery({
    queryKey: ['my-farm'],
    queryFn: () => farmsAPI.mine().then((r) => r.data).catch(() => null),
    enabled: !!user,
  });

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      refetch();
    } catch { /* silent */ }
  };

  if (!user || user.role !== 'FARMER') return null;

  const pendingCount = orders.filter((o: Order) => o.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-amber-50 pb-24">
      {/* Header */}
      <header className="bg-green-900 px-4 pt-6 pb-8 text-white">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-green-300 text-sm font-semibold">Good morning,</p>
              <h1 className="text-2xl font-black">{user.name || 'Farmer'} 👋</h1>
            </div>
            <Link href="/farmer/products/new" className="bg-amber-400 text-green-900 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Product
            </Link>
          </div>

          {/* Earnings Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <IndianRupee className="w-5 h-5 text-green-300 mb-2" />
              <p className="text-2xl font-black">₹{earnings?.total_earned?.toFixed(0) || '0'}</p>
              <p className="text-xs text-green-300 font-medium mt-1">Total Earned</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <Package className="w-5 h-5 text-green-300 mb-2" />
              <p className="text-2xl font-black">{earnings?.total_orders || 0}</p>
              <p className="text-xs text-green-300 font-medium mt-1">Delivered</p>
            </div>
            <div className="bg-amber-400/20 backdrop-blur rounded-xl p-4 border border-amber-400/30">
              <Clock className="w-5 h-5 text-amber-300 mb-2" />
              <p className="text-2xl font-black text-amber-300">{pendingCount}</p>
              <p className="text-xs text-amber-300 font-medium mt-1">Pending</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 -mt-4">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link href="/farmer/products" className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-3 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-black text-gray-800">My Products</p>
              <p className="text-xs text-gray-500">Manage listings</p>
            </div>
          </Link>
          <Link href="/farmer/negotiations" className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-3 hover:shadow-md transition-shadow relative">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-black text-gray-800">Negotiations</p>
              <p className="text-xs text-gray-500">Chat with buyers</p>
            </div>
          </Link>
          <Link href="/farmer/earnings" className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-3 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-black text-gray-800">Earnings</p>
              <p className="text-xs text-gray-500">View reports</p>
            </div>
          </Link>
          <Link href="/farmer/orders" className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-3 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-black text-gray-800">All Orders</p>
              <p className="text-xs text-gray-500">View all orders</p>
            </div>
          </Link>
        </div>

        {/* Farm Profile Banner */}
        {!farm && (
          <Link href="/farmer/profile" className="block bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 mb-6 text-amber-800">
            <p className="font-bold text-sm">Complete your farm profile to appear in buyer searches!</p>
            <p className="text-xs mt-1 text-amber-600">Add location, description, and cover photo →</p>
          </Link>
        )}

        {/* Recent Orders */}
        <h2 className="text-lg font-black text-green-900 mb-4 flex items-center gap-2">
          <ClipboardList className="w-5 h-5" /> Incoming Orders
        </h2>

        {orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No orders yet. Add products to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: Order) => (
              <div key={order.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-black text-green-900">{order.buyer_name}</h3>
                    <p className="text-xs text-gray-400">{order.buyer_phone} · #{order.id}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1.5 rounded-lg ${STATUS_COLORS[order.status]}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-sm text-gray-600 mb-2">
                  {order.items.map((item, i) => (
                    <span key={item.id}>{item.product_name} ×{item.quantity}{i < order.items.length - 1 ? ', ' : ''}</span>
                  ))}
                </div>

                <div className="text-xs text-gray-500 mb-3">
                  {order.delivery_type === 'DELIVERY' ? `Deliver to: ${order.delivery_address}` : 'Farm Pickup'}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="font-black text-green-800 text-lg">₹{Number(order.total).toFixed(0)}</span>
                  {NEXT_STATUS[order.status] && (
                    <button
                      onClick={() => handleStatusUpdate(order.id, NEXT_STATUS[order.status])}
                      className="bg-green-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 hover:bg-green-800 transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Mark as {NEXT_STATUS[order.status].replace('_', ' ')}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex items-center justify-around py-2 max-w-lg mx-auto">
          {[
            { href: '/farmer/dashboard', icon: TrendingUp, label: 'Home' },
            { href: '/farmer/negotiations', icon: MessageCircle, label: 'Chats' },
            { href: '/farmer/products', icon: Package, label: 'Products' },
            { href: '/farmer/orders', icon: ClipboardList, label: 'Orders' },
            { href: '/farmer/profile', icon: Star, label: 'Profile' },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 px-4 py-2 text-green-700">
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
