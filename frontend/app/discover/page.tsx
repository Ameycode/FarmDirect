'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Search, SlidersHorizontal, Star, ShoppingBag, Leaf, User, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { farmsAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import type { FarmProfile } from '@/lib/types';

const FarmMap = dynamic(() => import('@/components/FarmMap'), { ssr: false });

const CATEGORIES = ['All', 'Vegetables', 'Fruits', 'Grains', 'Dairy', 'Herbs'];

export default function DiscoverPage() {
  const { user } = useAuthStore();
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = useState(50);
  const [view, setView] = useState<'list' | 'map'>('list');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocation({ lat: 18.5204, lng: 73.8567 }) // Default: Pune
    );
  }, []);

  const { data: farms = [], isLoading } = useQuery({
    queryKey: ['farms', location, radius, search],
    queryFn: () =>
      farmsAPI.list({ lat: location?.lat, lng: location?.lng, radius, search }).then((r) => r.data.results ?? r.data),
    enabled: true,
  });

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-green-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-green-900 hidden sm:block">FarmDirect</span>
          </Link>

          {/* Search bar */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search farms, produce..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2.5 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4 text-gray-600" />
            </button>
            <Link href="/cart" className="p-2.5 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
              <ShoppingBag className="w-4 h-4 text-gray-600" />
            </Link>
            {user ? (
              <Link
                href={user.role === 'FARMER' ? '/farmer/dashboard' : '/profile'}
                className="w-9 h-9 bg-green-700 rounded-xl flex items-center justify-center"
              >
                <User className="w-4 h-4 text-white" />
              </Link>
            ) : (
              <Link href="/auth" className="bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-bold">
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="border-t border-gray-100 bg-white px-4 py-3 flex flex-wrap items-center gap-3">
            <span className="text-sm font-bold text-gray-600">Radius:</span>
            {[10, 25, 50, 100].map((r) => (
              <button
                key={r}
                onClick={() => setRadius(r)}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${
                  radius === r ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {r} km
              </button>
            ))}
          </div>
        )}
      </header>

      {/* View Toggle */}
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-green-600" />
          <span className="font-semibold">
            {isLoading ? 'Finding farms...' : `${farms.length} farms within ${radius} km`}
          </span>
        </div>
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          <button
            onClick={() => setView('list')}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${view === 'list' ? 'bg-white shadow text-green-800' : 'text-gray-500'}`}
          >
            List
          </button>
          <button
            onClick={() => setView('map')}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${view === 'map' ? 'bg-white shadow text-green-800' : 'text-gray-500'}`}
          >
            Map
          </button>
        </div>
      </div>

      {/* Map View */}
      {view === 'map' && (
        <div className="max-w-6xl mx-auto px-4 mb-6">
          <div className="h-96 rounded-2xl overflow-hidden border border-green-100 shadow-sm">
            <FarmMap farms={farms} userLocation={location} />
          </div>
        </div>
      )}

      {/* Farm Cards */}
      <main className="max-w-6xl mx-auto px-4 pb-24">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-72 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : farms.length === 0 ? (
          <div className="text-center py-20">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-500 mb-2">No farms found nearby</h3>
            <p className="text-gray-400">Try increasing the search radius</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {farms.map((farm: FarmProfile) => (
              <FarmCard key={farm.id} farm={farm} />
            ))}
          </div>
        )}
      </main>

      {/* Bottom Nav */}
      <BottomNav active="discover" />
    </div>
  );
}

function FarmCard({ farm }: { farm: FarmProfile }) {
  return (
    <Link href={`/farm/${farm.id}`}>
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group cursor-pointer">
        {/* Cover image */}
        <div className="relative h-44 bg-gradient-to-br from-green-100 to-emerald-200">
          {farm.cover_image ? (
            <Image src={farm.cover_image} alt={farm.farm_name} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Leaf className="w-12 h-12 text-green-300" />
            </div>
          )}
          {farm.is_verified && (
            <span className="absolute top-3 right-3 bg-green-600 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider">
              Verified
            </span>
          )}
          {farm.distance_km && (
            <span className="absolute bottom-3 left-3 bg-black/60 text-white text-xs font-bold px-2.5 py-1.5 rounded-xl backdrop-blur-sm">
              {farm.distance_km} km away
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-black text-green-900 text-lg leading-tight group-hover:text-green-700 transition-colors">
              {farm.farm_name}
            </h3>
            <div className="flex items-center gap-1 shrink-0 ml-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-bold text-gray-700">{farm.rating.toFixed(1)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span>{farm.village ? `${farm.village}, ` : ''}{farm.district}</span>
          </div>
          {farm.description && (
            <p className="text-gray-500 text-xs line-clamp-2 mb-3">{farm.description}</p>
          )}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <span className="text-xs text-green-700 font-bold bg-green-50 px-2.5 py-1 rounded-lg">
              {farm.product_count} products
            </span>
            <span className="text-xs text-gray-500 font-medium">
              by {farm.owner_name || 'Farmer'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function BottomNav({ active }: { active: string }) {
  const { user } = useAuthStore();
  const items = [
    { href: '/discover', icon: MapPin, label: 'Discover', key: 'discover' },
    { href: '/cart', icon: ShoppingBag, label: 'Cart', key: 'cart' },
    { href: user?.role === 'FARMER' ? '/farmer/dashboard' : '/orders', icon: Leaf, label: user?.role === 'FARMER' ? 'Dashboard' : 'Orders', key: 'orders' },
    { href: user ? '/profile' : '/auth', icon: User, label: user ? 'Profile' : 'Login', key: 'profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 pb-safe">
      <div className="flex items-center justify-around py-2 max-w-lg mx-auto">
        {items.map((item) => (
          <Link key={item.key} href={item.href} className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${active === item.key ? 'text-green-700' : 'text-gray-400 hover:text-gray-600'}`}>
            <item.icon className={`w-5 h-5 ${active === item.key ? 'fill-green-100' : ''}`} />
            <span className="text-[10px] font-bold">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
