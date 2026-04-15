'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, Leaf, ArrowRight } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { cartAPI } from '@/lib/api';
import { useAuthStore, useCartStore } from '@/lib/store';
import toast from 'react-hot-toast';
import type { CartItem } from '@/lib/types';

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { cart, setCart } = useCartStore();

  useEffect(() => {
    if (!user) { router.push('/auth'); return; }
    cartAPI.get().then((r) => setCart(r.data));
  }, [user, router, setCart]);

  const handleRemove = async (itemId: number) => {
    try {
      const { data } = await cartAPI.removeItem(itemId);
      setCart(data);
      toast.success('Item removed');
    } catch { toast.error('Error removing item'); }
  };

  const handleQtyChange = async (itemId: number, qty: number) => {
    if (qty < 1) return handleRemove(itemId);
    try {
      const { data } = await cartAPI.updateItem(itemId, qty);
      setCart(data);
    } catch { toast.error('Error updating quantity'); }
  };

  const handleClear = async () => {
    try {
      await cartAPI.clear();
      setCart({ id: cart?.id || 0, items: [], total: 0 });
      toast.success('Cart cleared');
    } catch { toast.error('Error clearing cart'); }
  };

  const items: CartItem[] = cart?.items || [];
  const total = cart?.total || 0;

  // Group items by farm
  const farms = [...new Set(items.map((i) => i.product.farm_name))];

  return (
    <div className="min-h-screen bg-amber-50">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-4">
        <button onClick={() => router.back()} className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <h1 className="text-xl font-black text-green-900 flex-1">My Cart</h1>
        {items.length > 0 && (
          <button onClick={handleClear} className="text-sm text-red-500 font-semibold">Clear All</button>
        )}
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 pb-32">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-gray-400 mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">Discover fresh produce from local farmers</p>
            <Link href="/discover" className="bg-green-700 text-white px-8 py-3 rounded-2xl font-bold inline-flex items-center gap-2">
              <Leaf className="w-4 h-4" /> Browse Farms
            </Link>
          </div>
        ) : (
          <>
            {/* Items grouped by farm */}
            {farms.map((farmName: string) => {
              const farmItems = items.filter((i) => i.product.farm_name === farmName);
              const farmId = farmItems[0].product.farm_id;
              const farmTotal = farmItems.reduce((sum, i) => sum + i.subtotal, 0);

              return (
                <div key={farmName} className="bg-white rounded-2xl mb-4 overflow-hidden border border-gray-100 shadow-sm">
                  <div className="px-5 py-3 bg-green-50 border-b border-green-100 flex items-center justify-between">
                    <Link href={`/farm/${farmId}`} className="font-bold text-green-800 text-sm hover:underline">
                      {farmName}
                    </Link>
                    <span className="text-sm font-bold text-green-700">₹{farmTotal.toFixed(0)}</span>
                  </div>

                  {farmItems.map((item: CartItem) => (
                    <div key={item.id} className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-0">
                      <div className="relative w-16 h-16 bg-green-50 rounded-xl overflow-hidden shrink-0">
                        {item.product.display_image ? (
                          <Image src={item.product.display_image} alt={item.product.name} fill className="object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Leaf className="w-6 h-6 text-green-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 text-sm truncate">{item.product.name}</h3>
                        <p className="text-xs text-gray-500">₹{item.negotiated_price || item.product.price}/{item.product.unit}</p>
                        <p className="text-sm font-black text-green-700 mt-1">₹{item.subtotal.toFixed(0)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleQtyChange(item.id, item.quantity - 1)} className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors">
                          <Minus className="w-3.5 h-3.5 text-gray-600" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                        <button onClick={() => handleQtyChange(item.id, item.quantity + 1)} className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center hover:bg-green-200 transition-colors">
                          <Plus className="w-3.5 h-3.5 text-green-700" />
                        </button>
                        <button onClick={() => handleRemove(item.id)} className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors ml-1">
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Checkout button per farm */}
                  <div className="p-4 bg-gray-50">
                    <Link
                      href={`/checkout?farm_id=${farmId}`}
                      className="w-full bg-green-700 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-800 transition-colors"
                    >
                      Order from {farmName} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}

            {/* Total */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex justify-between text-lg font-black text-green-900 mb-1">
                <span>Total</span>
                <span>₹{total.toFixed(0)}</span>
              </div>
              <p className="text-xs text-gray-400">Taxes and delivery calculated at checkout</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
