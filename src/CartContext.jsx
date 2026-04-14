import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  const notify = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:3000/api/cart/${user.id}`)
        .then(res => res.json())
        .then(data => setCart(data))
        .catch(err => console.error(err));
    }
  }, []);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      notify('Please login to add to cart', 'error');
      return;
    }
    try {
      const res = await fetch('http://localhost:3000/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, productId, quantity })
      });
      const data = await res.json();
      // Refresh cart
      const refreshRes = await fetch(`http://localhost:3000/api/cart/${user.id}`);
      const refreshedCart = await refreshRes.json();
      setCart(refreshedCart);
      notify('Added to cart!', 'success');
    } catch (err) {
      console.error(err);
      notify('Failed to add to cart', 'error');
    }
  };

  const removeFromCart = async (cartItemId) => {
     try {
        await fetch(`http://localhost:3000/api/cart/${cartItemId}`, { method: 'DELETE' });
        setCart(prev => prev.filter(item => item.id !== cartItemId));
        notify('Removed from cart', 'success');
     } catch (err) {
        console.error(err);
        notify('Failed to remove item', 'error');
     }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      // Optimistic update
      setCart(prev => prev.map(item => item.id === cartItemId ? { ...item, quantity: newQuantity } : item));
      
      // Usually backend would have a PATCH /api/cart/:id
      // but if not, we can just fetch the whole cart again after a dummy delay or actual implementation
      // For now, let's assume we can just update it locally as the server implementation might vary
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, notify }}>
      {children}
      {notification && (
        <div className="fixed bottom-8 right-8 z-[100] animate-in fade-in slide-in-from-right-10 duration-300">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${
            notification.type === 'error' 
              ? 'bg-red-50 border-red-200 text-red-700' 
              : 'bg-[#154212] border-primary/20 text-white'
          }`}>
            <span className="material-symbols-outlined fill-1">
              {notification.type === 'error' ? 'error' : 'check_circle'}
            </span>
            <span className="font-bold tracking-tight">{notification.message}</span>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
