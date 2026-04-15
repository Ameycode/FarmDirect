'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, IndianRupee, TrendingUp, Package, Clock, ShieldCheck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ordersAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import type { Order } from '@/lib/types';

export default function EarningsPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) { router.push('/auth'); return; }
    if (user.role !== 'FARMER') { router.push('/discover'); }
  }, [user, router]);

  const { data: earnings, isLoading: earningsLoading } = useQuery({
    queryKey: ['earnings'],
    queryFn: () => ordersAPI.earnings().then((r) => r.data),
    enabled: !!user && user.role === 'FARMER',
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['farmer-orders', 'DELIVERED'],
    queryFn: () => ordersAPI.farmerOrders('DELIVERED').then((r) => r.data),
    enabled: !!user && user.role === 'FARMER',
  });

  if (!user || user.role !== 'FARMER') return null;

  const totalEarned = earnings?.total_earned || 0;
  
  return (
    <div className="min-h-screen bg-amber-50 pb-24">
      {/* Header */}
      <header className="bg-green-900 px-4 pt-6 pb-20 text-white relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-800 rounded-full blur-3xl opacity-50" />
        <div className="relative z-10 flex items-center gap-4 mb-8">
          <Link href="/farmer/dashboard" className="w-10 h-10 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-xl font-black text-white">Earnings Overview</h1>
        </div>
        
        <div className="relative z-10 text-center">
          <p className="text-green-300 font-semibold mb-2">Total Generated (All Time)</p>
          <div className="flex items-center justify-center gap-2">
            <IndianRupee className="w-8 h-8 text-amber-400" />
            <h2 className="text-5xl font-black">{totalEarned.toFixed(0)}</h2>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm font-medium bg-green-800/50 w-fit mx-auto px-4 py-2 rounded-full border border-green-700/50">
             <ShieldCheck className="w-4 h-4 text-green-300"/> No platform commissions taken
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="max-w-2xl mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100/50 flex flex-col items-center justify-center text-center">
             <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-3">
                <Package className="w-6 h-6" />
             </div>
             <p className="text-3xl font-black text-gray-900">{earnings?.total_orders || 0}</p>
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Orders Delivered</p>
          </div>
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100/50 flex flex-col items-center justify-center text-center">
             <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-3">
                <Clock className="w-6 h-6" />
             </div>
             <p className="text-3xl font-black text-gray-900">{earnings?.pending_orders || 0}</p>
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Orders Pending</p>
          </div>
        </div>

        {/* History */}
        <h2 className="text-lg font-black text-green-900 mb-4 flex items-center gap-2 pl-1">
          <TrendingUp className="w-5 h-5" /> Recent Completed Transactions
        </h2>

        {ordersLoading ? (
           <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-20 animate-pulse border border-gray-100" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
             <IndianRupee className="w-12 h-12 text-gray-200 mx-auto mb-3" />
             <h3 className="font-bold text-gray-400">No earnings yet</h3>
             <p className="text-sm text-gray-400 mt-1">Complete your first delivery to see transactions here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 20).map((order: Order) => (
              <div key={order.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center justify-between hover:border-green-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                    <span className="font-black text-green-700 text-lg">₹</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{order.buyer_name}</p>
                    <p className="text-xs text-gray-400">#{order.id} · {new Date(order.updated_at || order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-green-700">+{order.total}</p>
                  <p className="text-[10px] font-bold text-green-500 uppercase">{order.payment_method}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
