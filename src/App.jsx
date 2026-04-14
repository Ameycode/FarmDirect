import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Marketplace from './Marketplace';
import AppleDetails from './AppleDetails';
import TomatoDetails from './TomatoDetails';
import GenericProductDetails from './GenericProductDetails';
import Cart from './Cart';
import Checkout from './Checkout';
import Profile from './Profile';
import Farmers from './Farmers';
import { CartProvider } from './CartContext';
import './App.css';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/product/apples" element={<AppleDetails />} />
          <Route path="/product/tomatoes" element={<TomatoDetails />} />
          <Route path="/product/:slug" element={<GenericProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/farmers" element={<Farmers />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
