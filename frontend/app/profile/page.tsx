'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, User, Phone, Globe, LogOut, Save, Loader2, ShoppingBag,
  MapPin, MessageCircle, Package, ChevronRight, Leaf, Star, Edit3,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { authAPI, ordersAPI, negotiationsAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';
import type { Order, Negotiation } from '@/lib/types';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी (Hindi)' },
  { code: 'mr', label: 'मराठी (Marathi)' },
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, clearAuth, updateUser } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    if (!user) { router.push('/auth'); return; }
    // Redirect farmers to their dashboard profile
    if (user.role === 'FARMER') { router.push('/farmer/profile'); return; }
    setName(user.name || '');
    setLanguage(user.language || 'en');
  }, [user, router]);

  const { data: orders = [] } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => ordersAPI.list().then((r) => r.data),
    enabled: !!user && user.role === 'BUYER',
  });

  const { data: negotiations = [] } = useQuery({
    queryKey: ['my-negotiations'],
    queryFn: () => negotiationsAPI.list().then((r) => r.data),
    enabled: !!user && user.role === 'BUYER',
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await authAPI.updateProfile({ name, language });
      updateUser(data);
      setEditing(false);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    router.push('/auth');
  };

  if (!user || user.role === 'FARMER') return null;

  const activeNegotiations = (negotiations as Negotiation[]).filter((n) => n.status === 'ACTIVE').length;
  const totalOrders = (orders as Order[]).length;
  const deliveredOrders = (orders as Order[]).filter((o) => o.status === 'DELIVERED').length;

  return (
    <div className="min-h-screen bg-amber-50 pb-24">
      {/* Header */}
      <header className="bg-gradient-to-br from-green-800 to-emerald-700 px-4 pt-6 pb-10 text-white">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => router.back()} className="w-9 h-9 bg-white/15 backdrop-blur rounded-xl flex items-center justify-center hover:bg-white/25 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="text-xl font-black flex-1">My Profile</h1>
            {!editing && (
              <button onClick={() => setEditing(true)} className="bg-white/15 backdrop-blur px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-1.5 hover:bg-white/25 transition-colors">
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
            )}
          </div>

          {/* Avatar & Name */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center border-2 border-white/30">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black">{user.name || 'Buyer'}</h2>
              <div className="flex items-center gap-2 text-green-200 text-sm mt-0.5">
                <Phone className="w-3.5 h-3.5" />
                <span>{user.phone}</span>
              </div>
              <span className="inline-block mt-1 text-[10px] font-black bg-green-500/30 text-green-100 px-2 py-0.5 rounded-lg uppercase tracking-wider">
                🛒 Buyer
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 -mt-5 space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
            <Package className="w-5 h-5 text-green-600 mx-auto mb-1.5" />
            <p className="text-xl font-black text-green-900">{totalOrders}</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase">Orders</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
            <Star className="w-5 h-5 text-amber-500 mx-auto mb-1.5" />
            <p className="text-xl font-black text-green-900">{deliveredOrders}</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase">Delivered</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
            <MessageCircle className="w-5 h-5 text-purple-500 mx-auto mb-1.5" />
            <p className="text-xl font-black text-green-900">{activeNegotiations}</p>
            <p className="text-[10px] text-gray-400 font-bold uppercase">Chats</p>
          </div>
        </div>

        {/* Edit Form */}
        {editing && (
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-black text-green-900 mb-4 flex items-center gap-2">
              <Edit3 className="w-4 h-4" /> Edit Profile
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:border-green-400 outline-none"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 focus:border-green-400 outline-none"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>{l.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-green-700 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-800 transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          <Link href="/orders" className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-800 text-sm">My Orders</p>
              <p className="text-xs text-gray-500">Track and manage your orders</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </Link>

          <Link href="/cart" className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-800 text-sm">My Cart</p>
              <p className="text-xs text-gray-500">View items in your cart</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </Link>

          <Link href="/discover" className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-800 text-sm">Discover Farms</p>
              <p className="text-xs text-gray-500">Find fresh produce near you</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </Link>
        </div>

        {/* Active Negotiations */}
        {activeNegotiations > 0 && (
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-5 border border-purple-100">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h3 className="font-black text-purple-900 text-sm">Active Negotiations</h3>
                <p className="text-xs text-purple-500">You have {activeNegotiations} ongoing chats</p>
              </div>
            </div>
          </div>
        )}

        {/* Account Info */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-black text-green-900 mb-3 text-sm">Account Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500 flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> Phone</span>
              <span className="font-bold text-gray-800">{user.phone}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500 flex items-center gap-2"><User className="w-3.5 h-3.5" /> Role</span>
              <span className="font-bold text-gray-800">{user.role}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500 flex items-center gap-2"><Globe className="w-3.5 h-3.5" /> Language</span>
              <span className="font-bold text-gray-800">{LANGUAGES.find(l => l.code === user.language)?.label || 'English'}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-500 flex items-center gap-2"><Leaf className="w-3.5 h-3.5" /> Member Since</span>
              <span className="font-bold text-gray-800">{new Date(user.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
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
