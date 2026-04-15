'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, MapPin, Home, Loader2, CheckCircle } from 'lucide-react';
import { ordersAPI } from '@/lib/api';
import { useAuthStore, useCartStore } from '@/lib/store';
import toast from 'react-hot-toast';

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const farmId = Number(searchParams.get('farm_id'));
  const { user } = useAuthStore();
  const { cart, setCart } = useCartStore();
  const [deliveryType, setDeliveryType] = useState<'DELIVERY' | 'PICKUP'>('DELIVERY');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const farmItems = cart?.items.filter((i) => i.product.farm_id === farmId) || [];
  const farmName = farmItems[0]?.product.farm_name || 'Farm';
  const total = farmItems.reduce((sum, i) => sum + i.subtotal, 0);

  const handlePlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push('/auth'); return; }
    if (deliveryType === 'DELIVERY' && !address.trim()) {
      toast.error('Please enter your delivery address');
      return;
    }
    setLoading(true);
    try {
      await ordersAPI.place({
        farm_id: farmId,
        delivery_type: deliveryType,
        payment_method: 'COD',
        delivery_address: address,
        notes,
      });
      setSuccess(true);
      setCart({ id: cart?.id || 0, items: cart?.items.filter((i) => i.product.farm_id !== farmId) || [], total: 0 });
    } catch {
      toast.error('Could not place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50 p-4">
        <div className="text-center bg-white rounded-3xl p-10 shadow-xl max-w-sm w-full">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-green-900 mb-2">Order Placed!</h2>
          <p className="text-gray-500 mb-6">Your order from <b>{farmName}</b> has been confirmed. Pay ₹{total.toFixed(0)} on delivery.</p>
          <button onClick={() => router.push('/orders')} className="w-full bg-green-700 text-white py-3 rounded-xl font-bold">
            View My Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-4">
        <button onClick={() => router.back()} className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <h1 className="text-xl font-black text-green-900">Checkout</h1>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-5 mb-4 border border-gray-100 shadow-sm">
          <h2 className="font-black text-green-900 mb-3">Order Summary</h2>
          {farmItems.map((item) => (
            <div key={item.id} className="flex justify-between text-sm py-2 border-b border-gray-50 last:border-0">
              <span className="text-gray-700">{item.product.name} × {item.quantity} {item.product.unit}</span>
              <span className="font-bold text-green-800">₹{item.subtotal.toFixed(0)}</span>
            </div>
          ))}
          <div className="flex justify-between font-black text-base mt-3 pt-3 border-t border-gray-100">
            <span>Total (COD)</span>
            <span className="text-green-700">₹{total.toFixed(0)}</span>
          </div>
        </div>

        {/* Delivery Options */}
        <form onSubmit={handlePlace} className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h2 className="font-black text-green-900 mb-4">Delivery Method</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { type: 'DELIVERY' as const, icon: Home, label: 'Home Delivery', desc: 'Farmer delivers to you' },
                { type: 'PICKUP' as const, icon: MapPin, label: 'Farm Pickup', desc: 'Pick up from farm' },
              ].map((opt) => (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => setDeliveryType(opt.type)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    deliveryType === opt.type ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <opt.icon className={`w-5 h-5 mb-2 ${deliveryType === opt.type ? 'text-green-600' : 'text-gray-400'}`} />
                  <p className="font-bold text-sm text-gray-800">{opt.label}</p>
                  <p className="text-xs text-gray-500">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {deliveryType === 'DELIVERY' && (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h2 className="font-black text-green-900 mb-3">Delivery Address</h2>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your full delivery address..."
                rows={3}
                className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-green-500 transition-colors resize-none"
                required
              />
            </div>
          )}

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h2 className="font-black text-green-900 mb-3">Notes for Farmer <span className="text-gray-400 font-normal text-sm">(optional)</span></h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requests or instructions..."
              rows={2}
              className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-green-500 transition-colors resize-none"
            />
          </div>

          {/* Payment Info */}
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-200 rounded-lg flex items-center justify-center text-amber-700 font-black text-sm shrink-0">₹</div>
            <div>
              <p className="font-bold text-amber-900 text-sm">Cash on Delivery</p>
              <p className="text-amber-700 text-xs">Pay ₹{total.toFixed(0)} when you receive your order</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-green-800 transition-colors disabled:opacity-60 shadow-lg shadow-green-200"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `Place Order · ₹${total.toFixed(0)}`}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return <Suspense><CheckoutForm /></Suspense>;
}
