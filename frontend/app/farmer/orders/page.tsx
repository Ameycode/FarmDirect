'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Package, Truck, XCircle, Search, Clock, ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ordersAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';
import type { Order } from '@/lib/types';

const STATUSES = ['ALL', 'PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

const STATUS_CONFIG: Record<string, { icon: React.ComponentType<{className?: string}>, color: string, label: string }> = {
  PENDING:          { icon: Clock,        color: 'text-amber-600 bg-amber-50',    label: 'Pending' },
  CONFIRMED:        { icon: CheckCircle,  color: 'text-blue-600 bg-blue-50',      label: 'Confirmed' },
  PREPARING:        { icon: Package,      color: 'text-purple-600 bg-purple-50',  label: 'Preparing' },
  OUT_FOR_DELIVERY: { icon: Truck,        color: 'text-indigo-600 bg-indigo-50',  label: 'Out for Delivery' },
  DELIVERED:        { icon: CheckCircle,  color: 'text-green-600 bg-green-50',    label: 'Delivered' },
  CANCELLED:        { icon: XCircle,      color: 'text-red-600 bg-red-50',        label: 'Cancelled' },
};

export default function FarmerOrdersPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [filter, setFilter] = useState('ALL');
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    if (!user) { router.push('/auth'); return; }
    if (user.role !== 'FARMER') { router.push('/discover'); }
  }, [user, router]);

  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ['farmer-orders', filter],
    queryFn: () => ordersAPI.farmerOrders(filter === 'ALL' ? undefined : filter).then((r) => r.data),
    enabled: !!user && user.role === 'FARMER',
  });

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    setUpdating(id);
    try {
      await ordersAPI.updateStatus(id, newStatus);
      toast.success('Status updated');
      refetch();
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  if (!user || user.role !== 'FARMER') return null;

  return (
    <div className="min-h-screen bg-amber-50 pb-24">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-4 flex flex-col gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/farmer/dashboard" className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </Link>
          <h1 className="text-xl font-black text-green-900 flex-1">Incoming Orders</h1>
        </div>
        
        {/* Horizontal scrollable filters */}
        <div className="flex overflow-x-auto pb-2 gap-2 snap-x hide-scrollbar">
          {STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`snap-start shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                filter === status 
                  ? 'bg-green-700 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-40 animate-pulse border border-gray-100" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-black text-gray-400 mb-2">No orders found</h2>
            <p className="text-gray-400 text-sm">Try changing the filter criteria</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: Order) => {
              const conf = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
              return (
                <div key={order.id} className={`bg-white rounded-2xl p-5 border shadow-sm transition-all ${updating === order.id ? 'opacity-50' : 'opacity-100 border-gray-200'}`}>
                  {/* Head */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-black text-gray-900">{order.buyer_name}</h3>
                      <div className="flex gap-2 text-xs font-medium text-gray-500">
                        <span>{order.buyer_phone}</span>
                        <span>·</span>
                        <span>#{order.id}</span>
                      </div>
                    </div>
                    <div className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-xs font-bold ${conf.color}`}>
                      <conf.icon className="w-3.5 h-3.5" />
                      {conf.label}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="bg-gray-50 rounded-xl p-3 mb-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm py-1 border-b border-gray-100 last:border-0 last:pb-0">
                        <span className="font-semibold text-gray-700">{item.quantity} × {item.product_name}</span>
                        <span className="text-gray-600">₹{item.subtotal}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-black text-green-900 mt-2 pt-2 border-t border-gray-200">
                      <span>Total ({order.payment_method})</span>
                      <span>₹{order.total}</span>
                    </div>
                  </div>

                  <div className="text-sm font-medium text-gray-700 mb-4 bg-amber-50 p-3 rounded-xl border border-amber-100">
                    <span className="text-amber-800 font-bold block mb-1">
                      {order.delivery_type === 'DELIVERY' ? '🚚 Deliver to:' : '🏢 Farm Pickup'}
                    </span>
                    {order.delivery_type === 'DELIVERY' && order.delivery_address}
                    {order.notes && <div className="mt-2 text-xs italic text-amber-700">" {order.notes} "</div>}
                  </div>

                  {/* Action Dropdown (Only show if not complete) */}
                  {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                    <div className="flex items-center gap-2">
                       <select 
                         className="flex-1 bg-white border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-bold text-gray-700 focus:border-green-500 focus:ring-0 outline-none"
                         value=""
                         onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                         disabled={updating === order.id}
                       >
                         <option value="" disabled>Update Status...</option>
                         {Object.keys(STATUS_CONFIG).map((s) => (
                           <option key={s} value={s} disabled={s === order.status}>{s.replace('_', ' ')}</option>
                         ))}
                       </select>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
