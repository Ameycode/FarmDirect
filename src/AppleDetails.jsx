import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from './CartContext';

export default function AppleDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, cart } = useCart();

  useEffect(() => {
    fetch(`http://localhost:3000/api/products/apples`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-xl text-primary animate-pulse">Picking from the orchard...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center font-bold text-xl text-on-surface">Fruit not found.</div>;
  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col">
      <header className="w-full top-0 sticky bg-[#fff9ee] dark:bg-stone-950 flex justify-between items-center px-6 py-4 w-full z-50 shadow-none">
        <Link to="/" className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#154212] dark:text-[#4ade80]">location_on</span>
          <span className="font-['Plus_Jakarta_Sans'] font-black text-[#154212] dark:text-white text-xl tracking-tighter">The Homestead</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link className="font-['Plus_Jakarta_Sans'] font-bold text-lg tracking-tight text-[#154212] dark:text-[#4ade80]" to="/">Home</Link>
          <a className="font-['Plus_Jakarta_Sans'] font-bold text-lg tracking-tight text-[#42493e] dark:text-stone-400 hover:bg-[#e8e2d7]/50 transition-colors px-3 py-1 rounded-lg" href="#">Orders</a>
          <a className="font-['Plus_Jakarta_Sans'] font-bold text-lg tracking-tight text-[#42493e] dark:text-stone-400 hover:bg-[#e8e2d7]/50 transition-colors px-3 py-1 rounded-lg" href="#">Dashboard</a>
          <Link className="font-['Plus_Jakarta_Sans'] font-bold text-lg tracking-tight text-[#42493e] dark:text-stone-400 hover:bg-[#e8e2d7]/50 transition-colors px-3 py-1 rounded-lg" to="/login">Profile</Link>
        </nav>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-[#e8e2d7]/50 transition-colors">
            <span className="material-symbols-outlined text-[#154212] dark:text-[#4ade80]">search</span>
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 pt-8 pb-32 flex-grow">
        <nav className="flex items-center gap-2 mb-8 text-on-surface-variant text-sm font-medium">
          <Link className="hover:text-primary transition-colors" to="/marketplace">Marketplace</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <a className="hover:text-primary transition-colors" href="#">Organic Vegetables</a>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-on-surface">Heirloom Honeycrisp Apples</span>
        </nav>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-surface-container-low shadow-sm">
              <img alt="Heirloom Honeycrisp Apples" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMRQ_ItuR2-n42eSBVhlINF4ujp5RwRQEaP51GzJ59CF-sT1DzPHDNN1UQXGnkYXVV9oTGoUbFZwVV-SE_B0i0zMs7XuJd8QzZtTOagn29-ULiB6Gu4-O1vJLtLHnY0DUL5rR7Gj-7obA8sh0Hq-qyMenCzfbanLb_9k0MYUn7jbqn2rZEroGeRGZMTIYoA3ktQJmmHEN9e9yYK0VZRQYZ_U2Xve2zO2unoBjGu7n0R0MIjiPBXdIxGmbDg9hdn0c_OUkg5gKaX0TD"/>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="aspect-square rounded-2xl overflow-hidden bg-surface-container-high cursor-pointer ring-2 ring-primary ring-offset-2 ring-offset-surface">
                <img alt="Detail 1" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsbHFZxtBEy9KhTfq02E4ZIrhaAJYi4G0mEPWWTNOwqe6gLbFOjSXhP625bxn9aDFT7ntCAIvmHfPkw84mJxE4qgp8-NJqLlIFzuH5-SK7FZzWXv8jRRm7y9rOgwGm_Kmyv9VX6N8BYnHCJzvPB0kP3UcwAb1ooh_ayWpTTjsdmiIKLdfGR9ObRfQ8J0CW6dr6IhwLNcgJZZgk6YviL14MuRMpKkTEXPEiT7rRGn-Vyk_XIRGMCySWfrO_dRWrsPlFtFSw5xmU5Oua"/>
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden bg-surface-container-high cursor-pointer hover:opacity-80 transition-opacity">
                <img alt="Detail 2" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1FrMwIJHk_-BDk7FktjMK3oz0ahzKD6Us_AUPrwLbmWv9rqEHKFzK1PXBDskf1kLtUHatQAbRMxEFr2617hazEWF5QF03jvOhfDgz5z1zkLFjx6DLTelYBc27cRFli829v6K4S8jp-C1e-gxvyawoLGIy4bXT0Oi2cbk9q0fT0NfF3oZnijJkhiH83w0KPMXQq3C8KSuFxxxA0MP3_D6vCoWRAe9yD97TnLOhsWX2bGhp_28WzAoJmtlwTpaOkbmF_pKvMMV-EF4x"/>
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden bg-surface-container-high cursor-pointer hover:opacity-80 transition-opacity">
                <img alt="Detail 3" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQfQBcfCpdTGax-56aSASdSmi6aSUVIVL2RqXWdHZFzyTIYk8n6XmgIUnpBXCftWFbrb827Y7oc6akZ53ylXTvkmpPFttJOb19_i3TAwN3E460gA7H4ml-afNXq_eM0fMHGXQSvzG3vjVyfAkhW5JYjXY6jW0SD_UnBK8xruhAZCxSJqQ-llNykIEr5M6EGLNhgIUHDMFW1dupu5d0UoSRg4g5dzMw6KEMsI-Biy4RY53i2VNlVTp64_S_y8gASARyFKuR6483Al9-"/>
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden bg-surface-container-high cursor-pointer relative hover:opacity-80 transition-opacity">
                <img alt="Detail 4" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVXmzBFkBiTBgp-WDU5rKS168n_u4xaZTjgd2qf_M64OWBmy57LV2cNXNw9yH_HishIAL-gpcQB9zFX8uK3JTV58Oyjr43_ZJWXzo9jicOOPq11k2QbL8LpJFYadWWfx2df7MN8A3h-f3zM4Nusl12bJwDHpMYtHw8KJ-awd0mZVwO-u036TPz6RST2URa1V7ORzPM5hWA6mnr3l-pSMGxY3RxJexy39Rpe2sOixdbPXZfmTbI8_YfonJmlmbqyOaSeSin7g5VDysK"/>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-tertiary-container text-on-tertiary-container rounded-full text-xs font-bold uppercase tracking-wider">Certified Organic</span>
                <span className="px-3 py-1 bg-surface-container-highest text-on-surface-variant rounded-full text-xs font-bold uppercase tracking-wider">Direct from Farm</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-on-surface leading-tight tracking-tighter">{product.name}</h1>
              <p className="text-lg text-on-surface-variant font-medium leading-relaxed">
                {product.description}
              </p>
            </div>
            <div className="bg-surface-container-low p-8 rounded-3xl space-y-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-primary">${product.price.toFixed(2)}</span>
                <span className="text-on-surface-variant font-medium">/ per {product.unit}</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Harvest Date</span>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl">calendar_today</span>
                    <span className="text-on-surface font-semibold">Oct 12, 2023</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Availability</span>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl">inventory_2</span>
                    <span className="text-on-surface font-semibold">{product.available} {product.unit} left</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4 pt-4">
                <button 
                  onClick={() => addToCart(product.id, 1)}
                  className="w-full bg-secondary-container text-on-secondary-container py-4 px-8 rounded-xl font-bold text-lg flex items-center justify-center gap-3 active:scale-[0.98] transition-all">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_basket</span>
                  Add to Cart
                </button>
                <button className="w-full bg-primary text-on-primary py-4 px-8 rounded-xl font-bold text-lg flex items-center justify-center gap-3 active:scale-[0.98] transition-all">
                  <span className="material-symbols-outlined">call</span>
                  Negotiate via Call
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-surface-container-highest/30 rounded-2xl">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-primary-container">
                <img alt="Farmer" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmIPK--FZbdOPZqqRX__iSpRQXtDDi4dx5oWGQ92elC3aHywMMV_X9mLpxykRHBkN81Ah-poc_gh2qheNlrBke7ksF3NFQG8KXj2nj9hFIS7Vhoca00sK0L4QFGclfhYPgUYfu0d-gCeh3P121ulg5Akf-yEZrL6bsnRlm1-Ty7tOF3DFB8iq3ZHoH58cgFtmL4aVwMztkjnJFHC6CN3ipc56J36zYq4NNHkroJKbicVP8ZENXrVaDULtc1jAcrB5pEjMOmv9at9dm"/>
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface">{product.farmerName}</p>
                <p className="text-xs text-on-surface-variant font-medium">{product.farmerName}'s Orchards • {product.farmerDist} away</p>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-24 space-y-16">
          <div className="h-px bg-outline-variant/20 w-full"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-6 space-y-8">
              <div className="space-y-4">
                <span className="text-primary font-bold tracking-widest uppercase text-sm">The Hands that Grow</span>
                <h2 className="text-4xl font-black text-on-surface tracking-tighter">Generations of Stewardship at Miller Orchards</h2>
                <p className="text-lg text-on-surface-variant leading-relaxed">
                  Since 1924, the Miller family has tended to these hills. We believe that soil health is the foundation of flavor. By utilizing regenerative practices and companion planting, we ensure that every apple doesn't just taste better, but leaves the earth better than we found it.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-surface-container-low p-6 rounded-2xl space-y-2">
                  <span className="material-symbols-outlined text-primary text-3xl">psychiatry</span>
                  <h3 className="font-bold text-on-surface">No Pesticides</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">We use natural neem oils and predatory insects for pest management.</p>
                </div>
                <div className="bg-surface-container-low p-6 rounded-2xl space-y-2">
                  <span className="material-symbols-outlined text-primary text-3xl">water_drop</span>
                  <h3 className="font-bold text-on-surface">Rainwater Fed</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">Our advanced gravity-fed irrigation system uses 100% captured rainwater.</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6">
              <div className="relative">
                <div className="aspect-square rounded-3xl overflow-hidden shadow-xl">
                  <img alt="Orchard" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaHjmJy6NhnZjsPvCV-tV1PPIZ8BiSuxk4loE-q3aIWbuur499A3uFO64edr2sn0S7-fGxsvE-hOHIn8O3S46l6FZfnCOO8J-rWXmn-MNVdAWMCV-wYUN1LeMiPLb6DCbmCxOn-BHC0xBoYC6WNy2J_T3OCEukpnv__mvyUG2gHf6UPv1GGOpkDzI5YTeaCxb7gL0UTxCYAzuOnVY-MFoGlpWsOUpBQokj57zR3TQl6I76cbTACCkPIxgNf_g7LjWgjAERJytqzfPI"/>
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-xs">
                  <div className="bg-primary text-on-primary p-3 rounded-xl">
                    <span className="material-symbols-outlined">verified</span>
                  </div>
                  <p className="text-sm font-bold text-on-surface leading-tight">Soil Association Certified since 1998</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden bg-surface-container-low relative h-[400px]">
            <div className="absolute inset-0 z-0">
              <img alt="Map" className="w-full h-full object-cover opacity-60 grayscale brightness-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAc8vvxG7nvQeT6Pp7SXCmKsZq0bm6VUYS13tSA5xkQyPCevfbgsgeL3SBrrdetXZTW6lBdGAZhdbJmek031dA-tUuqUq7YcXISHryM1WUb3F0DHCvjt0O2uE7L_xUYB7y9hPrms_SPHngF-u_pxOAXJjHtIqxYHgeFMNjGa8t_pqhO67uH7Y5JCBqWVzvhaSGoVNUc94sldXUb28_RtL_-d8GuKXCWKUXsEGFq5bXmjLBPjUQSXlT0K9brvPgFrjZp8tsXEvwFJmyg"/>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative">
                <div className="w-16 h-16 bg-primary/20 rounded-full animate-pulse absolute -inset-0"></div>
                <div className="bg-primary text-on-primary w-12 h-12 rounded-full flex items-center justify-center shadow-2xl relative">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                </div>
              </div>
            </div>
            <div className="absolute bottom-8 left-8 right-8 md:right-auto bg-surface/90 backdrop-blur-md p-6 rounded-2xl shadow-xl max-w-md border border-white/20">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-on-surface">Find us at the gate</h3>
                <p className="text-on-surface-variant text-sm font-medium">
                  742 Miller Ridge Rd, Okanagan Valley. Farm gate sales open Monday through Saturday, 9 AM to 5 PM.
                </p>
                <button className="text-primary font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all pointer-events-auto">
                  Get Directions <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="w-full mt-auto bg-[#f9f3e8] dark:bg-stone-900 border-t border-[#c2c9bb]/20">
        <div className="flex flex-col md:flex-row justify-between items-center px-12 py-10 gap-6 max-w-screen-2xl mx-auto">
          <Link to="/" className="text-lg font-bold text-[#154212] dark:text-emerald-400">The Digital Homestead</Link>
          <div className="flex flex-wrap justify-center gap-8">
            <a className="font-['Inter'] text-xs uppercase tracking-widest text-[#42493e] dark:text-stone-500 hover:text-[#154212] dark:hover:text-emerald-400 opacity-80 hover:opacity-100 transition-opacity hover:underline decoration-2 underline-offset-4" href="#">Privacy Policy</a>
            <a className="font-['Inter'] text-xs uppercase tracking-widest text-[#42493e] dark:text-stone-500 hover:text-[#154212] dark:hover:text-emerald-400 opacity-80 hover:opacity-100 transition-opacity hover:underline decoration-2 underline-offset-4" href="#">Terms of Service</a>
            <a className="font-['Inter'] text-xs uppercase tracking-widest text-[#42493e] dark:text-stone-500 hover:text-[#154212] dark:hover:text-emerald-400 opacity-80 hover:opacity-100 transition-opacity hover:underline decoration-2 underline-offset-4" href="#">Shipping Info</a>
            <a className="font-['Inter'] text-xs uppercase tracking-widest text-[#42493e] dark:text-stone-500 hover:text-[#154212] dark:hover:text-emerald-400 opacity-80 hover:opacity-100 transition-opacity hover:underline decoration-2 underline-offset-4" href="#">Contact Us</a>
          </div>
          <div className="font-['Inter'] text-xs uppercase tracking-widest text-[#42493e] dark:text-stone-500 opacity-80">
            © 2024 The Digital Homestead. Rooted in community.
          </div>
        </div>
      </footer>
    </div>
  );
}
