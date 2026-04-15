'use client';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin, Star, Phone, Package, Leaf, ShoppingCart, Loader2, MessageCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { farmsAPI, productsAPI, cartAPI } from '@/lib/api';
import { useAuthStore, useCartStore } from '@/lib/store';
import toast from 'react-hot-toast';
import type { Product } from '@/lib/types';

const CATEGORY_COLORS: Record<string, string> = {
  vegetables: 'bg-green-100 text-green-700',
  fruits: 'bg-orange-100 text-orange-700',
  grains: 'bg-yellow-100 text-yellow-700',
  dairy: 'bg-blue-100 text-blue-700',
  herbs: 'bg-purple-100 text-purple-700',
  other: 'bg-gray-100 text-gray-600',
};

export default function FarmPage() {
  const params = useParams();
  const farmId = Number(params.id);
  const { user } = useAuthStore();
  const { setCart } = useCartStore();
  const router = useRouter();

  const { data: farm, isLoading: farmLoading } = useQuery({
    queryKey: ['farm', farmId],
    queryFn: () => farmsAPI.get(farmId).then((r) => r.data),
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products', farmId],
    queryFn: () => productsAPI.list({ farm_id: farmId }).then((r) => r.data.results ?? r.data),
  });

  const handleAddToCart = async (product: Product) => {
    if (!user) { router.push('/auth'); return; }
    try {
      const { data } = await cartAPI.add(product.id, 1);
      setCart(data);
      toast.success(`${product.name} added to cart!`);
    } catch {
      toast.error('Could not add to cart');
    }
  };

  if (farmLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!farm) return <div className="p-8 text-center text-gray-500">Farm not found.</div>;

  return (
    <div className="min-h-screen bg-amber-50 pb-24">
      {/* Cover Image */}
      <div className="relative h-56 sm:h-72 bg-gradient-to-br from-green-800 to-emerald-600">
        {farm.cover_image && (
          <Image src={farm.cover_image} alt={farm.farm_name} fill className="object-cover opacity-60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Cart button */}
        <Link href="/cart" className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-white">
          <ShoppingCart className="w-5 h-5" />
        </Link>

        {/* Farm info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-black mb-1">{farm.farm_name}</h1>
              <div className="flex items-center gap-3 text-sm text-white/80">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{farm.district}</span>
                <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />{farm.rating.toFixed(1)} ({farm.total_reviews})</span>
              </div>
            </div>
            {farm.is_verified && (
              <span className="bg-green-500 text-white text-xs font-black px-2 py-1 rounded-lg">Verified</span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-5">
        {/* Farm Info Card */}
        <div className="bg-white rounded-2xl p-5 mb-6 border border-gray-100 shadow-sm">
          {farm.description && <p className="text-gray-600 text-sm mb-4 leading-relaxed">{farm.description}</p>}
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Leaf className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Farmer</p>
                <p className="font-bold text-gray-800">{farm.owner_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Phone className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Contact</p>
                <p className="font-bold text-gray-800">{farm.phone || farm.owner_phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Delivers within</p>
                <p className="font-bold text-gray-800">{farm.delivery_radius_km} km</p>
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        <h2 className="text-xl font-black text-green-900 mb-4">Fresh Produce</h2>
        {productsLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-xl h-48 animate-pulse" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No products listed yet.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart: (p: Product) => void }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-32 bg-gradient-to-br from-green-50 to-emerald-100">
        {product.display_image ? (
          <Image src={product.display_image} alt={product.name} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Leaf className="w-8 h-8 text-green-300" />
          </div>
        )}
        {product.is_organic && (
          <span className="absolute top-2 left-2 bg-green-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
            ORGANIC
          </span>
        )}
        <span className={`absolute top-2 right-2 text-[9px] font-black px-1.5 py-0.5 rounded ${CATEGORY_COLORS[product.category] || 'bg-gray-100 text-gray-600'}`}>
          {product.category.toUpperCase()}
        </span>
      </div>
      <div className="p-3">
        <h3 className="font-bold text-green-900 text-sm mb-1 line-clamp-1">{product.name}</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-black text-green-700">₹{product.price}<span className="text-xs font-semibold text-gray-400">/{product.unit}</span></span>
          {product.is_negotiable && (
            <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded">Negotiable</span>
          )}
        </div>
        <p className="text-[10px] text-gray-400 mb-3">{product.quantity} {product.unit} available</p>
        <div className="flex gap-1.5">
          <button
            onClick={() => onAddToCart(product)}
            className={`${product.is_negotiable ? 'flex-1' : 'w-full'} bg-green-700 text-white py-2 rounded-xl text-xs font-bold hover:bg-green-800 transition-colors flex items-center justify-center gap-1`}
          >
            <ShoppingCart className="w-3.5 h-3.5" /> Add
          </button>
          {product.is_negotiable && (
            <Link
              href={`/negotiate/${product.id}`}
              className="flex-1 bg-amber-50 text-amber-700 py-2 rounded-xl text-xs font-bold hover:bg-amber-100 transition-colors flex items-center justify-center gap-1 border border-amber-200"
            >
              <MessageCircle className="w-3.5 h-3.5" /> Negotiate
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

