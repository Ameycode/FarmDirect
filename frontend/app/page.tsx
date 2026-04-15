import Link from 'next/link';
import { Leaf, MapPin, ShoppingBag, ArrowRight, Star, TrendingUp, Users, Shield } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-green-50 to-emerald-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-green-700 rounded-xl flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-green-900">FarmDirect</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/discover" className="text-sm font-semibold text-gray-600 hover:text-green-700 transition-colors">
              Discover Farms
            </Link>
            <Link href="/auth" className="bg-green-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-green-800 transition-colors">
              Get Started
            </Link>
          </nav>
          <Link href="/auth" className="md:hidden bg-green-700 text-white px-4 py-2 rounded-xl font-bold text-sm">
            Join Now
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Zero Middlemen · Fair Prices · Fresh Produce
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-green-900 leading-tight mb-6">
            Buy Direct from<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
              Local Farmers
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            Discover nearby farms, view fresh produce, negotiate prices in real-time, and get delivery or pickup — all without any middleman.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/discover"
              className="group bg-green-700 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-green-800 transition-all shadow-lg shadow-green-200"
            >
              <MapPin className="w-5 h-5" />
              Find Nearby Farms
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/auth?role=FARMER"
              className="bg-white border-2 border-green-200 text-green-800 px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:border-green-400 transition-all"
            >
              I&apos;m a Farmer →
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20">
          {[
            { icon: Users, label: "Registered Farmers", value: "500+" },
            { icon: ShoppingBag, label: "Products Listed", value: "2,000+" },
            { icon: TrendingUp, label: "Orders Completed", value: "10,000+" },
            { icon: Star, label: "Avg. Farmer Rating", value: "4.8/5" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-6 text-center border border-green-50 shadow-sm">
              <s.icon className="w-7 h-7 text-green-600 mx-auto mb-3" />
              <div className="text-3xl font-black text-green-900 mb-1">{s.value}</div>
              <div className="text-sm text-gray-500 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-black text-center text-green-900 mb-4">How FarmDirect Works</h2>
          <p className="text-center text-gray-500 mb-14 text-lg">Three simple steps to farm-fresh produce</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Discover", desc: "Use your location to find farmers within your delivery radius on an interactive map.", icon: MapPin, color: "bg-emerald-100 text-emerald-700" },
              { step: "02", title: "Browse & Negotiate", desc: "View fresh produce listings with harvest dates, prices, and stock. Negotiate directly with farmers.", icon: ShoppingBag, color: "bg-amber-100 text-amber-700" },
              { step: "03", title: "Order & Receive", desc: "Place your order with COD. Choose home delivery or farm pickup. Rate the farmer after.", icon: Shield, color: "bg-green-100 text-green-700" },
            ].map((step) => (
              <div key={step.step} className="text-center p-8 rounded-3xl bg-gradient-to-b from-gray-50 to-white border border-gray-100">
                <div className={`w-14 h-14 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                  <step.icon className="w-7 h-7" />
                </div>
                <div className="text-5xl font-black text-gray-100 mb-3">{step.step}</div>
                <h3 className="text-2xl font-bold text-green-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Farmer */}
      <section className="bg-green-900 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black text-white mb-4">Are You a Farmer?</h2>
          <p className="text-green-200 text-lg mb-8 leading-relaxed">
            Create your virtual farm shop in minutes. List your produce, set your prices, and start receiving orders from local buyers — no commission, no middlemen.
          </p>
          <Link
            href="/auth?role=FARMER"
            className="inline-flex items-center gap-3 bg-amber-400 text-green-900 px-10 py-4 rounded-2xl font-black text-lg hover:bg-amber-300 transition-colors shadow-xl"
          >
            Register Your Farm Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-950 py-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-black text-white">FarmDirect</span>
        </div>
        <p className="text-green-400 text-sm mb-4">Connecting farmers with local buyers since 2025</p>
        <div className="flex justify-center gap-8 text-green-500 text-sm">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
}
