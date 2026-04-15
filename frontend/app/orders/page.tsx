'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ordersAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import type { Order } from '@/lib/types';

const STATUS_CONFIG: Record<string, { icon: React.ComponentType<{className?: string}>, label: string, color: string }> = {
  PENDING:          { icon: Clock,        label: 'Pending',          color: 'text-amber-600 bg-amber-50' },
  CONFIRMED:        { icon: CheckCircle,  label: 'Confirmed',        color: 'text-blue-600 bg-blue-50' },
  PREPARING:        { icon: Package,      label: 'Preparing',        color: 'text-purple-600 bg-purple-50' },
  OUT_FOR_DELIVERY: { icon: Truck,        label: 'Out for Delivery', color: 'text-indigo-600 bg-indigo-50' },
  DELIVERED:        { icon: CheckCircle,  label: 'Delivered',        color: 'text-green-600 bg-green-50' },
  CANCELLED:        { icon: XCircle,      label: 'Cancelled',        color: 'text-red-500 bg-red-50' },
};

export default function OrdersPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => { if (!user) router.push('/auth'); }, [user, router]);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersAPI.list().then((r) => r.data),
    enabled: !!user,
  });

  return (
    <div className="min-h-screen bg-amber-50">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-4">
        <button onClick={() => router.back()} className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <h1 className="text-xl font-black text-green-900">My Orders</h1>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-32 animate-pulse" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-black text-gray-400 mb-2">No orders yet</h2>
            <p className="text-gray-400 mb-6">Your orders will appear here</p>
            <button onClick={() => router.push('/discover')} className="bg-green-700 text-white px-8 py-3 rounded-2xl font-bold">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: Order) => {
              const s = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
              return (
                <div key={order.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-black text-green-900">{order.farm_name}</h3>
                      <p className="text-xs text-gray-400">#{order.id} · {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg ${s.color}`}>
                      <s.icon className="w-3.5 h-3.5" /> {s.label}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    {order.items.map((item, i) => (
                      <span key={item.id}>{item.product_name} ×{item.quantity}{i < order.items.length - 1 ? ', ' : ''}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500 font-medium">{order.delivery_type === 'DELIVERY' ? 'Home Delivery' : 'Farm Pickup'} · {order.payment_method}</span>
                    <span className="font-black text-green-800">₹{Number(order.total).toFixed(0)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
