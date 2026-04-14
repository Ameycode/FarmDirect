import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';

const Profile = () => {
  const { notify, cart } = useCart();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    timezone: user?.timezone || 'Eastern Time (ET)'
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Address State
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    name: '',
    line1: '',
    city: '',
    pinCode: '',
    label: 'HOME',
    isDefault: false
  });

  // Orders State
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Fetch Addresses
    fetch(`http://localhost:3000/api/addresses/${user.id}`)
      .then(res => res.json())
      .then(data => setAddresses(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));

    // Fetch Orders
    fetch(`http://localhost:3000/api/orders/${user.id}`)
      .then(res => res.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(`http://localhost:3000/api/auth/user/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        notify('Profile updated successfully!', 'success');
      } else {
        notify('Failed to update profile', 'error');
      }
    } catch (err) {
      console.error(err);
      notify('An error occurred', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.line1 || !newAddress.city || !newAddress.name) {
      notify('Please fill in all address details', 'error');
      return;
    }
    try {
      const res = await fetch('http://localhost:3000/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...newAddress, 
          userId: parseInt(user.id) 
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAddresses([...addresses, data]);
        setNewAddress({ name: '', line1: '', city: '', pinCode: '', label: 'HOME', isDefault: false });
        notify('Address added to homestead!', 'success');
      } else {
        notify('Failed to save address', 'error');
      }
    } catch (err) {
      console.error(err);
      notify('An error occurred', 'error');
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/addresses/${id}`, { method: 'DELETE' });
      setAddresses(addresses.filter(a => a.id !== id));
      notify('Address deleted', 'success');
    } catch (err) {
      console.error(err);
      notify('Failed to delete address', 'error');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#fff9ee] font-body text-on-surface">
      {/* Header */}
      <header className="px-8 py-5 flex justify-between items-center max-w-7xl mx-auto sticky top-0 z-[100] glass-header">
        <div className="flex items-center gap-12">
          <Link to="/" className="text-2xl font-black font-headline text-[#154212] tracking-tighter hover:scale-105 transition-transform">The Homestead</Link>
          <nav className="hidden md:flex gap-10">
            <Link to="/marketplace" className="font-headline font-bold text-sm uppercase tracking-widest text-[#154212] border-b-2 border-primary pb-1">Marketplace</Link>
            <Link to="/farmers" className="font-headline font-bold text-sm uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">Provisions</Link>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/cart" className="relative p-2 hover:bg-primary/5 rounded-full transition-all group">
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">shopping_cart</span>
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold border-2 border-[#fff9ee] animate-pulse-soft">
                {cart.length}
              </span>
            )}
          </Link>
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-white fill-1">account_circle</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 page-entry">
        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-8 sticky top-28 h-fit">
          <div className="mb-10">
            <h2 className="text-4xl font-black font-headline mb-2 tracking-tighter">Settings</h2>
            <p className="text-on-surface-variant text-sm font-medium opacity-70">Homestead Management</p>
          </div>

          <nav className="space-y-3">
            {[
              { id: 'profile', label: 'My Profile', icon: 'person' },
              { id: 'history', label: 'Order History', icon: 'history' },
              { id: 'addresses', label: 'Saved Addresses', icon: 'location_on' },
              { id: 'security', label: 'Security', icon: 'security' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-[20px] font-black uppercase tracking-widest text-[11px] transition-all ${
                  activeTab === tab.id 
                    ? 'bg-[#154212] text-white shadow-xl shadow-primary/20 scale-105 translate-x-2' 
                    : 'text-on-surface-variant hover:bg-primary/5'
                }`}
              >
                <span className={`material-symbols-outlined text-sm ${activeTab === tab.id ? 'fill-1' : ''}`}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Member Badge */}
          <div className="bg-[#154212] p-8 rounded-[40px] text-white relative overflow-hidden group shadow-2xl shadow-primary/30">
            <div className="relative z-10">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Authenticated Since</p>
              <p className="text-3xl font-black font-headline tracking-tighter">Spring 2022</p>
            </div>
            <div className="absolute -bottom-6 -right-6 opacity-10 pointer-events-none group-hover:scale-125 transition-transform duration-[5s]">
              <span className="material-symbols-outlined text-[160px] fill-1">potted_plant</span>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="lg:col-span-9 space-y-12">
          {activeTab === 'profile' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
              {/* Profile Header */}
              <div className="bg-white rounded-[48px] p-10 border border-outline-variant/10 shadow-xl shadow-primary/[0.03] flex flex-col md:flex-row items-center gap-10 premium-card">
                <div className="relative">
                  <div className="w-40 h-40 rounded-full overflow-hidden border-[6px] border-[#fff9ee] shadow-2xl">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHr9K7nPH17v4_E8n-xI9M_jW3W5S3XU9-R7VqE4A4P6O8H0N5Y2L7S4W3V5G4H3N2Y7L4S5W6G7H8" alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <button className="absolute bottom-2 right-2 w-12 h-12 bg-[#ffcb3d] rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all text-primary">
                    <span className="material-symbols-outlined text-2xl fill-1">photo_camera</span>
                  </button>
                </div>
                <div className="flex-grow text-center md:text-left">
                  <h3 className="text-5xl font-black font-headline mb-2 tracking-tighter">{user.name}</h3>
                  <p className="text-primary font-serif italic text-lg mb-6 flex items-center justify-center md:justify-start gap-2">
                    <span className="w-6 h-[1px] bg-primary/30"></span>
                    Artisan Breadmaker • Vermont, USA
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <span className="bg-[#60233e] text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-[#60233e]/20">Local Supplier</span>
                    <span className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20">Verified Homestead</span>
                  </div>
                </div>
                <button 
                  onClick={handleSaveChanges}
                  disabled={isUpdating}
                  className="bg-[#154212] text-white px-10 py-5 rounded-[24px] font-black uppercase tracking-widest text-xs hover:brightness-110 transition-all shadow-2xl shadow-primary/30 active:scale-95 disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Confirm Changes'}
                </button>
              </div>

              {/* Personal Details & Notifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Details Form */}
                <div className="bg-white/50 backdrop-blur-sm p-10 rounded-[40px] border border-outline-variant/10 shadow-sm space-y-8">
                  <p className="text-2xl font-bold font-headline">Personal Details</p>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Full Name</label>
                        <input 
                          type="text" 
                          name="name"
                          value={formData.name} 
                          onChange={handleInputChange}
                          className="w-full bg-[#e8e2d7] border-none rounded-xl p-4 font-medium" 
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Email Address</label>
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email} 
                          onChange={handleInputChange}
                          className="w-full bg-[#e8e2d7] border-none rounded-xl p-4 font-medium" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <div className="bg-white/50 backdrop-blur-sm p-10 rounded-[40px] border border-outline-variant/10 shadow-sm space-y-8">
                  <p className="text-2xl font-bold font-headline">Notifications</p>
                  <div className="space-y-6">
                    {[
                      { label: 'Order Updates', desc: 'Shipping and delivery status', active: true },
                      { label: 'Market Offers', desc: 'Seasonal harvest discounts', active: true }
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <div>
                          <p className="font-bold">{item.label}</p>
                          <p className="text-xs text-on-surface-variant">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked={item.active} className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#154212]"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex justify-between items-end border-b border-outline-variant/10 pb-8">
                  <div>
                    <h3 className="text-4xl font-black font-headline mb-2 tracking-tighter">Harvest History</h3>
                    <p className="text-on-surface-variant text-sm font-medium opacity-60">Review your past seasonal contributions.</p>
                  </div>
                  <div className="flex bg-primary/5 rounded-2xl p-1.5 gap-2">
                    <button className="bg-white text-primary px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">All Orders</button>
                    <button className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-primary">Subscriptions</button>
                  </div>
                </div>

                {orders.length === 0 ? (
                  <div className="bg-white rounded-[40px] p-24 text-center border border-outline-variant/5 shadow-inner">
                    <span className="material-symbols-outlined text-6xl text-primary/20 mb-4">history</span>
                    <p className="text-xl font-black font-headline text-on-surface-variant">No past harvests found.</p>
                  </div>
                ) : (
                  <div className="grid gap-8">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-white rounded-[40px] border border-outline-variant/10 overflow-hidden premium-card">
                        <div className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-outline-variant/5">
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-primary/5 rounded-[20px] flex items-center justify-center">
                              <span className="material-symbols-outlined text-primary text-3xl">local_shipping</span>
                            </div>
                            <div>
                              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#A57B0D] mb-1">Order #{order.id}</p>
                              <p className="text-2xl font-black font-headline tracking-tighter">Placed {new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex flex-col md:items-end">
                            <span className="bg-[#154212]/10 text-primary px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest mb-2">
                              {order.status}
                            </span>
                            <p className="text-2xl font-black font-headline text-primary tracking-tighter">${order.totalAmount.toFixed(2)}</p>
                          </div>
                        </div>
                        
                        <div className="p-8 space-y-8">
                          {/* Tracking Progress Bar */}
                          <div className="relative">
                            <div className="flex justify-between mb-2">
                              {['Confirmed', 'Harvesting', 'In Transit', 'Delivered'].map((step, idx) => (
                                <span key={step} className={`text-[9px] font-black uppercase tracking-widest ${idx <= (order.status === 'DELIVERED' ? 3 : 1) ? 'text-primary' : 'text-outline opacity-40'}`}>
                                  {step}
                                </span>
                              ))}
                            </div>
                            <div className="h-1.5 bg-primary/5 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary transition-all duration-1000" 
                                style={{ width: order.status === 'DELIVERED' ? '100%' : '40%' }}
                              ></div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-4">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-4 bg-[#fff9ee] p-3 rounded-2xl border border-outline-variant/5">
                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-white shadow-sm">
                                  <img src={item.product?.image} alt={item.product?.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <p className="text-[10px] font-black uppercase tracking-tighter leading-none mb-1">{item.product?.name}</p>
                                  <p className="text-[10px] text-on-surface-variant font-bold opacity-60">QTY: {item.quantity}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex justify-between items-center pt-8 border-t border-outline-variant/5">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-emerald-600 text-sm">verified_user</span>
                              <span className="text-[10px] font-bold text-on-surface-variant opacity-60">Ethically Sourced</span>
                            </div>
                            <button className="bg-primary/5 text-primary px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 transition-all">Trace Harvest</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col gap-2">
                <h2 className="text-5xl font-black font-headline tracking-tighter">Delivery Addresses</h2>
                <p className="text-on-surface-variant font-medium">Manage homestead delivery locations.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-12 bg-white shadow-xl shadow-black/5 rounded-[40px] p-10 space-y-8 border border-outline-variant/10">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>add_location_alt</span>
                          <p className="text-2xl font-bold font-headline">Add New Address</p>
                        </div>
                        <div>
                          <input type="text" placeholder="Location Name" value={newAddress.name} onChange={(e) => setNewAddress({...newAddress, name: e.target.value})} className="w-full bg-[#e8e2d7] border-none rounded-xl p-4 font-medium" />
                        </div>
                        <div>
                          <input type="text" placeholder="Address Line 1" value={newAddress.line1} onChange={(e) => setNewAddress({...newAddress, line1: e.target.value})} className="w-full bg-[#e8e2d7] border-none rounded-xl p-4 font-medium" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <input type="text" placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({...newAddress, city: e.target.value})} className="w-full bg-[#e8e2d7] border-none rounded-xl p-4 font-medium" />
                          <input type="text" placeholder="PIN Code" value={newAddress.pinCode} onChange={(e) => setNewAddress({...newAddress, pinCode: e.target.value})} className="w-full bg-[#e8e2d7] border-none rounded-xl p-4 font-medium" />
                        </div>
                        <button onClick={handleAddAddress} className="w-full bg-[#ffcb3d] text-primary font-black py-4 rounded-xl shadow-lg hover:brightness-105 transition-all text-xs uppercase tracking-widest">Add Address</button>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-fit">
                        {addresses.map((addr) => (
                          <div key={addr.id} className="bg-[#fff9ee] p-6 rounded-3xl border border-outline-variant/5 shadow-sm relative group">
                            <h4 className="font-bold mb-1">{addr.name}</h4>
                            <p className="text-[11px] text-on-surface-variant opacity-70 mb-4">{addr.line1}, {addr.city}</p>
                            <button onClick={() => handleDeleteAddress(addr.id)} className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                        ))}
                      </div>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-8 py-12 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <h1 className="font-headline font-black text-[#154212] text-xl tracking-tighter mb-2">The Homestead</h1>
          <p className="text-on-surface-variant text-xs max-w-sm">Cultivating a digital space for those who value the soil, the craft, and the community.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-8 text-[12px] font-bold text-on-surface-variant tracking-wider uppercase">
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
        </div>
        <p className="text-[10px] text-on-surface-variant font-medium">© 2024 The Homestead. Rooted in integrity.</p>
      </footer>
    </div>
  );
};

export default Profile;
