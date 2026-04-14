import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from './CartContext';

export default function TomatoDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, cart } = useCart();

  useEffect(() => {
    fetch(`http://localhost:3000/api/products/tomatoes`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-xl text-primary animate-pulse">Ripening your data...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center font-bold text-xl text-on-surface">Harvest item not found.</div>;
  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col">
      <nav className="fixed top-0 w-full z-50 bg-[#fff9ee]/80 dark:bg-stone-900/80 backdrop-blur-md shadow-sm dark:shadow-none">
        <div className="flex justify-between items-center px-8 py-4 max-w-screen-2xl mx-auto">
          <Link to="/" className="text-2xl font-bold text-[#154212] dark:text-emerald-500 tracking-tight">The Digital Homestead</Link>
          <div className="hidden md:flex items-center gap-8 font-['Plus_Jakarta_Sans'] text-sm tracking-wide">
            <Link className="text-[#154212] dark:text-emerald-400 font-bold border-b-2 border-[#154212] pb-1" to="/marketplace">Marketplace</Link>
            <Link className="text-[#42493e] dark:text-stone-400 font-medium hover:text-[#154212] dark:hover:text-emerald-300 transition-colors" to="/farmers">Producers</Link>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/cart" className="relative material-symbols-outlined text-[#42493e] hover:text-[#154212] transition-colors">
              shopping_basket
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </Link>
            <Link to="/login" className="flex items-center text-[#42493e] hover:text-[#154212] transition-colors">
              <span className="material-symbols-outlined">account_circle</span>
            </Link>
          </div>
        </div>
      </nav>
      <main className="pt-24 max-w-screen-2xl mx-auto px-8 flex-grow">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-12">
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-surface-container-low">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGBDQmKyEgHJZ-P8-gjAmH0L0YzuEIndC-6iSYpHx02xqDpsE_D8r1N7aDF5Ui8T1k2JjRw6umQ_1UrlKxIg3nd8_EvKQftQ5bjoMXME-bc9QlAOoMWUruxKpFAovIP_OjKvq5W8oByo539Jxi75w-XTkunc8LQSIRIQd3GGR8Cnhs0TidipOvs9Uz6y7-_26Q6jfDwvN6PMLu1WiH4eDZlsaHsmeZvSOAEA7Both745Qpf_dvZH5g_VytML7tQnAzJj12zsPnxb_n"/>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <button className="aspect-square rounded-lg overflow-hidden border-2 border-primary">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUyAaFW0ZRC-RcNUuMcRzUL9IqhPiu54KvzIgtpry8h-DIzT5xn2xGw_9pU-Af18wKpQKenIly-XanObkoyHYlXMMlbAgt7IAQIj-25cftB49L7fSEiCQvS_3L8THDWIjCxsuhfNdFU9_d9q3fKhBJuVzIBchQ3uN3e858UK-yH18zF2FKw6V4l6CfKkbhF-qH2N_uX2-TVGxtl0SBznyHnjlDBRMn9WRkQUlHwyqOQAeZgFacVvQDOwHKCLMUwWJKOWnU0CaDgY3N"/>
              </button>
              <button className="aspect-square rounded-lg overflow-hidden">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3TL3akj_T5GoX5RXVAXzIn8neq_6JfChCdz1fNjjP2JZqxwz4Ay7Z1HWVWWQd3jobY9I7j3dFe3h0eugLwX7XmDxTpXfxhIBA6CEDanyO5xbjIlvjc9bQYiTXqPOCURFkBuhZdMj9IxGIvN2cCGyOoBQBmQ41eNlNlSd2bTGVq1H-Ef_fhMn7yXYCMx3-y8U0f9zx7ZE_lTeUYIU81N0I3O1og-oyV2_8srYMZXXOS3AteqvLisTMhgHYFMyc55kJ2DP_sW48_-No"/>
              </button>
              <button className="aspect-square rounded-lg overflow-hidden">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRkK-E1O2M_WriP1Pd0F7SdBDbXyOVdqadvGG7gxIxcZt99D08qPepwexxOhS4qbBnitci_ELw0ytVJU6yH3bq9x37jd75HBwFDeKYlzRb_s9wpSYH6tbAhDvf9yI3o6wjyGpHtIGX3Au0_WkwwVjssza5JSAMAYWeqIGfRgfxywAnmQicRbHUlhYHYjMtRWHeVZREQWak_0g03QJcNy8Y_doFRrf405vW9KLCx3eOkw5yLhpYkSlnTNccYwTOGSDs53p9px8-zLQK"/>
              </button>
              <button className="aspect-square rounded-lg overflow-hidden">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6v33YmPKJ7-dp-MOgwaRfuAhdVs0tCg7Hg0m6oS7skFibfFKLNdW_US6efXtJAV-PLqkGOlRlz3kIQjXfYcz0eB2EI4DT89u2sk9aJMaeShAJXmBgIS_aAmLEtBh4A3ZKdLE5rOmx162AiQuvo1Sn_-s6xcwxFwGBFrS7Tmqwp0YnI8NVbp2y8-E6M62OpIgKlxeW4vjm128k4fw1zd5WBQGf6ISoABQWKAGRwCS47GZDCDtLlEBu_iSFxTYKEZHnICmNxfkF8g8w"/>
              </button>
            </div>
          </div>
          <div className="lg:col-span-5 flex flex-col justify-center space-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-tertiary-container text-on-tertiary-container text-xs font-bold rounded-full uppercase tracking-widest">Organic Certified</span>
                <span className="px-3 py-1 bg-surface-container-highest text-on-surface-variant text-xs font-medium rounded-full uppercase tracking-widest">Local Harvest</span>
              </div>
              <h1 className="text-5xl font-black text-on-surface leading-tight tracking-tight">{product.name}</h1>
              <p className="text-3xl font-medium text-primary">${product.price.toFixed(2)}/{product.unit}</p>
            </div>
            <div className="p-6 bg-surface-container-low rounded-xl space-y-6 shadow-[0_12px_40px_rgba(29,27,21,0.06)]">
              <div className="flex flex-col gap-4">
                <label className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Select Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-surface-container-highest rounded-full px-4 py-2 border-none">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center text-primary hover:bg-surface-dim rounded-full transition-colors">
                      <span className="material-symbols-outlined">remove</span>
                    </button>
                    <span className="mx-6 font-bold text-lg min-w-[1ch] text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-primary hover:bg-surface-dim rounded-full transition-colors">
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>
                  <span className="text-on-surface-variant text-sm font-medium italic">approx. {(quantity * 0.6).toFixed(1)} lbs</span>
                </div>
              </div>
              <button 
                onClick={() => addToCart(product.id, quantity)}
                className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-primary-container transition-all active:scale-95 duration-150">
                <span className="material-symbols-outlined">shopping_basket</span>
                Add to Cart
              </button>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl border-none bg-surface-container-highest/50">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-dim">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAufohbcMBbpfHHhSx_PvTHsIklfescsDhOxI9vHp3RpnuE0I8r-ti6vVvRux70Sb9mbnOm_fZkAXc-LGTDNrXfsK1OgyGSqUeJ5JrnDtCk-Dy4n547rePBf9oPRo-Oz7L0BW5g3E1FQDWJuLm-rwXQf7w_N81SkpwtYLIaVS6ZVUxkkCXOT68KXtxcXPSgDJ4N1PK_w7tdVS5BEk1PkOQ1nd_hYl1Hy-YX55ZIT0I_gmHKhqgLL66dN0acHsEcokJgPvhB4g0aoKYW"/>
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface">Oak Ridge Orchards</p>
                <p className="text-xs text-on-surface-variant">Harvested 12 miles away in Sonoma Valley</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-3xl font-bold text-on-surface">The Story of the Harvest</h2>
            <div className="prose prose-stone max-w-none text-on-surface-variant leading-relaxed space-y-4">
              <p className="text-lg">{product.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="p-4 bg-surface-container rounded-xl">
                  <span className="material-symbols-outlined text-primary mb-2">water_drop</span>
                  <h4 className="font-bold text-on-surface mb-1">Flavor Profile</h4>
                  <p className="text-sm">A perfect balance of bright acidity, honey-like sweetness, and a deep earthy finish.</p>
                </div>
                <div className="p-4 bg-surface-container rounded-xl">
                  <span className="material-symbols-outlined text-primary mb-2">skillet</span>
                  <h4 className="font-bold text-on-surface mb-1">Best Uses</h4>
                  <p className="text-sm">Best served raw with flaked sea salt, high-quality olive oil, and fresh basil.</p>
                </div>
                <div className="p-4 bg-surface-container rounded-xl">
                  <span className="material-symbols-outlined text-primary mb-2">calendar_month</span>
                  <h4 className="font-bold text-on-surface mb-1">Seasonality</h4>
                  <p className="text-sm">Peak harvest from July through September. Picked daily at dawn for maximum freshness.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-surface-container-low p-8 rounded-[2rem] shadow-[0_12px_40px_rgba(29,27,21,0.06)]">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">nutrition</span>
              Nutritional Information
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-outline-variant/20">
                <span className="text-on-surface-variant">Calories (per 100g)</span>
                <span className="font-bold text-on-surface">18 kcal</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-outline-variant/20">
                <span className="text-on-surface-variant">Vitamin C</span>
                <span className="font-bold text-on-surface">21% DV</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-outline-variant/20">
                <span className="text-on-surface-variant">Fiber</span>
                <span className="font-bold text-on-surface">1.2g</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-outline-variant/20">
                <span className="text-on-surface-variant">Lycopene</span>
                <span className="font-bold text-on-surface">2573 µg</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-outline-variant/20">
                <span className="text-on-surface-variant">Potassium</span>
                <span className="font-bold text-on-surface">237mg</span>
              </div>
              <p className="text-[10px] text-on-surface-variant mt-4 italic leading-tight">Values are approximate based on organic heirloom varieties grown in rich volcanic soil.</p>
            </div>
          </div>
        </section>

        <section className="py-16 rounded-[2.5rem] bg-primary overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnD_V5R74aQeFbvSopz7bM-dVa4KqD_vsG2RiTtnx2xMIC7tFDgHdSdUbeRQkfDnhM9nAOBBo7tkIW0BdBSKb0THDOd9WTLzXjT-_YTPYWp0_2dttH-fNZ0iTZkrpRvJckFUvPdlnV30Ujr9Si1rfUoxvxi6uKL3WSQcNnqgUgszR_4mP-3vJZEuwejLmzXJ3r4TJY4XnrwXjysy0beA1hFb54AVXwm8P0XnGcCY97theAUew0R_DGTCr5qeIK9EtndvfT4QT_3H0g"/>
          </div>
          <div className="relative z-10 px-12 py-4 flex flex-col md:flex-row items-center gap-12 text-on-primary">
            <div className="w-64 h-64 rounded-2xl overflow-hidden shrink-0 shadow-[0_12px_40px_rgba(29,27,21,0.06)] border-4 border-primary-container">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjKPqOHe6dIidMn3a_9D_U2XRtnSqWTph-150orwGxWl3bufCdUNdrZvzUhTEuEbe6c2BTbJaHA2cOdKiDnZUITuwTph0b0BtyQvm44f45UUsXmcptPR7znUY94fnnfJ668CA2oN8xUoO6DUwFsUo9-ADjakl9aRWiXk8s8bGwAZvxcmth4KG7S1KOnPRYGmFcie0_iiXbyUQ7z6h6aJO6yG8vXy1sfdulGT2RHa-duDNfmMJDP8JmzFJdOQGXu_VlXWhNH3712TTY"/>
            </div>
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-on-primary/10 px-4 py-1 rounded-full">
                <span className="material-symbols-outlined text-sm">location_on</span>
                <span className="text-sm font-bold tracking-widest uppercase">12 Miles Away</span>
              </div>
              <h2 className="text-4xl font-black">Meet Farmer {product.farmerName}</h2>
              <p className="text-lg text-primary-fixed leading-relaxed max-w-2xl">"At Oak Ridge, we don't just grow food; we steward the land. Every heirloom tomato is hand-picked at the precise moment of ripeness. We use zero synthetic pesticides, relying on natural beneficial insects and our own compost blends to nourish the soil."</p>
              <div className="flex gap-4">
                <span className="bg-secondary text-on-secondary px-6 py-2 rounded-full font-bold text-sm">{product.farmerName}'s Orchard</span>
                <span className="bg-tertiary-container text-on-tertiary-container px-6 py-2 rounded-full font-bold text-sm">Organic Certified</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="flex justify-between items-end mb-12">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-on-surface">Community Praise</h2>
              <div className="flex items-center gap-2 text-secondary">
                <div className="flex">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
                </div>
                <span className="font-bold text-on-surface">4.8 (124 reviews)</span>
              </div>
            </div>
            <button className="px-8 py-3 bg-surface-container-highest text-on-surface font-bold rounded-xl hover:bg-surface-dim transition-all">Write a Review</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-surface-container-low p-8 rounded-2xl space-y-4 shadow-[0_12px_40px_rgba(29,27,21,0.06)]">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-on-surface">Elena G.</p>
                  <p className="text-xs text-on-surface-variant">Verified Buyer • 2 days ago</p>
                </div>
                <div className="flex text-secondary scale-75 origin-right">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
              </div>
              <p className="text-on-surface-variant italic leading-relaxed">"These are the most incredible tomatoes I've ever tasted outside of Italy. The sweetness is unreal. I used them for a simple Caprese salad and my guests were blown away."</p>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full rounded-t-[2rem] mt-20 bg-[#f9f3e8] dark:bg-stone-950 px-12 py-16">
        <div className="flex flex-col md:flex-row justify-between gap-12 max-w-screen-2xl mx-auto">
          <div className="space-y-6">
            <Link to="/" className="text-xl font-black text-[#1d1b15] dark:text-stone-100">The Digital Homestead</Link>
            <p className="font-['Inter'] text-sm text-[#42493e] dark:text-stone-400 max-w-md opacity-80">© 2024 The Digital Homestead. Rooted in tradition, grown for the future.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <a className="text-[#42493e] dark:text-stone-400 hover:text-[#154212] transition-all" href="#">Sustainability</a>
            <a className="text-[#42493e] dark:text-stone-400 hover:text-[#154212] transition-all" href="#">Privacy</a>
            <Link className="text-[#154212] dark:text-emerald-400 font-bold" to="/marketplace">Shop Market</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
