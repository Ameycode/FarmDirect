import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    remember: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    const endpoint = isLogin ? 'login' : 'register';
    try {
      const response = await fetch(`http://localhost:3000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsSubmitting(false);
        setIsSuccess(true);
        localStorage.setItem('user', JSON.stringify(data.user));
        setTimeout(() => navigate('/'), 2000);
      } else {
        setIsSubmitting(false);
        setError(data.error || 'Invalid credentials');
      }
    } catch (error) {
      setIsSubmitting(false);
      setError('Server connection error. Please try again.');
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-surface min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center space-y-6 bg-surface-container p-12 rounded-3xl editorial-shadow">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <h2 className="font-headline text-3xl font-bold text-on-surface">
            {isLogin ? 'Welcome Back!' : 'Account Created!'}
          </h2>
          <p className="text-on-surface-variant">
            {isLogin 
              ? 'Successfully signed in to your hearth. Redirecting you home...' 
              : 'Your homestead journey starts now. Redirecting you home...'}
          </p>
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen flex flex-col">
      
<main className="flex-grow flex items-stretch min-h-screen">

<div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary">
<img alt="Sun-drenched agricultural landscape with rolling hills and a modern farmhouse at dawn" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60" data-alt="cinematic shot of sun-drenched agricultural landscape with rolling green hills and a modern farmhouse at golden hour dawn light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7ugBw9ITSSBoUGJ2Mhp7wauTjalwyYRB5VIeyy13WIVRnjq65DV-pOzdnNFAz097jlLfR0YciuDcpIuP56zvVRzqT3j5uyzc_tH0BC_ZI6rOTLFNZSZPBn_eh1NjwKsfp73drUcuqrC6Gy-gUIklUJE2Cg0xwSz3OA_9yXiX-LbOjraf9AzPhyKj41119rudb0rBYsdnvi33vkT4XfmTboxasGQfDEXrt5jbkNxADBojs1kQUoZA0oZh4MYJwIEPFaqnAQgoM4PCU"/>
<div className="relative z-10 p-16 flex flex-col justify-between h-full">
<div className="flex items-center space-x-3">
<span className="material-symbols-outlined text-surface text-4xl" data-icon="potted_plant">potted_plant</span>
<Link to="/" className="font-headline font-extrabold text-3xl tracking-tight text-surface hover:underline">Harvest Hearth</Link>
</div>
<div className="max-w-md">
<h1 className="font-headline text-5xl font-extrabold leading-tight text-surface mb-6">
                        Reconnect with the rhythm of the soil.
                    </h1>
<p className="text-xl text-surface/90 leading-relaxed font-medium">
                        Join our community of growers and producers. Pure provenance, delivered from the field to your doorstep.
                    </p>
</div>
<div className="flex items-center gap-8">
<div className="flex flex-col">
<span className="text-3xl font-bold text-secondary-container">12k+</span>
<span className="text-sm text-surface/80 uppercase tracking-widest font-semibold">Local Producers</span>
</div>
<div className="w-px h-10 bg-surface/20"></div>
<div className="flex flex-col">
<span className="text-3xl font-bold text-secondary-container">100%</span>
<span className="text-sm text-surface/80 uppercase tracking-widest font-semibold">Traceable Source</span>
</div>
</div>
</div>
</div>

<div className="w-full lg:w-1/2 flex flex-col bg-surface overflow-y-auto font-body">

<div className="p-8 flex justify-end">
<div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full shadow-sm">
<span className="material-symbols-outlined text-outline text-sm" data-icon="language">language</span>
<select className="bg-transparent border-none focus:ring-0 text-sm font-semibold text-on-surface-variant cursor-pointer appearance-none pr-4">
<option value="en">English</option>
<option value="hi">हिन्दी (Hindi)</option>
<option value="mr">मराठी (Marathi)</option>
</select>
<span className="material-symbols-outlined text-outline text-xs" data-icon="expand_more">expand_more</span>
</div>
</div>
<div className="flex-grow flex items-center justify-center p-8">
<div className="max-w-md w-full">

<div className="lg:hidden flex items-center space-x-2 mb-12">
<span className="material-symbols-outlined text-primary text-3xl" data-icon="potted_plant">potted_plant</span>
<Link to="/" className="font-headline font-extrabold text-2xl tracking-tight text-primary hover:underline">Harvest Hearth</Link>
</div>

<div className="mb-10 inline-flex p-1 bg-surface-container-low rounded-xl">
<button 
  onClick={() => setIsLogin(true)}
  className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${isLogin ? 'bg-surface-container-lowest shadow-sm text-primary' : 'text-on-surface-variant hover:text-primary'}`}>
  Sign In
</button>
<button 
  onClick={() => setIsLogin(false)}
  className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${!isLogin ? 'bg-surface-container-lowest shadow-sm text-primary' : 'text-on-surface-variant hover:text-primary'}`}>
  Create Account
</button>
</div>
<div className="space-y-2 mb-8">
<h2 className="font-headline text-3xl font-bold text-on-surface">
  {isLogin ? 'Welcome Back' : 'Join the Hearth'}
</h2>
<p className="text-on-surface-variant">
  {isLogin ? 'Enter your credentials to access your homestead dashboard.' : 'Start your journey towards honest food and sustainable living.'}
</p>
{error && (
  <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
    <span className="material-symbols-outlined text-lg">error</span>
    {error}
  </div>
)}
</div>
<form onSubmit={handleSubmit} className="space-y-6">
{!isLogin && (
  <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
    <label className="text-xs font-bold uppercase tracking-wider text-outline ml-1">Full Name</label>
    <div className="relative group">
      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" data-icon="person">person</span>
      <input 
        required
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        className="w-full pl-12 pr-4 py-4 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/40 text-on-surface font-medium transition-all placeholder:text-outline/60" 
        placeholder="Aarav Sharma" 
        type="text"/>
    </div>
  </div>
)}
<div className="space-y-1.5">
<label className="text-xs font-bold uppercase tracking-wider text-outline ml-1">Email or Phone</label>
<div className="relative group">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" data-icon="alternate_email">alternate_email</span>
<input 
  required
  name="email"
  value={formData.email}
  onChange={handleInputChange}
  className="w-full pl-12 pr-4 py-4 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/40 text-on-surface font-medium transition-all placeholder:text-outline/60" 
  placeholder="name@homestead.com" 
  type="text"/>
</div>
</div>
<div className="space-y-1.5">
<div className="flex justify-between items-center px-1">
<label className="text-xs font-bold uppercase tracking-wider text-outline">Password</label>
{isLogin && <a className="text-xs font-bold text-primary hover:underline" href="#">Forgot?</a>}
</div>
<div className="relative group">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors" data-icon="lock">lock</span>
<input 
  required
  name="password"
  value={formData.password}
  onChange={handleInputChange}
  className="w-full pl-12 pr-12 py-4 bg-surface-container-highest rounded-xl border-none focus:ring-2 focus:ring-primary/40 text-on-surface font-medium transition-all placeholder:text-outline/60" 
  placeholder="••••••••" 
  type={showPassword ? "text" : "password"}/>
<button 
  onClick={() => setShowPassword(!showPassword)}
  className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors" 
  type="button">
<span className="material-symbols-outlined" data-icon={showPassword ? "visibility_off" : "visibility"}>{showPassword ? "visibility_off" : "visibility"}</span>
</button>
</div>
</div>
{isLogin && (
  <div className="flex items-center space-x-3 px-1">
  <input 
    name="remember"
    checked={formData.remember}
    onChange={handleInputChange}
    className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary focus:ring-offset-surface cursor-pointer" 
    id="remember" 
    type="checkbox"/>
  <label className="text-sm font-medium text-on-surface-variant cursor-pointer" htmlFor="remember">Remember this device</label>
  </div>
)}
<button 
  disabled={isSubmitting}
  className={`w-full py-4 bg-primary text-surface font-bold text-lg rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`} 
  type="submit">
    {isSubmitting ? (
      <div className="w-6 h-6 border-2 border-surface/20 border-t-surface rounded-full animate-spin"></div>
    ) : (
      <>
        {isLogin ? 'Access Your Hearth' : 'Create My Account'}
        <span className="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>
      </>
    )}
</button>
</form>
<div className="mt-10">
<div className="relative flex items-center py-4">
<div className="flex-grow border-t border-surface-container-highest"></div>
<span className="flex-shrink mx-4 text-xs font-bold uppercase tracking-widest text-outline">Social Harvest</span>
<div className="flex-grow border-t border-surface-container-highest"></div>
</div>
<div className="grid grid-cols-2 gap-4 mt-6">
<button className="flex items-center justify-center gap-3 py-3 px-4 bg-surface-container-low rounded-xl border-none hover:bg-surface-container-high transition-colors text-sm font-semibold text-on-surface active:scale-95 transition-all">
<img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgPghhHBSIF_BZPRpRZ2WPGvtvDqh65d7V48W-svfYL2usmrJZviS9Z_xC4G3apfItq3gNf8Qyv_ESdkTGNrJcgNHT_AaoQycGY6enRoE9yaD-_Z1F4epScdi3la4ZNyul4XTnj16U80DQyWSgzobZVd112zm5bsZTVyBfldJ5YHT7xU_4of26Y2KygOWhlnIJ4owsU6s40FbO44y8lBKKBqLh_YkM11Ua8SqlIi_r4ntbzxQwEp2WShyRKjgFhHsElX5qqRGSkkhY"/>
                                Google
                            </button>
<button className="flex items-center justify-center gap-3 py-3 px-4 bg-surface-container-low rounded-xl border-none hover:bg-surface-container-high transition-colors text-sm font-semibold text-on-surface active:scale-95 transition-all">
<span className="material-symbols-outlined text-blue-600" data-icon="facebook" style={{ fontVariationSettings: "'FILL' 1" }}>social_leaderboard</span>
                                Facebook
                            </button>
</div>
</div>
</div>
</div>

<footer className="p-8 mt-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-widest text-outline">
<div className="flex items-center gap-6">
<a className="hover:text-primary transition-colors" href="#">Privacy</a>
<a className="hover:text-primary transition-colors" href="#">Terms</a>
<a className="hover:text-primary transition-colors" href="#">Help</a>
</div>
<div className="text-outline/60">
                    © 2024 Harvest Hearth Marketplace
                </div>
</footer>
</div>
</main>

<div className="fixed -bottom-24 -left-24 w-96 h-96 bg-primary-fixed-dim/10 rounded-full blur-3xl pointer-events-none"></div>
<div className="fixed top-1/4 -right-12 w-64 h-64 bg-secondary-fixed/10 rounded-full blur-2xl pointer-events-none"></div>

    </div>
  );
}