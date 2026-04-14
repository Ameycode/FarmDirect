import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from './CartContext';

export default function GenericProductDetails() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, cart } = useCart();

  useEffect(() => {
    fetch(`http://localhost:3000/api/products/${slug}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center">Product not found</div>;

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col">
       <header className="w-full top-0 sticky bg-[#fff9ee] dark:bg-stone-950 flex justify-between items-center px-6 py-4 w-full z-50 shadow-none">
        <Link to="/" className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#154212] dark:text-[#4ade80]">location_on</span>
          <span className="font-['Plus_Jakarta_Sans'] font-black text-[#154212] dark:text-white text-xl tracking-tighter">The Homestead</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/cart" className="relative material-symbols-outlined text-[#154212] dark:text-[#4ade80]">
            shopping_basket
            {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
          </Link>
          <Link className="font-['Plus_Jakarta_Sans'] font-bold text-lg tracking-tight text-[#154212] dark:text-[#4ade80]" to="/">Home</Link>
          <Link className="font-['Plus_Jakarta_Sans'] font-bold text-lg tracking-tight text-[#42493e] dark:text-stone-400" to="/marketplace">Marketplace</Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 pt-12 pb-32 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="rounded-3xl overflow-hidden shadow-xl aspect-square">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="space-y-6">
             <div className="flex gap-2">
                {product.isOrganic && <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase">Organic</span>}
                <span className="bg-surface-container-highest text-on-surface-variant px-3 py-1 rounded-full text-xs font-bold uppercase">{product.category}</span>
             </div>
             <h1 className="text-5xl font-black tracking-tighter">{product.name}</h1>
             <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)} / {product.unit}</p>
             <p className="text-lg text-on-surface-variant leading-relaxed">{product.description}</p>
             
             <div className="p-6 bg-surface-container-low rounded-2xl border border-outline-variant/20">
                <p className="text-sm font-bold text-on-surface-variant uppercase mb-4">Farmer Info</p>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-primary-container rounded-full flex items-center justify-center text-white font-bold">
                      {product.farmerName[0]}
                   </div>
                   <div>
                      <p className="font-bold">{product.farmerName}</p>
                      <p className="text-xs text-on-surface-variant">{product.farmerDist} away</p>
                   </div>
                </div>
             </div>

             <button 
               onClick={() => addToCart(product.id, 1)}
               className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold text-lg hover:bg-primary-container active:scale-95 transition-all">
                Add to Cart
             </button>
          </div>
        </div>
      </main>
    </div>
  );
}
