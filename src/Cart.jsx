import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, addToCart } = useCart();
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/api/products')
      .then(res => res.json())
      .then(data => {
        const cartProductIds = cart.map(item => item.productId);
        const suggestions = data.filter(p => !cartProductIds.includes(p.id)).slice(0, 4);
        setSuggestedProducts(suggestions);
      })
      .catch(err => console.error(err));
  }, [cart]);

  const subtotal = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const deliveryFee = 5.00;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  const handleCheckout = () => {
    window.location.href = '/checkout';
  };

  return (
    <div className="min-h-screen bg-[#fff9ee] font-body text-on-surface">
      {/* Header */}
      <header className="px-8 py-5 flex justify-between items-center max-w-7xl mx-auto sticky top-0 z-[100] glass-header border-b border-outline-variant/5">
        <div className="flex items-center gap-12">
          <Link to="/" className="text-2xl font-black font-headline text-[#154212] tracking-tighter hover:scale-105 transition-transform">The Homestead</Link>
          <nav className="hidden md:flex gap-10">
            <Link to="/marketplace" className="font-headline font-bold text-sm uppercase tracking-widest text-[#154212] border-b-2 border-primary pb-1">Marketplace</Link>
            <Link to="/farmers" className="font-headline font-bold text-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">Producers</Link>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <button className="relative p-2 hover:bg-primary/5 rounded-full transition-all group">
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors fill-1">shopping_basket</span>
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-2 border-[#fff9ee] animate-pulse-soft">
                {cart.length}
              </span>
            )}
          </button>
          <Link to="/profile" className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
            <span className="material-symbols-outlined text-primary">account_circle</span>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12 page-entry">
        <div className="flex flex-col gap-3 mb-16">
          <h1 className="text-6xl font-black font-headline tracking-tighter text-[#154212]">Your Harvest</h1>
          <p className="text-on-surface-variant font-medium text-lg italic opacity-70">"Curating the finest seasonal selections for your table."</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          {/* Left: Cart Items */}
          <div className="lg:col-span-8 space-y-8">
            {cart.length === 0 ? (
              <div className="bg-white rounded-[48px] p-24 text-center space-y-6 border border-outline-variant/10 shadow-2xl shadow-primary/[0.02]">
                <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-5xl text-primary/30">potted_plant</span>
                </div>
                <p className="text-2xl font-black font-headline text-on-surface-variant">Your basket is currently empty.</p>
                <Link to="/marketplace" className="inline-block bg-[#154212] text-white px-10 py-4 rounded-[20px] font-bold hover:shadow-xl transition-all active:scale-95">Start Harvesting</Link>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="bg-white p-8 rounded-[40px] border border-outline-variant/10 shadow-xl shadow-primary/[0.02] flex flex-col md:flex-row gap-10 group relative overflow-hidden premium-card">
                  <div className="w-full md:w-40 h-40 rounded-[32px] overflow-hidden bg-surface-container-low flex-shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-700">
                    <img src={item.product?.image} alt={item.product?.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="bg-[#60233e] text-white px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#60233e]/20">
                        {item.product?.category === 'Fruits' ? 'LOCAL ORCHARD' : 'RAW & UNFILTERED'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-3xl font-black font-headline mb-1 tracking-tight">{item.product?.name}</h3>
                      <p className="text-on-surface-variant italic font-medium opacity-60">{item.product?.description.split('.')[0]}.</p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-outline-variant/5">
                      <div className="flex items-center gap-6 bg-[#fff9ee] p-2 rounded-2xl border border-outline-variant/5">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-on-surface-variant transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">remove</span>
                        </button>
                        <span className="font-black text-xl min-w-[30px] text-center font-headline">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-on-surface-variant transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">add</span>
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-outline uppercase tracking-widest opacity-50 mb-1">${item.product?.price.toFixed(2)} / {item.product?.unit}</p>
                        <p className="text-3xl font-black font-headline text-primary tracking-tighter">${(item.product?.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center hover:bg-red-50 text-red-400 rounded-full transition-all"
                  >
                    <span className="material-symbols-outlined text-2xl">delete</span>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-4 space-y-6 sticky top-32 h-fit">
            <div className="bg-white rounded-[48px] p-10 shadow-2xl shadow-primary/[0.04] border border-outline-variant/5">
              <h3 className="text-3xl font-black font-headline mb-10 tracking-tight">Summary</h3>
              
              <div className="space-y-5 mb-10">
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant font-bold text-sm uppercase tracking-widest opacity-60">Subtotal</span>
                  <span className="font-black text-lg">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-emerald-600">
                  <span className="font-bold text-sm uppercase tracking-widest opacity-60">Delivery</span>
                  <span className="font-black text-lg">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-on-surface-variant font-bold text-sm uppercase tracking-widest opacity-60">Tax (8%)</span>
                  <span className="font-black text-lg">${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-10 pt-10 border-t border-outline-variant/10">
                <span className="text-2xl font-black font-headline">Total Due</span>
                <div className="text-right">
                   <span className="text-5xl font-black font-headline text-primary tracking-tighter block">${total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full bg-[#154212] text-white py-6 rounded-[28px] font-black text-xl shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale mb-6"
              >
                Proceed to Checkout
              </button>

              <button 
                onClick={() => navigate('/marketplace')}
                className="w-full flex items-center justify-center gap-3 text-on-surface-variant font-black uppercase tracking-[0.2em] text-[10px] hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Continue Harvesting
              </button>
            </div>
          </div>
        </div>

        {/* Suggested Harvests */}
        <div className="space-y-12">
          <div className="flex justify-between items-end border-b border-outline-variant/10 pb-8">
            <div>
              <h2 className="text-4xl font-black font-headline uppercase tracking-tighter text-[#154212]">Seasonal Finds</h2>
              <p className="text-on-surface-variant font-medium text-lg italic opacity-70">Complement your basket with these fresh picks.</p>
            </div>
            <Link to="/marketplace" className="bg-primary/5 text-primary px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary/10 transition-all">View Full Market</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {suggestedProducts.map(product => (
              <div key={product.id} className="bg-white p-8 rounded-[48px] border border-outline-variant/10 premium-card group">
                <div className="aspect-square rounded-[36px] overflow-hidden mb-8 bg-surface-container-low shadow-inner">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                </div>
                <h4 className="text-2xl font-black font-headline mb-2 tracking-tight">{product.name}</h4>
                <p className="text-[11px] text-on-surface-variant italic mb-8 line-clamp-2 leading-relaxed font-medium">"{product.description.split('.')[0]}."</p>
                <div className="flex justify-between items-center">
                  <p className="text-2xl font-black text-primary font-headline">${product.price.toFixed(2)}</p>
                  <button 
                    onClick={() => addToCart(product.id, 1)}
                    className="w-12 h-12 bg-[#ffcb3d] text-primary rounded-2xl flex items-center justify-center shadow-xl shadow-[#ffcb3d]/20 hover:scale-110 active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined font-black">add</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-8 py-20 mt-20 border-t border-outline-variant/5 text-center">
        <h1 className="font-headline font-black text-[#154212] text-3xl tracking-tighter mb-8">The Homestead</h1>
        <div className="flex flex-wrap justify-center gap-12 text-[10px] font-black text-on-surface-variant tracking-[0.2em] uppercase mb-12">
          <a href="#" className="hover:text-primary transition-colors">Sustainability</a>
          <a href="#" className="hover:text-primary transition-colors">Farmers</a>
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
        </div>
        <p className="text-[11px] text-on-surface-variant font-medium opacity-50">© 2024 The Homestead Co. Rooted in integrity.</p>
      </footer>
    </div>
  );
};

export default Cart;
