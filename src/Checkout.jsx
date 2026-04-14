import React, { useState } from 'react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cart, notify } = useCart();
  const navigate = useNavigate();
  const [deliverySlot, setDeliverySlot] = useState('afternoon');
  const [paymentMethod, setPaymentMethod] = useState('upi');

  const user = JSON.parse(localStorage.getItem('user'));

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const subtotal = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const deliveryFee = 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + deliveryFee + tax;

  const handleConfirmAndPay = async () => {
    const userBuffer = JSON.parse(localStorage.getItem('user'));
    if (!userBuffer) {
      notify('Please login to place an order', 'error');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userBuffer.id,
          total,
          items: cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          }))
        })
      });

      if (res.ok) {
        notify('Order placed successfully!', 'success');
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        notify('Failed to place order', 'error');
      }
    } catch (err) {
      console.error(err);
      notify('An error occurred', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface">
      {/* Header */}
      <header className="px-8 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-12">
          <h1 className="text-2xl font-bold font-headline text-[#2d4a22]">Harvest Homestead</h1>
          <nav className="hidden md:flex gap-8">
            <a href="/marketplace" className="font-medium hover:text-primary transition-colors">Marketplace</a>
            <a href="#" className="font-medium hover:text-primary transition-colors">Our Story</a>
            <a href="#" className="font-medium hover:text-primary transition-colors">Producers</a>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <button className="p-2 hover:bg-surface-container rounded-full transition-colors">
            <span className="material-symbols-outlined">shopping_bag</span>
          </button>
          <button className="p-2 hover:bg-surface-container rounded-full transition-colors">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Delivery & Payment */}
        <div className="lg:col-span-8 space-y-12">
          {/* Section 1: Delivery Details */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-[#2d4a22] text-white flex items-center justify-center font-bold text-xl">1</div>
              <h2 className="text-3xl font-bold font-headline">Delivery Details</h2>
            </div>

            <div className="space-y-8">
              <div>
                <p className="text-lg font-semibold mb-4">Select Delivery Address</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-2 border-[#2d4a22] bg-white p-6 rounded-2xl relative shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold text-lg">Home</p>
                      <span className="material-symbols-outlined text-[#2d4a22] fill-1">check_circle</span>
                    </div>
                    <p className="text-on-surface-variant leading-relaxed">
                      124 Maple Avenue, Oak Ridge,<br />
                      Portland, OR 97201
                    </p>
                  </div>
                  <div className="border border-outline-variant bg-surface-container-low p-6 rounded-2xl relative opacity-60">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold text-lg">Office</p>
                      <div className="w-5 h-5 rounded-full border-2 border-outline"></div>
                    </div>
                    <p className="text-on-surface-variant leading-relaxed">
                      Building 4, Tech Park East,<br />
                      Portland, OR 97204
                    </p>
                  </div>
                </div>
                <button className="mt-4 flex items-center gap-2 text-[#2d4a22] font-bold hover:underline">
                  <span className="material-symbols-outlined text-xl">add_location_alt</span>
                  Add New Address
                </button>
              </div>

              <div>
                <p className="text-lg font-semibold mb-4">Choose Delivery Slot</p>
                <div className="grid grid-cols-3 gap-4">
                  {['morning', 'afternoon', 'evening'].map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setDeliverySlot(slot)}
                      className={`p-4 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                        deliverySlot === slot
                          ? 'bg-[#2d4a22] text-white shadow-lg scale-[1.02]'
                          : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                    >
                      <span className="uppercase text-[10px] font-bold tracking-wider">{slot}</span>
                      <span className="font-bold">
                        {slot === 'morning' ? '08:00 - 11:00' : slot === 'afternoon' ? '13:00 - 16:00' : '18:00 - 21:00'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Payment Method */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-[#2d4a22] text-white flex items-center justify-center font-bold text-xl">2</div>
              <h2 className="text-3xl font-bold font-headline">Payment Method</h2>
            </div>

            <div className="space-y-4">
              {/* UPI */}
              <div 
                className={`rounded-2xl border transition-all ${paymentMethod === 'upi' ? 'border-primary bg-surface-container-low' : 'border-outline-variant bg-white'}`}
                onClick={() => setPaymentMethod('upi')}
              >
                <div className="p-6 flex items-center gap-4 cursor-pointer">
                  <span className="material-symbols-outlined">qr_code_2</span>
                  <span className="font-bold text-lg">UPI (Unified Payments)</span>
                </div>
                {paymentMethod === 'upi' && (
                  <div className="p-8 border-t border-outline-variant grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="bg-white p-6 rounded-2xl flex flex-col items-center justify-center shadow-inner border border-outline-variant">
                      <div className="w-32 h-32 bg-surface-container rounded-xl flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-6xl text-outline-variant">qr_code_2</span>
                      </div>
                      <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Scan to Pay</p>
                    </div>
                    <div className="flex flex-col justify-center gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Enter UPI ID</label>
                        <input 
                          type="text" 
                          placeholder="username@bank" 
                          className="w-full bg-surface-container-highest border-none rounded-xl p-4 focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <button className="w-full bg-secondary-container text-on-secondary-container font-bold py-4 rounded-xl shadow-md hover:brightness-105 transition-all">
                        Verify ID
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Card */}
              <div 
                className={`rounded-2xl border transition-all ${paymentMethod === 'card' ? 'border-primary bg-surface-container-low' : 'border-outline-variant bg-white'}`}
                onClick={() => setPaymentMethod('card')}
              >
                <div className="p-6 flex items-center gap-4 cursor-pointer">
                  <span className="material-symbols-outlined">credit_card</span>
                  <span className="font-bold text-lg">Credit or Debit Card</span>
                </div>
                {paymentMethod === 'card' && (
                  <div className="p-8 border-t border-outline-variant space-y-6">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Cardholder Name</label>
                      <input 
                        type="text" 
                        placeholder="John Doe" 
                        className="w-full bg-surface-container-highest border-none rounded-xl p-4 focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Card Number</label>
                      <input 
                        type="text" 
                        placeholder="0000 0000 0000 0000" 
                        className="w-full bg-surface-container-highest border-none rounded-xl p-4 focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">Expiry Date</label>
                        <input 
                          type="text" 
                          placeholder="MM/YY" 
                          className="w-full bg-surface-container-highest border-none rounded-xl p-4 focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">CVV</label>
                        <input 
                          type="password" 
                          placeholder="***" 
                          className="w-full bg-surface-container-highest border-none rounded-xl p-4 focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* COD */}
              <div 
                className={`rounded-2xl border transition-all ${paymentMethod === 'cod' ? 'border-primary bg-surface-container-low' : 'border-outline-variant bg-white'}`}
                onClick={() => setPaymentMethod('cod')}
              >
                <div className="p-6 flex justify-between items-center cursor-pointer">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined">payments</span>
                    <span className="font-bold text-lg">Cash on Delivery</span>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 p-1 ${paymentMethod === 'cod' ? 'border-primary' : 'border-outline-variant'}`}>
                    {paymentMethod === 'cod' && <div className="w-full h-full bg-primary rounded-full"></div>}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-low rounded-[32px] p-8 shadow-sm border border-outline-variant">
            <h3 className="text-2xl font-bold font-headline mb-8">Order Summary</h3>
            
            <div className="space-y-6 mb-8">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white flex-shrink-0 border border-outline-variant shadow-sm">
                    <img src={item.product?.image || '/placeholder.png'} alt={item.product?.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm leading-tight mb-1">{item.product?.name}</p>
                    <p className="text-xs text-on-surface-variant">Quantity: {item.quantity}{item.product?.unit}</p>
                  </div>
                  <p className="font-bold">${(item.product?.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <hr className="border-outline-variant mb-6" />

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span className="font-bold text-on-surface">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant items-center">
                <span>Delivery Fee</span>
                <span className="font-bold text-[#3b6934] flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">stars</span> FREE
                </span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Estimated Tax</span>
                <span className="font-bold text-on-surface">${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-8">
              <span className="text-xl font-bold font-headline">Total</span>
              <span className="text-4xl font-bold font-headline text-[#154212]">${total.toFixed(2)}</span>
            </div>

            <button 
              onClick={handleConfirmAndPay}
              className="w-full bg-[#154212] text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-lg group"
            >
              Confirm & Pay
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
            </button>

            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-base">verified_user</span>
              Secure transaction powered by HearthPay
            </div>
          </div>

          {/* Coupon Section */}
          <div className="bg-[#60233e] p-8 rounded-[32px] text-white overflow-hidden relative">
            <div className="relative z-10">
              <p className="font-bold text-lg mb-4">Have a coupon code?</p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="HARVEST2024" 
                  className="flex-1 bg-white/20 border-none rounded-xl px-4 py-3 placeholder:text-white/40 focus:ring-2 focus:ring-white/50"
                  defaultValue="HARVEST2024"
                />
                <button className="bg-white text-[#60233e] px-6 py-3 rounded-xl font-bold hover:bg-white/90 transition-colors">
                  Apply
                </button>
              </div>
            </div>
            {/* Background pattern/blob */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
