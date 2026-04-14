import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';

const Marketplace = () => {
  const { cart, addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All Harvest');

  useEffect(() => {
    fetch('http://localhost:3000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  const categories = ['All Harvest', 'Vegetables', 'Fruits', 'Dairy', 'Bakery', 'Honey'];
  const filteredProducts = selectedCategory === 'All Harvest' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#fff9ee] font-body text-on-surface">
      <header className="sticky top-0 z-[100] glass-header px-8 py-5 flex items-center justify-between border-b border-outline-variant/5">
        <div className="flex items-center space-x-12">
          <Link to="/" className="text-2xl font-black font-headline text-[#154212] tracking-tighter hover:scale-105 transition-transform">The Homestead</Link>
          <nav className="hidden md:flex items-center space-x-10">
            <Link className="text-[#154212] font-black border-b-2 border-[#154212] pb-1 font-headline text-sm tracking-wide" to="/marketplace">Marketplace</Link>
            <Link className="text-on-surface-variant hover:text-primary transition-all font-headline font-bold text-sm tracking-wide" to="/farmers">Producers</Link>
          </nav>
        </div>
        <div className="flex items-center space-x-6">
          <div className="relative group hidden sm:block">
            <input 
              type="text" 
              placeholder="Search harvest..." 
              className="bg-primary/5 border-none focus:ring-2 focus:ring-primary/20 rounded-2xl pl-12 pr-6 py-3 text-sm w-64 transition-all group-focus-within:w-80 group-focus-within:bg-white group-focus-within:shadow-xl group-focus-within:shadow-primary/5" 
            />
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary">search</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 hover:bg-primary/5 rounded-full transition-all group">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">shopping_cart</span>
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-2 border-[#fff9ee] animate-pulse-soft">
                  {cart.length}
                </span>
              )}
            </Link>
            {localStorage.getItem('user') ? (
              <Link to="/profile" className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-primary fill-1">account_circle</span>
              </Link>
            ) : (
              <Link to="/login" className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-all">account_circle</Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-8 py-12 page-entry">
        {/* Banner */}
        <div className="relative h-80 rounded-[48px] overflow-hidden mb-16 shadow-2xl shadow-primary/10 group">
          <img 
            src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2070&auto=format&fit=crop" 
            alt="Local Market" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[10s]" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#154212]/90 via-[#154212]/40 to-transparent flex flex-col justify-center p-16">
            <span className="bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase mb-4 w-fit">Seasonal Focus</span>
            <h2 className="text-6xl font-black font-headline text-white mb-4 tracking-tighter">Peak Harvest</h2>
            <p className="text-white/80 max-w-md font-medium text-lg italic">"Connecting you to the roots of your food, one season at a time."</p>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-8 py-3 rounded-2xl font-bold text-sm tracking-wide transition-all ${
                selectedCategory === cat 
                  ? 'bg-[#154212] text-white shadow-xl shadow-primary/20 scale-105' 
                  : 'bg-white text-on-surface-variant hover:bg-primary/5 border border-outline-variant/10 shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-[40px] overflow-hidden border border-outline-variant/10 premium-card group">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                   <span className="bg-white/90 backdrop-blur-sm text-[#154212] px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm">
                    {product.category}
                  </span>
                  {product.isOrganic && (
                    <span className="bg-emerald-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm">
                      Organic
                    </span>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                   <button 
                     onClick={() => addToCart(product.id, 1)}
                     className="bg-white text-primary w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-all font-black"
                   >
                     <span className="material-symbols-outlined text-3xl">add_shopping_cart</span>
                   </button>
                </div>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-3">
                   <h3 className="text-2xl font-black font-headline leading-tight pr-4">{product.name}</h3>
                   <p className="text-2xl font-black text-primary font-headline">${product.price.toFixed(2)}</p>
                </div>
                <p className="text-on-surface-variant text-sm mb-6 line-clamp-2 italic leading-relaxed font-medium">"{product.description}"</p>
                <div className="flex items-center justify-between pt-6 border-t border-outline-variant/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-sm fill-1">person</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#154212]">{product.farmerName}</p>
                      <p className="text-[10px] text-on-surface-variant font-bold">{product.farmerDist}</p>
                    </div>
                  </div>
                  <Link 
                    to={`/product/${product.slug}`}
                    className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-sm">arrow_outward</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="max-w-screen-2xl mx-auto px-8 py-20 mt-20 border-t border-outline-variant/5 text-center">
          <h1 className="text-3xl font-black font-headline text-primary mb-6">The Homestead</h1>
          <p className="text-on-surface-variant max-w-lg mx-auto mb-12 leading-relaxed">Dedicated to revitalizing local food systems and restoring the connection between land, farmer, and community.</p>
          <div className="flex justify-center gap-12 text-[10px] font-black uppercase tracking-widest text-outline">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Ethics</a>
          </div>
      </footer>
    </div>
  );
};

export default Marketplace;