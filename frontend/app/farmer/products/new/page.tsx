'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { productsAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';

const CATEGORIES = ['vegetables', 'fruits', 'grains', 'dairy', 'herbs', 'other'];
const UNITS = ['kg', 'g', 'litre', 'dozen', 'piece', 'bunch', 'bag'];

export default function NewProductPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', category: 'vegetables', price: '',
    is_negotiable: true, min_price: '', quantity: '', unit: 'kg',
    harvest_date: '', is_organic: false, image_url: '',
  });

  const set = (field: string, value: unknown) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await productsAPI.create({
        ...form,
        price: parseFloat(form.price),
        quantity: parseFloat(form.quantity),
        min_price: form.min_price ? parseFloat(form.min_price) : null,
        harvest_date: form.harvest_date || null,
      });
      toast.success('Product listed successfully!');
      router.push('/farmer/products');
    } catch {
      toast.error('Failed to create product. Check all fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-4">
        <button onClick={() => router.back()} className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <h1 className="text-xl font-black text-green-900">Add New Product</h1>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
            <h2 className="font-black text-green-900">Product Details</h2>
            <input
              type="text"
              placeholder="Product name (e.g., Fresh Tomatoes)"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-green-500 transition-colors"
              required
            />
            <textarea
              placeholder="Describe your product (variety, growing method, freshness...)"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={3}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-green-500 transition-colors resize-none"
            />
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => set('category', cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${form.category === cat ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="url"
              placeholder="Image URL (Cloudinary / Unsplash)"
              value={form.image_url}
              onChange={(e) => set('image_url', e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
            <h2 className="font-black text-green-900">Pricing</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Base Price (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 40"
                  value={form.price}
                  onChange={(e) => set('price', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-green-500 transition-colors"
                  required min="0"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Minimum Price (₹)</label>
                <input
                  type="number"
                  placeholder="Optional"
                  value={form.min_price}
                  onChange={(e) => set('min_price', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-green-500 transition-colors"
                  min="0"
                  disabled={!form.is_negotiable}
                />
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => set('is_negotiable', !form.is_negotiable)}
                className={`w-11 h-6 rounded-full transition-colors ${form.is_negotiable ? 'bg-green-600' : 'bg-gray-200'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mt-0.5 ${form.is_negotiable ? 'translate-x-5.5 ml-0.5' : 'ml-0.5'}`} />
              </div>
              <span className="text-sm font-bold text-gray-700">Price is negotiable</span>
            </label>
          </div>

          {/* Quantity & Availability */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
            <h2 className="font-black text-green-900">Stock & Availability</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Quantity</label>
                <input
                  type="number"
                  placeholder="e.g. 100"
                  value={form.quantity}
                  onChange={(e) => set('quantity', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-green-500 transition-colors"
                  required min="0"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Unit</label>
                <select
                  value={form.unit}
                  onChange={(e) => set('unit', e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-green-500 transition-colors bg-white"
                >
                  {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Harvest Date</label>
              <input
                type="date"
                value={form.harvest_date}
                onChange={(e) => set('harvest_date', e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => set('is_organic', !form.is_organic)}
                className={`w-11 h-6 rounded-full transition-colors ${form.is_organic ? 'bg-green-600' : 'bg-gray-200'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mt-0.5 ${form.is_organic ? 'translate-x-5.5 ml-0.5' : 'ml-0.5'}`} />
              </div>
              <span className="text-sm font-bold text-gray-700">Certified Organic</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-green-800 transition-colors disabled:opacity-60 shadow-lg"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle className="w-5 h-5" /> List Product</>}
          </button>
        </form>
      </div>
    </div>
  );
}
