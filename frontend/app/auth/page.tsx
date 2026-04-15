'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Leaf, Phone, User, ArrowRight, Loader2, MapPin } from 'lucide-react';
import { authAPI, farmsAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth, user } = useAuthStore();
  const [step, setStep] = useState<'phone' | 'details'>('phone');
  const [role, setRole] = useState<'BUYER' | 'FARMER'>(
    (searchParams.get('role') as 'BUYER' | 'FARMER') || 'BUYER'
  );
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [latLng, setLatLng] = useState<{lat: number, lng: number} | null>(null);
  const [fetchingLoc, setFetchingLoc] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace(user.role === 'FARMER' ? '/farmer/dashboard' : '/discover');
    }
  }, [user, router]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    const formatted = phone.startsWith('+91') ? phone : `+91${phone}`;

    setLoading(true);
    try {
      // Try to login first
      const { data } = await authAPI.login(formatted);
      setAuth(data.user, data.access, data.refresh);
      toast.success(`Welcome back, ${data.user.name || 'Friend'}!`);
      router.replace(data.user.role === 'FARMER' ? '/farmer/dashboard' : '/discover');
    } catch {
      // New user — collect details
      setPhone(formatted);
      setStep('details');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchLocation = async () => {
    setFetchingLoc(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation not supported'));
          return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
      });
      setLatLng({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      toast.success('Location fetched successfully!');
    } catch (err) {
      toast.error('Could not fetch location. Please grant permission.');
    } finally {
      setFetchingLoc(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (role === 'FARMER' && !latLng) {
      toast.error('Please fetch your location first.');
      setLoading(false);
      return;
    }

    try {
      const { data } = await authAPI.register({ phone, name, role });
      setAuth(data.user, data.access, data.refresh);
      
      if (role === 'FARMER' && latLng) {
        try {
          await farmsAPI.createOrUpdate({ 
            farm_name: `${name}'s Farm`,
            address: address,
            district: 'Unspecified',
            latitude: latLng.lat, 
            longitude: latLng.lng 
          });
        } catch (farmErr) {
          console.error('Failed to set initial farm location', farmErr);
        }
      }

      toast.success('Account created! Welcome to FarmDirect.');
      router.replace(role === 'FARMER' ? '/farmer/dashboard' : '/discover');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      toast.error(error?.response?.data?.error || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white">FarmDirect</h1>
          <p className="text-green-300 mt-2">Farm-fresh, no middlemen</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          {step === 'phone' ? (
            <>
              <h2 className="text-2xl font-black text-green-900 mb-2">Enter your phone</h2>
              <p className="text-gray-500 text-sm mb-6">We&apos;ll find or create your account</p>
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl text-lg font-semibold focus:outline-none focus:border-green-500 transition-colors"
                    required
                    maxLength={10}
                    pattern="[0-9]{10}"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-700 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-green-800 transition-colors disabled:opacity-60"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Continue <ArrowRight className="w-5 h-5" /></>}
                </button>
              </form>
              <p className="text-center text-xs text-gray-400 mt-6">
                By continuing, you agree to our Terms & Privacy Policy
              </p>
            </>
          ) : (
            <>
              <button onClick={() => setStep('phone')} className="text-sm text-green-600 font-semibold mb-4 flex items-center gap-1">
                ← Back
              </button>
              <h2 className="text-2xl font-black text-green-900 mb-2">Create your account</h2>
              <p className="text-gray-500 text-sm mb-6">Tell us about yourself</p>

              {/* Role Toggle */}
              <div className="flex gap-3 mb-6">
                {(['BUYER', 'FARMER'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                      role === r
                        ? 'bg-green-700 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {r === 'BUYER' ? '🛒 I\'m a Buyer' : '🌾 I\'m a Farmer'}
                  </button>
                ))}
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl text-lg font-semibold focus:outline-none focus:border-green-500 transition-colors"
                    required
                  />
                </div>
                {role === 'FARMER' && (
                  <div className="space-y-4">
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Farm address"
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl text-base font-semibold focus:outline-none focus:border-green-500 transition-colors resize-none"
                        required={role === 'FARMER'}
                        rows={2}
                      />
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                      <div className="flex items-start gap-3 mb-3">
                        <MapPin className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-green-900">GPS Location Required</p>
                          <p className="text-xs text-green-700 mt-1">We will request your current location to automatically verify your farm&#39;s position for local buyers.</p>
                        </div>
                      </div>
                      
                      {latLng ? (
                        <div className="bg-green-100/50 rounded-lg p-3 flex items-center justify-between">
                          <span className="text-sm font-bold text-green-800">Location verified ✓</span>
                          <span className="text-xs font-mono text-green-700">{latLng.lat.toFixed(4)}, {latLng.lng.toFixed(4)}</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleFetchLocation}
                          disabled={fetchingLoc}
                          className="w-full bg-green-200 text-green-800 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-300 transition-colors disabled:opacity-60"
                        >
                          {fetchingLoc ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                          Fetch Current Location
                        </button>
                      )}
                    </div>
                  </div>
                )}
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 font-medium">Phone number</p>
                  <p className="text-base font-bold text-green-900">{phone}</p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-700 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-green-800 transition-colors disabled:opacity-60"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create Account <ArrowRight className="w-5 h-5" /></>}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}
