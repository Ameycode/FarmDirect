import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';

const Farmers = () => {
  const { addToCart, cart } = useCart();
  const [farmerProducts, setFarmerProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/products')
      .then(res => res.json())
      .then(data => {
        // Filter products for Willow Creek Farm (mocking farmer name match)
        setFarmerProducts(data.slice(0, 4));
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-[#fff9ee] font-body text-on-surface">
      {/* Header */}
      <header className="px-8 py-5 flex justify-between items-center max-w-7xl mx-auto sticky top-0 z-[100] glass-header">
        <div className="flex items-center gap-12">
          <Link to="/" className="text-2xl font-black font-headline text-[#154212] tracking-tighter">The Homestead</Link>
          <nav className="hidden md:flex gap-10">
            <Link to="/marketplace" className="font-headline font-bold text-sm uppercase tracking-widest text-on-surface-variant hover:text-primary">Marketplace</Link>
            <a href="#" className="font-headline font-bold text-sm uppercase tracking-widest text-[#154212] border-b-2 border-primary pb-1">Farmers</a>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/cart" className="relative p-2 hover:bg-primary/5 rounded-full transition-all group">
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">shopping_basket</span>
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-2 border-[#fff9ee] animate-pulse-soft">
                {cart.length}
              </span>
            )}
          </Link>
          <Link to="/profile" className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
            <span className="material-symbols-outlined text-primary fill-1">account_circle</span>
          </Link>
        </div>
      </header>

      <main className="page-entry">
        {/* Dynamic Hero Section */}
        <section className="relative h-[80vh] min-h-[600px] overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop" 
            alt="Farm Hero" 
            className="absolute inset-0 w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          <div className="absolute inset-x-0 bottom-0 max-w-7xl mx-auto px-8 pb-20">
            <div className="bg-[#ffcb3d] text-[#154212] px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase mb-4 w-fit flex items-center gap-2">
              <span className="material-symbols-outlined text-sm fill-1">verified</span>
              Great 100+
            </div>
            <h1 className="text-7xl md:text-9xl font-black font-headline text-white mb-4 tracking-tighter">Willow Creek Farm</h1>
            <div className="flex items-center gap-2 text-white/90 font-medium">
              <span className="material-symbols-outlined text-xl">location_on</span>
              Hudson Valley, New York
            </div>
          </div>
        </section>

        {/* Badges Ribbon */}
        <section className="bg-white py-12 border-b border-outline-variant/10">
          <div className="max-w-7xl mx-auto px-8 flex flex-wrap justify-center gap-12 sm:gap-24">
            {[
              { icon: 'eco', label: 'Organic Certified' },
              { icon: 'energy_savings_leaf', label: 'Pesticide-Free' },
              { icon: 'vitals', label: 'Non-GMO' }
            ].map(badge => (
              <div key={badge.label} className="flex items-center gap-3 group">
                <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <span className="material-symbols-outlined text-primary fill-1">{badge.icon}</span>
                </div>
                <span className="font-black text-[10px] uppercase tracking-widest text-on-surface-variant font-headline">{badge.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="max-w-7xl mx-auto px-8 py-24 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <h2 className="text-5xl font-black font-headline tracking-tighter leading-tight text-primary">
              Our Roots Run <br/>Deeper Than Most.
            </h2>
            <div className="space-y-6 text-on-surface-variant leading-relaxed font-medium opacity-80">
              <p>At Willow Creek, we don't just grow food; we steward the land. For three generations, our family has worked these 400 acres with a simple philosophy: if you take care of the soil, the soil will take care of you.</p>
              <p>We practice regenerative agriculture, focusing on carbon sequestration, biodiversity, and mineral-rich harvests. Every seed is honored, every drop of water is cherished, and every animal is raised with the dignity they deserve.</p>
            </div>
            
            <div className="bg-[#f2efe4] p-10 rounded-[40px] border border-primary/5">
              <p className="text-xl font-serif italic text-primary leading-relaxed mb-6 italic font-medium">
                "Agriculture is not just an industry; it's a conversation with the earth. We've learned to listen more than we talk."
              </p>
              <p className="font-black uppercase tracking-widest text-[11px] text-[#154212]">
                — Elias Thorne, Head Farmer
              </p>
            </div>
          </div>
          
          <div className="relative group">
            <div className="aspect-[4/5] rounded-[64px] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1591946614421-1d933385750d?q=80&w=1000" 
                alt="Farmer hands" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[32px] shadow-2xl max-w-xs border border-primary/5">
               <h4 className="font-black text-xl mb-2 text-primary tracking-tight">The Hands That Grow</h4>
               <p className="text-xs text-on-surface-variant leading-relaxed">Every harvest is handled with the same care that went into the sowing.</p>
            </div>
          </div>
        </section>

        {/* Fresh Today Section */}
        <section className="bg-[#f9f3e8] py-24">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-5xl font-black font-headline tracking-tighter text-[#154212] mb-3">What's Fresh Today</h2>
                <p className="text-on-surface-variant font-medium text-lg italic opacity-70">Picked at peak ripeness, delivered from our fields to your table.</p>
              </div>
              <Link to="/marketplace" className="text-primary font-black uppercase tracking-widest text-xs hover:underline flex items-center gap-2">
                Visit Marketplace <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {farmerProducts.map(product => (
                <div key={product.id} className="bg-white rounded-[40px] overflow-hidden border border-outline-variant/5 shadow-xl shadow-primary/[0.03] premium-card group">
                  <div className="relative aspect-square overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                       <span className="bg-primary/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                        {product.isOrganic ? 'ORGANIC' : 'LIMITED'}
                      </span>
                    </div>
                  </div>
                  <div className="p-8">
                    <h4 className="text-2xl font-black font-headline mb-1">{product.name}</h4>
                    <p className="text-[11px] text-on-surface-variant italic mb-6 opacity-60">"Extra crunchy and sweet."</p>
                    <div className="flex justify-between items-center pt-4 border-t border-outline-variant/5">
                       <p className="text-xl font-black text-primary font-headline">${product.price.toFixed(2)}</p>
                       <button 
                         onClick={() => addToCart(product.id, 1)}
                         className="bg-[#ffcb3d] text-[#154212] px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:brightness-105 active:scale-95 transition-all"
                       >
                         Add to Cart
                       </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cycles Section */}
        <section className="max-w-7xl mx-auto px-8 py-32 text-center">
           <h2 className="text-5xl font-black font-headline tracking-tighter text-[#154212] mb-16">Life in the Cycles</h2>
           <div className="grid grid-cols-1 md:grid-cols-12 grid-rows-2 h-[800px] gap-6">
              <div className="md:col-span-8 relative overflow-hidden rounded-[48px] group">
                <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[10s]" alt="Summer" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                <p className="absolute bottom-10 left-10 text-white font-black text-xl uppercase tracking-widest">Summer Mornings</p>
              </div>
              <div className="md:col-span-4 relative overflow-hidden rounded-[48px] group">
                <img src="https://images.unsplash.com/photo-1471193945509-9ad0617afabf?q=80&w=1000" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[10s]" alt="Harvest" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                <p className="absolute bottom-10 left-10 text-white font-black text-xl uppercase tracking-widest">Harvest Time</p>
              </div>
              <div className="md:col-span-4 relative overflow-hidden rounded-[48px] group">
                <img src="https://images.unsplash.com/photo-1477468572316-36979010099d?q=80&w=1000" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[10s]" alt="Winter" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                <p className="absolute bottom-10 left-10 text-white font-black text-xl uppercase tracking-widest">Winter Rest</p>
              </div>
              <div className="md:col-span-8 relative overflow-hidden rounded-[48px] group">
                <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[10s]" alt="Spring" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                <p className="absolute bottom-10 left-10 text-white font-black text-xl uppercase tracking-widest">Spring Awakening</p>
              </div>
           </div>
        </section>

        {/* Community Praise */}
        <section className="bg-primary text-white py-32 text-center overflow-hidden relative">
           <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
             <span className="material-symbols-outlined text-[30rem] fill-1">potted_plant</span>
           </div>
           
           <div className="max-w-7xl mx-auto px-8 relative z-10">
             <h2 className="text-5xl font-black font-headline tracking-tighter mb-20 uppercase">Community Praise</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { 
                   text: "The flavor of their tomatoes is pure sunshine. You can feel the care that went into the land.",
                   name: "Sarah Jenkins",
                   role: "Local Chef"
                 },
                 { 
                   text: "Knowing exactly where my food comes from matters. Willow Creek is the gold standard for transparency.",
                   name: "David Chen",
                   role: "Weekly Subscriber"
                 },
                 { 
                   text: "The education they provide alongside the food is amazing. My kids actually want to eat their vegetables now!",
                   name: "Elena Rodriguez",
                   role: "Community Member"
                 }
               ].map((review, idx) => (
                 <div key={idx} className="bg-white/10 backdrop-blur-sm p-10 rounded-[48px] text-left space-y-8 border border-white/10">
                   <div className="flex gap-1 text-[#ffcb3d]">
                     {[...Array(5)].map((_, i) => <span key={i} className="material-symbols-outlined text-sm">star</span>)}
                   </div>
                   <p className="text-lg italic font-medium opacity-90 leading-relaxed italic">"{review.text}"</p>
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white/20"></div>
                      <div>
                        <p className="font-black text-sm">{review.name}</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">{review.role}</p>
                      </div>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-8 py-20 border-t border-outline-variant/10 grid grid-cols-1 md:grid-cols-3 gap-20">
        <div>
          <h1 className="font-headline font-black text-primary text-2xl tracking-tighter mb-6">The Homestead</h1>
          <p className="text-on-surface-variant text-sm leading-relaxed max-w-sm">Connecting you directly to the stewards of the land. We believe in food transparency, regenerative health, and community prosperity.</p>
        </div>
        <div className="grid grid-cols-2 gap-8">
           <div className="space-y-4">
             <p className="font-black uppercase tracking-widest text-[10px] text-primary">Quick Links</p>
             <ul className="space-y-2 text-xs font-bold text-on-surface-variant">
               <li><Link to="/marketplace" className="hover:text-primary transition-colors">Marketplace</Link></li>
               <li><Link to="/farmers" className="hover:text-primary transition-colors">Farmers</Link></li>
             </ul>
           </div>
           <div className="space-y-4">
             <p className="font-black uppercase tracking-widest text-[10px] text-primary">Support</p>
             <ul className="space-y-2 text-xs font-bold text-on-surface-variant">
               <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
               <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
               <li><a href="#" className="hover:text-primary transition-colors">Vendor Portal</a></li>
               <li><a href="#" className="hover:text-primary transition-colors">Support</a></li>
             </ul>
           </div>
        </div>
        <div className="flex flex-col items-center md:items-end justify-center">
           <p className="text-[10px] text-on-surface-variant font-medium mb-4">© 2024 The Homestead Co. Rooted in integrity.</p>
           <div className="flex gap-4">
             <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all cursor-pointer">
               <span className="material-symbols-outlined text-sm">mail</span>
             </div>
             <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all cursor-pointer">
               <span className="material-symbols-outlined text-sm">share</span>
             </div>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default Farmers;
