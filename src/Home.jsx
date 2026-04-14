import React from 'react';
import './App.css';

import { Link } from 'react-router-dom';
import { useCart } from './CartContext';

export default function Home() {
  const { cart } = useCart();
  return (
    <div className="bg-surface font-body text-on-surface">
      

<header className="w-full top-0 sticky z-50 glass-header flex justify-between items-center px-8 py-5">
<div className="flex items-center gap-3 group cursor-pointer">
<div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12">
<span className="material-symbols-outlined text-white fill-1" data-icon="location_on">location_on</span>
</div>
<h1 className="font-headline font-black text-[#154212] dark:text-white text-2xl tracking-tighter">The Homestead</h1>
</div>
<nav className="hidden md:flex items-center gap-10">
<Link className="font-headline font-bold text-lg tracking-tight nav-link-active transition-colors" to="/">Home</Link>
<Link className="font-headline font-bold text-lg tracking-tight text-on-surface-variant hover:text-primary transition-colors px-2 py-1" to="/marketplace">Market</Link>
<Link className="font-headline font-bold text-lg tracking-tight text-on-surface-variant hover:text-primary transition-colors px-2 py-1" to="/farmers">Farmers</Link>
</nav>
        <div className="flex items-center gap-6">
          <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors active:scale-95">search</button>
          <Link to="/cart" className="relative p-2 hover:bg-primary/5 rounded-full transition-all group">
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">shopping_cart</span>
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-2 border-[#fff9ee] animate-pulse-soft">
                {cart.length}
              </span>
            )}
          </Link>
          {!localStorage.getItem('user') ? (
            <Link to="/login" className="bg-[#154212] text-white px-8 py-3 rounded-2xl font-bold tracking-tight active:scale-95 transition-all shadow-lg hover:shadow-primary/20">Get Started</Link>
          ) : (
            <Link to="/profile" className="flex items-center gap-2 group">
               <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-primary fill-1">account_circle</span>
               </div>
            </Link>
          )}
        </div>
</header>
<main className="page-entry">

<section className="relative min-h-[90vh] flex items-center px-8 md:px-24 py-20 overflow-hidden">
<div className="absolute inset-0 z-0">
<img alt="Farm Harvest" className="w-full h-full object-cover scale-105 animate-in fade-in zoom-in duration-[3000ms]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmxNqYTZvQ0b_MJ8qh4SRrrnEoAFfz_5cDlRNCFypZ7ZALF-6X9-w2ChpHOTi6D9V9lIeOwF95BF71GfGI9umye8WAy5MVEaREo0VpxcQ8GpDAV_WrPAco6I3-AfvME1qm-GzsjfxsBjMFRJSkX97dnuW8BIn0zG5Bdm5gjUagykwVHuYQRDTo0zWuikK9tVt17CbxOrHdOaxrWve-q24-1XTplXElHHsK74fBvWdqCJycNxB3ANWxUbd3OME01Kyae5oAUV37CXnP"/>
<div className="absolute inset-0 bg-gradient-to-r from-[#fff9ee] via-[#fff9ee]/80 to-transparent"></div>
</div>
<div className="relative z-10 max-w-3xl">
<div className="flex items-center gap-3 mb-8">
  <span className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-[10px] font-black tracking-[0.2em] uppercase">Authentically Grown</span>
  <span className="w-12 h-[1px] bg-primary/20"></span>
  <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest italic">Since 1982</span>
</div>
<h2 className="text-6xl md:text-8xl font-headline font-black text-[#154212] leading-[0.95] tracking-tighter mb-10">
                    The Harvest, <br/><span className="text-[#a57b0d] font-serif italic font-medium -translate-x-2 inline-block">unfiltered.</span>
</h2>
<p className="text-xl md:text-2xl text-on-surface-variant mb-12 leading-relaxed max-w-xl font-medium opacity-90">
                    Experience a more honest way to eat. We bridge the gap between rural landscapes and your kitchen table.
                </p>
<div className="flex flex-col sm:flex-row gap-6">
<Link to="/marketplace" className="bg-[#154212] text-white px-10 py-5 rounded-[24px] font-bold text-xl shadow-2xl shadow-primary/30 active:scale-95 transition-all text-center group">
  Shop the Harvest
  <span className="material-symbols-outlined ml-2 translate-y-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
</Link>
<button className="bg-white/80 backdrop-blur-sm border border-outline-variant/10 text-[#154212] px-10 py-5 rounded-[24px] font-bold text-xl active:scale-95 transition-all hover:bg-white shadow-sm">
  Meet Our Farmers
</button>
</div>
</div>
</section>

<section className="py-24 px-6 md:px-24 bg-surface">
<div className="grid grid-cols-1 md:grid-cols-3 gap-12">
<div className="flex flex-col gap-4 p-8 bg-surface-container-low rounded-2xl transition-all hover:bg-surface-container-high group">
<div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center mb-4">
<span className="material-symbols-outlined text-on-primary-container text-3xl" data-icon="potted_plant">potted_plant</span>
</div>
<h3 className="text-2xl font-headline font-bold">Fresh from the Field</h3>
<p className="text-on-surface-variant leading-relaxed">Produce picked at peak ripeness and delivered within hours, not days. Taste the vibrancy of life.</p>
</div>
<div className="flex flex-col gap-4 p-8 bg-surface-container-low rounded-2xl transition-all hover:bg-surface-container-high group">
<div className="w-16 h-16 bg-secondary-container rounded-2xl flex items-center justify-center mb-4">
<span className="material-symbols-outlined text-on-secondary-container text-3xl" data-icon="local_shipping">local_shipping</span>
</div>
<h3 className="text-2xl font-headline font-bold">Direct to You</h3>
<p className="text-on-surface-variant leading-relaxed">No middlemen, no long-haul shipping. Just a transparent journey from the farmgate to your doorstep.</p>
</div>
<div className="flex flex-col gap-4 p-8 bg-surface-container-low rounded-2xl transition-all hover:bg-surface-container-high group">
<div className="w-16 h-16 bg-tertiary-container rounded-2xl flex items-center justify-center mb-4">
<span className="material-symbols-outlined text-on-tertiary-container text-3xl" data-icon="handshake">handshake</span>
</div>
<h3 className="text-2xl font-headline font-bold">Fair for Farmers</h3>
<p className="text-on-surface-variant leading-relaxed">We ensure 90% of every dollar goes directly back to the land and the people who steward it.</p>
</div>
</div>
</section>

<section className="py-24 px-6 md:px-24 bg-surface-container-low rounded-[3rem]">
<div className="text-center mb-16">
<h2 className="text-4xl font-headline font-extrabold mb-4">Cultivating Connection</h2>
<p className="text-on-surface-variant text-lg">A simple process for a better food system.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
<div className="md:col-span-8 bg-surface rounded-3xl overflow-hidden relative group editorial-shadow">
<img alt="Browse Products" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="overhead view of a rustic wooden kitchen table with digital tablet showing a marketplace app next to fresh apples and herbs" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3yp-yKWIDN7Jo6MxVKjT3iLP6PvoL24LygKSENIDe5AJ1WtfF33cfThzbmGJ4Rsd4aetKOykHVxnmqhHS7HHCSkpAA7EH6tcgrjB_DaJhB4EhHYt99skVBSV_CKhzq9VQleM2wD5XiFslXXZNXberYfUO8ONWGkfa-7-k4vNmyVRiVDgeWf5_5w7T5EK1KsvdhMkFHPWDInHZ2jyLGikAc84W8Nt61hM7NSs1K2qjYvvsAF2nPLQgl1ekJETNxWBOY0IFEk4ZFQnj"/>
<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-10">
<h4 className="text-white text-3xl font-headline font-bold mb-2">1. Browse the Local Season</h4>
<p className="text-white/80 max-w-md">Discover what's growing in your region right now. From heritage tomatoes to artisan honeys.</p>
</div>
</div>
<div className="md:col-span-4 bg-primary text-on-primary rounded-3xl p-10 flex flex-col justify-center editorial-shadow">
<span className="material-symbols-outlined text-5xl mb-6" data-icon="shopping_basket">shopping_basket</span>
<h4 className="text-3xl font-headline font-bold mb-4">2. Fill Your Basket</h4>
<p className="text-primary-fixed opacity-90 leading-relaxed">Customize your box or subscribe to a weekly farmer's choice bundle. No commitments, just great food.</p>
</div>
<div className="md:col-span-4 bg-secondary-container text-on-secondary-container rounded-3xl p-10 flex flex-col justify-center editorial-shadow">
<span className="material-symbols-outlined text-5xl mb-6" data-icon="door_front">door_front</span>
<h4 className="text-3xl font-headline font-bold mb-4">3. Fresh Arrival</h4>
<p className="text-on-secondary-container/80 leading-relaxed">Our fleet of temperature-controlled local couriers delivers the morning's harvest to your door.</p>
</div>
<div className="md:col-span-8 bg-surface rounded-3xl overflow-hidden relative group editorial-shadow">
<img alt="Happy Community" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="a family laughing together around a kitchen island while preparing a healthy salad with vibrant colorful fresh produce" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDW5saq6sQ0eG2S0MjPfSAW9j4YxIf2Y5JiPB0uR3noz0zL5FDkGIF21spmEwFDKMcTOk7PN8pl3rqMnJic7BNvUKgK7g2FvKW_2Le8ffRhTJh-bwfkcJIITCXyjDRTme6nm4FuwNZm3zL2xnHjOL1B2u54htZD9m-9IxALLWZyo0XCx0eI0UtcRIYWOrDSgJ4qYqo7pZ9qRpMk6ehWlVP6vMTnIsPu5ez3tbznCnifZs-Qjy8mxnKkfNB16iRhLQ_1tRMDy-vNql1J"/>
<div className="absolute inset-0 bg-gradient-to-t from-[#154212]/80 to-transparent flex flex-col justify-end p-10">
<h4 className="text-white text-3xl font-headline font-bold mb-2">4. Support the Soil</h4>
<p className="text-white/80 max-w-md">Every bite helps fund regenerative agriculture and supports small-scale family farming traditions.</p>
</div>
</div>
</div>
</section>

<section className="py-24 px-6 md:px-24 bg-surface">
<div className="flex justify-between items-end mb-16">
<div>
<h2 className="text-4xl font-headline font-extrabold mb-4">Stewards of the Land</h2>
<p className="text-on-surface-variant text-lg">Meet the experts behind your ingredients.</p>
</div>
<button className="text-primary font-bold flex items-center gap-2 hover:underline">
                    View all 140+ Farmers <span className="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>
</button>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">

<div className="bg-surface-container rounded-3xl overflow-hidden editorial-shadow group">
<div className="h-72 relative">
<img alt="The Miller Family" className="w-full h-full object-cover" data-alt="portrait of an elderly farmer couple smiling warmly in their organic vegetable garden with green leaves in the foreground" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-KuWXWOA8ArY33ZrxNGenBZJvv-BT0mDjiRG8A34Rw9JHQytBvJzYAaL_JwRn9Pa_uj9xF5rN6R8b6dOZ_Z6lNi6djO3xHs1aZBQJ_kul1B8fWx4DhjU55ZxzDAJg1tLCyWr583i7K7LAqJtiEYOCwkWZHoXTTxlxB51B_TTnVPhAG6aD--m7Bvnw7gSdj-365CyA_dTFdG_fTU1QqiK2slc8oq9dTw9RVittT1A-GSTE_tSs5l8XRtg_QxcCAV1aw57ONHwcB9sp"/>
<div className="absolute top-4 left-4">
<span className="bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">Organic Certified</span>
</div>
</div>
<div className="p-8">
<h4 className="text-2xl font-headline font-bold mb-1">Oak Ridge Farm</h4>
<p className="text-on-surface-variant font-medium mb-4">The Miller Family • 12 miles away</p>
<p className="text-on-surface-variant text-sm mb-6 leading-relaxed">Specializing in over 40 varieties of heirloom roots and stone fruits using regenerative practices since 1982.</p>
<div className="flex gap-2">
<span className="bg-surface-container-highest px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-tighter">Roots</span>
<span className="bg-surface-container-highest px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-tighter">Stone Fruit</span>
<span className="bg-surface-container-highest px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-tighter">No-Till</span>
</div>
</div>
</div>

<div className="bg-surface-container rounded-3xl overflow-hidden editorial-shadow group">
<div className="h-72 relative">
<img alt="Green Valley Dairy" className="w-full h-full object-cover" data-alt="rustic aesthetic photo of fresh raw milk in glass bottles and artisan cheeses on a wooden barn shelf" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC20ZFgbmL60XpOqEvhVqzPtQkrvQSPMJy74mYP_h0wy2TOf2crhNr97ojdLPTCLDveRqcKfbdKdhP5LjWb2bB88RG1kzlNQk-zl7Oc9vZcH8awTEWCjqeK5nB1HnBMf03qqCfZvVcg6Atrj6sej1pERP1R-s8-L2U1DUpHBw-lO2ChVoLxss3IshVRBFGWnI_lkPrhnttylYLpKKf-UFBl054apg8HhpdOiSGakP6qQustz6Tp_D8kk41gthqKLqf_MH8Y1EhjRYhh"/>
<div className="absolute top-4 left-4">
<span className="bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">Grass Fed</span>
</div>
</div>
<div className="p-8">
<h4 className="text-2xl font-headline font-bold mb-1">Green Valley Dairy</h4>
<p className="text-on-surface-variant font-medium mb-4">Marcus Chen • 24 miles away</p>
<p className="text-on-surface-variant text-sm mb-6 leading-relaxed">A-grade raw milk and hand-crafted artisanal cheeses from a small herd of pasture-raised Jersey cows.</p>
<div className="flex gap-2">
<span className="bg-surface-container-highest px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-tighter">Dairy</span>
<span className="bg-surface-container-highest px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-tighter">Cheese</span>
</div>
</div>
</div>

<div className="bg-surface-container rounded-3xl overflow-hidden editorial-shadow group">
<div className="h-72 relative">
<img alt="The Apiary" className="w-full h-full object-cover" data-alt="golden honey dripping from a honeycomb in warm natural sunlight with bees in soft focus background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTen6SOPyJ6LAv1XsL5fCyb9qPprm_5iaOqYzIk7FPgz6q5zEcMcjQYqimAelWHBBsgYk7BDDx8boZfkTLu_9Vu_dChIrZV0m3fojk3jMvfXwKCpP7UQtatFslC-v2sgamTFKkoCjSjQmodwp6YXfUu9YVS1tOaZVTnBIo03H7Dk_BtfIcKO8zOgyYX6S1y6pHQbnZe7AltQ_eBp4oNyRrjLi_IsefPCfBZ4z0aDE87QV1PLLuhMwHokJArotvko-yEhvkTUXfIm1G"/>
<div className="absolute top-4 left-4">
<span className="bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">Wild Harvest</span>
</div>
</div>
<div className="p-8">
<h4 className="text-2xl font-headline font-bold mb-1">Wildflower Apiary</h4>
<p className="text-on-surface-variant font-medium mb-4">Sarah &amp; Tom Webb • 8 miles away</p>
<p className="text-on-surface-variant text-sm mb-6 leading-relaxed">Single-origin raw honey and beeswax products harvested from diverse local forest floral sources.</p>
<div className="flex gap-2">
<span className="bg-surface-container-highest px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-tighter">Honey</span>
<span className="bg-surface-container-highest px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-tighter">Pollen</span>
</div>
</div>
</div>
</div>
</section>

<section className="py-24 px-6 md:px-24">
<div className="bg-primary-container rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden">
<div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
<span className="material-symbols-outlined text-[20rem]" data-icon="eco">eco</span>
</div>
<div className="relative z-10">
<h2 className="text-4xl md:text-6xl font-headline font-black text-on-primary-container mb-8 leading-tight">Join the Movement <br/>Towards Real Food.</h2>
<p className="text-primary-fixed opacity-90 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
                        Be the first to know when new seasonal crops drop and get exclusive recipes from our local farm-to-table chefs.
                    </p>
<div className="flex flex-col md:flex-row gap-4 justify-center items-stretch max-w-lg mx-auto">
<input className="flex-grow px-6 py-4 rounded-xl border-none bg-surface text-on-surface focus:ring-2 focus:ring-secondary focus:outline-none placeholder:text-on-surface-variant/50" placeholder="Enter your email" type="email"/>
<button className="bg-secondary-container text-on-secondary-container px-10 py-4 rounded-xl font-bold text-lg active:scale-95 transition-all">Join Us</button>
</div>
<p className="mt-6 text-primary-fixed/60 text-sm">Join over 12,000 neighbors eating closer to home.</p>
</div>
</div>
</section>
</main>

<footer className="bg-surface-container-highest pt-20 pb-28 md:pb-12 px-6 md:px-24">
<div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
<div className="col-span-1 md:col-span-1">
<h1 className="font-headline font-black text-[#154212] text-2xl tracking-tighter mb-6">The Homestead</h1>
<p className="text-on-surface-variant text-sm leading-relaxed">Dedicated to revitalizing local food systems and restoring the connection between land, farmer, and community.</p>
</div>
<div>
<h5 className="font-headline font-bold text-on-surface mb-6">The Market</h5>
<ul className="flex flex-col gap-4 text-on-surface-variant text-sm">
<li><a className="hover:text-primary transition-colors" href="#">Current Harvest</a></li>
<li><a className="hover:text-primary transition-colors" href="#">Subscription Boxes</a></li>
<li><a className="hover:text-primary transition-colors" href="#">Gift Cards</a></li>
<li><a className="hover:text-primary transition-colors" href="#">Delivery Map</a></li>
</ul>
</div>

<div>
<h5 className="font-headline font-bold text-on-surface mb-6">Connect</h5>
<div className="flex gap-4">
<div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-primary hover:text-on-primary transition-all cursor-pointer">
<span className="material-symbols-outlined" data-icon="mail">mail</span>
</div>
<div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-primary hover:text-on-primary transition-all cursor-pointer">
<span className="material-symbols-outlined" data-icon="share">share</span>
</div>
</div>
</div>
</div>
<div className="pt-8 border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-4">
<p className="text-[12px] text-on-surface-variant font-medium">© 2024 The Homestead Co. Rooted in integrity.</p>
<div className="flex gap-8 text-[12px] font-bold text-on-surface-variant tracking-wider uppercase">
<a href="#">Privacy</a>
<a href="#">Terms</a>
<a href="#">Ethics</a>
</div>
</div>
</footer>

<nav className="md:hidden fixed bottom-0 w-full z-50 flex justify-around items-center px-4 pt-3 pb-8 bg-[#fff9ee]/80 backdrop-blur-md shadow-[0_-12px_40px_rgba(29,27,21,0.06)] rounded-t-3xl">
<a className="flex flex-col items-center justify-center bg-[#ffc329] text-[#6f5100] rounded-2xl px-6 py-2 transition-all" href="#">
<span className="material-symbols-outlined" data-icon="home">home</span>
<span className="font-['Inter'] font-semibold text-[11px] uppercase tracking-wider mt-1">Home</span>
</a>
<a className="flex flex-col items-center justify-center text-[#42493e] px-6 py-2" href="#">
<span className="material-symbols-outlined" data-icon="shopping_basket">shopping_basket</span>
<span className="font-['Inter'] font-semibold text-[11px] uppercase tracking-wider mt-1">Orders</span>
</a>
<a className="flex flex-col items-center justify-center text-[#42493e] px-6 py-2" href="#">
<span className="material-symbols-outlined" data-icon="analytics">analytics</span>
<span className="font-['Inter'] font-semibold text-[11px] uppercase tracking-wider mt-1">Stats</span>
</a>
<Link to="/login" className="flex flex-col items-center justify-center text-[#42493e] px-6 py-2">
<span className="material-symbols-outlined" data-icon="person">person</span>
<span className="font-['Inter'] font-semibold text-[11px] uppercase tracking-wider mt-1">Profile</span>
</Link>
</nav>

    </div>
  );
}