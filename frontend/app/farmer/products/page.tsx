'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Plus, Trash2, Edit2, Package, Leaf } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { productsAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';
import type { Product } from '@/lib/types';

export default function FarmerProductsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) { router.push('/auth'); return; }
    if (user.role !== 'FARMER') { router.push('/discover'); }
  }, [user, router]);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['my-products'],
    queryFn: () => productsAPI.mine().then((r) => r.data),
    enabled: !!user && user.role === 'FARMER',
  });

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await productsAPI.delete(id);
      queryClient.invalidateQueries({ queryKey: ['my-products'] });
      toast.success('Product deleted');
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const handleToggleAvailability = async (product: Product) => {
    try {
      await productsAPI.update(product.id, { is_available: !product.is_available });
      queryClient.invalidateQueries({ queryKey: ['my-products'] });
      toast.success(product.is_available ? 'Marked out of stock' : 'Marked in stock');
    } catch {
      toast.error('Failed to update status');
    }
  };

  if (!user || user.role !== 'FARMER') return null;

  return (
    <div className="min-h-screen bg-amber-50 pb-24">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-4">
        <Link href="/farmer/dashboard" className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </Link>
        <h1 className="text-xl font-black text-green-900 flex-1">My Products</h1>
        <Link href="/farmer/products/new" className="bg-green-700 text-white w-9 h-9 rounded-xl flex items-center justify-center hover:bg-green-800 transition-colors">
          <Plus className="w-5 h-5" />
        </Link>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-48 animate-pulse border border-gray-100" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-black text-gray-400 mb-2">No products yet</h2>
            <p className="text-gray-400 mb-6">List your first harvest to start selling</p>
            <Link href="/farmer/products/new" className="bg-green-700 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 justify-center w-fit mx-auto">
              <Plus className="w-5 h-5" /> Add Product
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((product: Product) => (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col">
                <div className="relative h-36 bg-green-50">
                  {product.display_image ? (
                    <Image src={product.display_image} alt={product.name} fill className={`object-cover ${!product.is_available ? 'grayscale opacity-70' : ''}`} />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Leaf className="w-10 h-10 text-green-200" />
                    </div>
                  )}
                  {!product.is_available && (
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="bg-black/70 text-white px-3 py-1.5 rounded-lg font-black text-sm uppercase translate-y-2">Out of Stock</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="w-8 h-8 bg-red-500/90 backdrop-blur text-white rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 line-clamp-1 flex-1 pr-2 text-lg leading-tight">{product.name}</h3>
                    <span className="font-black text-green-700 shrink-0">₹{product.price}<span className="text-xs text-gray-400 font-semibold">/{product.unit}</span></span>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">{product.quantity} {product.unit} available</p>
                  
                  <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={product.is_available} 
                        onChange={() => handleToggleAvailability(product)}
                        className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                      />
                      <span className="text-xs font-bold text-gray-600">Available</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
