'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, MapPin, Phone, Leaf, Save, Loader2, Camera, Star, Package, LogOut, Locate,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { farmsAPI, authAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';

export default function FarmerProfilePage() {
  const router = useRouter();
  const { user, clearAuth, updateUser } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    farm_name: '',
    description: '',
    address: '',
    village: '',
    district: '',
    state: 'Maharashtra',
    pincode: '',
    phone: '',
    latitude: 0,
    longitude: 0,
    delivery_radius_km: 30,
  });

  useEffect(() => {
    if (!user) { router.push('/auth'); return; }
    if (user.role !== 'FARMER') { router.push('/discover'); }
  }, [user, router]);

  const { data: farm, isLoading, refetch } = useQuery({
    queryKey: ['my-farm-profile'],
    queryFn: () => farmsAPI.mine().then((r) => r.data).catch(() => null),
    enabled: !!user && user.role === 'FARMER',
  });

  useEffect(() => {
    if (farm) {
      setForm({
        farm_name: farm.farm_name || '',
        description: farm.description || '',
        address: farm.address || '',
        village: farm.village || '',
        district: farm.district || '',
        state: farm.state || 'Maharashtra',
        pincode: farm.pincode || '',
        phone: farm.phone || '',
        latitude: farm.latitude || 0,
        longitude: farm.longitude || 0,
        delivery_radius_km: farm.delivery_radius_km || 30,
      });
    }
  }, [farm]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await farmsAPI.createOrUpdate(form);
      toast.success('Profile saved!');
      refetch();
    } catch {
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    router.push('/auth');
  };

  if (!user || user.role !== 'FARMER') return null;

  return (
    <div className="min-h-screen bg-amber-50 pb-24">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-4 shadow-sm">
        <Link href="/farmer/dashboard" className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </Link>
        <h1 className="text-xl font-black text-green-900 flex-1">Farm Profile</h1>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* User Info Card */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
              <Leaf className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <h2 className="font-black text-green-900 text-lg">{user.name || 'Farmer'}</h2>
              <p className="text-sm text-gray-500">{user.phone}</p>
              <p className="text-xs text-green-600 font-bold mt-0.5">🌱 Farmer Account</p>
            </div>
          </div>
        </div>

        {/* Farm Details Form */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-black text-green-900 mb-4 flex items-center gap-2">
            <Package className="w-4 h-4" /> Farm Details
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Farm Name *</label>
              <input
                value={form.farm_name}
                onChange={(e) => setForm({ ...form, farm_name: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:border-green-400 outline-none"
                placeholder="e.g. Patil Organic Farm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:border-green-400 outline-none resize-none"
                placeholder="Tell buyers about your farm..."
                rows={3}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Address *</label>
              <input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:border-green-400 outline-none"
                placeholder="Full address"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Village</label>
                <input
                  value={form.village}
                  onChange={(e) => setForm({ ...form, village: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:border-green-400 outline-none"
                  placeholder="Village"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">District *</label>
                <input
                  value={form.district}
                  onChange={(e) => setForm({ ...form, district: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:border-green-400 outline-none"
                  placeholder="District"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">State</label>
                <input
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:border-green-400 outline-none"
                  placeholder="State"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Pincode</label>
                <input
                  value={form.pincode}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:border-green-400 outline-none"
                  placeholder="411001"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:border-green-400 outline-none"
                placeholder="Contact number"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Delivery Radius (km)</label>
              <input
                type="number"
                value={form.delivery_radius_km}
                onChange={(e) => setForm({ ...form, delivery_radius_km: Number(e.target.value) })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:border-green-400 outline-none"
                placeholder="30"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || !form.farm_name || !form.district}
            className="w-full mt-5 bg-green-700 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-800 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Profile
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-white border-2 border-red-100 text-red-600 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Log Out
        </button>
      </div>
    </div>
  );
}
