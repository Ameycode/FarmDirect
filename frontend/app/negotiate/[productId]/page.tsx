'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft, Send, Loader2, Leaf, MessageCircle, ShoppingCart,
  CheckCircle, XCircle, Tag, TrendingDown, Sparkles, HandCoins,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { productsAPI, negotiationsAPI, cartAPI } from '@/lib/api';
import { useAuthStore, useCartStore } from '@/lib/store';
import toast from 'react-hot-toast';
import type { Product, NegotiationMessage, Negotiation } from '@/lib/types';

export default function NegotiatePage() {
  const params = useParams();
  const productId = Number(params.productId);
  const router = useRouter();
  const { user } = useAuthStore();
  const { setCart } = useCartStore();

  const [negotiation, setNegotiation] = useState<Negotiation | null>(null);
  const [messages, setMessages] = useState<NegotiationMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [offerPrice, setOfferPrice] = useState<number>(0);
  const [showOfferPanel, setShowOfferPanel] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastPollTime = useRef<string | null>(null);

  useEffect(() => {
    if (!user) { router.push('/auth'); return; }
  }, [user, router]);

  // Fetch product
  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productsAPI.get(productId).then((r) => r.data),
    enabled: !!productId,
  });

  // Check for existing negotiation
  useEffect(() => {
    if (!user || !productId) return;
    negotiationsAPI.list('ACTIVE').then(({ data }) => {
      const existing = (data as Negotiation[]).find(
        (n) => n.product_name === product?.name && n.status === 'ACTIVE'
      );
      if (existing) {
        negotiationsAPI.detail(existing.id).then(({ data: detail }) => {
          setNegotiation(detail);
          setMessages(detail.messages || []);
        });
      }
    }).catch(() => { /* no existing negotiation */ });
  }, [user, productId, product?.name]);

  // Set initial offer price from product
  useEffect(() => {
    if (product) {
      const suggested = product.min_price
        ? Math.round((product.price + product.min_price) / 2)
        : Math.round(product.price * 0.85);
      setOfferPrice(suggested);
    }
  }, [product]);

  // Poll for new messages
  useEffect(() => {
    if (!negotiation || negotiation.status !== 'ACTIVE') return;

    const interval = setInterval(async () => {
      try {
        const { data } = await negotiationsAPI.poll(
          negotiation.id,
          lastPollTime.current || undefined
        );
        if (data.messages && data.messages.length > 0) {
          setMessages(prev => {
            const existingIds = new Set(prev.map((m: NegotiationMessage) => m.id));
            const newMsgs = data.messages.filter((m: NegotiationMessage) => !existingIds.has(m.id));
            return newMsgs.length > 0 ? [...prev, ...newMsgs] : prev;
          });
          lastPollTime.current = data.messages[data.messages.length - 1].created_at;
        }
        // Check if negotiation status changed
        if (data.status !== negotiation.status) {
          setNegotiation(prev => prev ? {
            ...prev,
            status: data.status,
            final_price: data.final_price ? parseFloat(data.final_price) : null,
          } : null);
        }
      } catch {
        // Silently fail polling
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [negotiation]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleStartNegotiation = async () => {
    if (!product || !offerPrice) return;
    setIsStarting(true);
    try {
      const { data } = await negotiationsAPI.start(productId, offerPrice, inputText);
      setNegotiation(data);
      setMessages(data.messages || []);
      setInputText('');
      setShowOfferPanel(false);
      if (data.messages?.length > 0) {
        lastPollTime.current = data.messages[data.messages.length - 1].created_at;
      }
      toast.success('Negotiation started!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Could not start negotiation');
    } finally {
      setIsStarting(false);
    }
  };

  const handleSendMessage = async () => {
    if (!negotiation || (!inputText.trim() && !showOfferPanel)) return;
    setIsSending(true);
    try {
      const payload: { message?: string; price_offer?: number; message_type: string } = {
        message_type: showOfferPanel && offerPrice ? 'OFFER' : 'TEXT',
      };
      if (inputText.trim()) payload.message = inputText.trim();
      if (showOfferPanel && offerPrice) payload.price_offer = offerPrice;

      const { data: msg } = await negotiationsAPI.sendMessage(negotiation.id, payload);
      setMessages(prev => [...prev, msg]);
      lastPollTime.current = msg.created_at;
      setInputText('');
      setShowOfferPanel(false);
    } catch {
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleAccept = async () => {
    if (!negotiation) return;
    try {
      const { data } = await negotiationsAPI.accept(negotiation.id);
      setNegotiation(data);
      setMessages(data.messages || []);
      toast.success('Offer accepted!');
    } catch {
      toast.error('Failed to accept');
    }
  };

  const handleReject = async () => {
    if (!negotiation) return;
    try {
      const { data } = await negotiationsAPI.reject(negotiation.id);
      setNegotiation(data);
      setMessages(data.messages || []);
      toast('Negotiation closed');
    } catch {
      toast.error('Failed to close negotiation');
    }
  };

  const handleAddToCartNegotiated = async () => {
    if (!product || !negotiation?.final_price) return;
    setAddingToCart(true);
    try {
      const { data } = await cartAPI.add(product.id, 1, negotiation.final_price);
      setCart(data);
      toast.success(`Added to cart at ₹${negotiation.final_price}!`);
      router.push('/cart');
    } catch {
      toast.error('Could not add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const getSuggestions = useCallback((product: Product) => {
    const base = product.price;
    const min = product.min_price || base * 0.6;
    const range = base - min;
    return [
      { label: '10% off', price: Math.round(base * 0.9) },
      { label: '15% off', price: Math.round(base * 0.85) },
      { label: '20% off', price: Math.round(base * 0.8) },
    ].filter(s => s.price >= min);
  }, []);

  if (productLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  const isAccepted = negotiation?.status === 'ACCEPTED';
  const isRejected = negotiation?.status === 'REJECTED';
  const isClosed = isAccepted || isRejected;

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => router.back()} className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="relative w-10 h-10 bg-green-50 rounded-xl overflow-hidden shrink-0">
              {product.display_image ? (
                <Image src={product.display_image} alt={product.name} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-green-300" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-black text-green-900 truncate">{product.name}</h1>
              <p className="text-xs text-gray-500 truncate">
                {product.farm_name} · ₹{product.price}/{product.unit}
              </p>
            </div>
          </div>
          {negotiation && (
            <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide ${
              isAccepted ? 'bg-green-100 text-green-700' :
              isRejected ? 'bg-red-100 text-red-600' :
              'bg-amber-100 text-amber-700'
            }`}>
              {negotiation.status}
            </div>
          )}
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {/* Product Info Card (show before negotiation starts) */}
        {!negotiation && (
          <div className="mx-auto max-w-md">
            {/* Product Detail Card */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm mb-4">
              <div className="relative h-40 bg-gradient-to-br from-green-50 to-emerald-100">
                {product.display_image ? (
                  <Image src={product.display_image} alt={product.name} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Leaf className="w-12 h-12 text-green-200" />
                  </div>
                )}
                {product.is_organic && (
                  <span className="absolute top-3 left-3 bg-green-600 text-white text-[10px] font-black px-2 py-1 rounded-lg">
                    🌿 ORGANIC
                  </span>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-lg font-black text-green-900 mb-1">{product.name}</h2>
                <p className="text-sm text-gray-500 mb-3">{product.farm_name}</p>
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-green-50 rounded-xl px-3 py-2">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Listed Price</p>
                    <p className="text-lg font-black text-green-700">₹{product.price}<span className="text-xs text-gray-400">/{product.unit}</span></p>
                  </div>
                  {product.min_price && (
                    <div className="bg-amber-50 rounded-xl px-3 py-2">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Min Price</p>
                      <p className="text-lg font-black text-amber-600">₹{product.min_price}<span className="text-xs text-gray-400">/{product.unit}</span></p>
                    </div>
                  )}
                </div>
                {product.quantity > 0 && (
                  <p className="text-xs text-gray-400">{product.quantity} {product.unit} available</p>
                )}
              </div>
            </div>

            {/* Offer Section */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <HandCoins className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-green-900 text-sm">Make Your Offer</h3>
                  <p className="text-[10px] text-gray-400">Start negotiating the best price</p>
                </div>
              </div>

              {/* Quick Suggestions */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                {getSuggestions(product).map((s) => (
                  <button
                    key={s.label}
                    onClick={() => setOfferPrice(s.price)}
                    className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      offerPrice === s.price
                        ? 'bg-green-700 text-white shadow-lg shadow-green-200'
                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}
                  >
                    <TrendingDown className="w-3 h-3 inline mr-1" />
                    ₹{s.price} ({s.label})
                  </button>
                ))}
              </div>

              {/* Custom Price Input */}
              <div className="relative mb-4">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700 font-black text-lg">₹</span>
                <input
                  type="number"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 bg-green-50 border-2 border-green-200 rounded-xl text-lg font-black text-green-900 focus:border-green-500 focus:ring-0 outline-none transition-colors"
                  placeholder="Enter your offer"
                  min={product.min_price || 1}
                  max={product.price}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-bold">
                  /{product.unit}
                </span>
              </div>

              {/* Savings indicator */}
              {offerPrice > 0 && offerPrice < product.price && (
                <div className="bg-emerald-50 rounded-xl p-3 mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-700">
                    You save ₹{(product.price - offerPrice).toFixed(0)}/{product.unit}
                    <span className="text-emerald-500 font-semibold ml-1">
                      ({((1 - offerPrice / product.price) * 100).toFixed(0)}% off)
                    </span>
                  </span>
                </div>
              )}

              {/* Optional message */}
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Add a message (optional)..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 resize-none focus:border-green-400 focus:ring-0 outline-none mb-4"
                rows={2}
              />

              <button
                onClick={handleStartNegotiation}
                disabled={isStarting || offerPrice <= 0}
                className="w-full bg-gradient-to-r from-green-700 to-emerald-600 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:from-green-800 hover:to-emerald-700 transition-all disabled:opacity-50 shadow-lg shadow-green-200"
              >
                {isStarting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4" /> Send Offer — ₹{offerPrice}/{product.unit}
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        {negotiation && messages.map((msg) => {
          const isMine = msg.sender === user?.id;
          const isSystem = msg.message_type === 'ACCEPT' || msg.message_type === 'REJECT' || msg.message_type === 'SYSTEM';

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center">
                <div className={`px-4 py-2.5 rounded-2xl text-xs font-bold text-center max-w-[85%] ${
                  msg.message_type === 'ACCEPT'
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-600 border border-red-100'
                }`}>
                  {msg.message}
                </div>
              </div>
            );
          }

          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${isMine ? 'order-2' : 'order-1'}`}>
                {/* Sender name */}
                <p className={`text-[10px] font-bold text-gray-400 mb-1 ${isMine ? 'text-right' : 'text-left'}`}>
                  {isMine ? 'You' : msg.sender_name}
                </p>
                <div className={`rounded-2xl px-4 py-3 ${
                  isMine
                    ? 'bg-green-700 text-white rounded-br-md'
                    : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-md'
                }`}>
                  {/* Price offer badge */}
                  {msg.price_offer && (
                    <div className={`flex items-center gap-1.5 mb-2 pb-2 border-b ${
                      isMine ? 'border-green-600' : 'border-gray-100'
                    }`}>
                      <Tag className="w-3.5 h-3.5" />
                      <span className="text-sm font-black">
                        {msg.message_type === 'COUNTER' ? 'Counter: ' : 'Offer: '}
                        ₹{msg.price_offer}/{product.unit}
                      </span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed">{msg.message}</p>
                  <p className={`text-[9px] mt-1.5 ${isMine ? 'text-green-300' : 'text-gray-400'}`}>
                    {new Date(msg.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Actions */}
      {negotiation && (
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-lg border-t border-gray-100 px-4 py-3 shadow-lg">
          {/* Accepted State */}
          {isAccepted && (
            <div className="space-y-3">
              <div className="bg-green-50 rounded-xl p-3 flex items-center gap-3 border border-green-200">
                <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
                <div>
                  <p className="text-sm font-black text-green-800">Deal Accepted!</p>
                  <p className="text-xs text-green-600">Final price: ₹{negotiation.final_price}/{product.unit}</p>
                </div>
              </div>
              <button
                onClick={handleAddToCartNegotiated}
                disabled={addingToCart}
                className="w-full bg-gradient-to-r from-green-700 to-emerald-600 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:from-green-800 hover:to-emerald-700 transition-all shadow-lg shadow-green-200"
              >
                {addingToCart ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" /> Add to Cart at ₹{negotiation.final_price}/{product.unit}
                  </>
                )}
              </button>
            </div>
          )}

          {/* Rejected State */}
          {isRejected && (
            <div className="bg-red-50 rounded-xl p-3 flex items-center gap-3 border border-red-200">
              <XCircle className="w-6 h-6 text-red-500 shrink-0" />
              <div>
                <p className="text-sm font-black text-red-700">Negotiation Closed</p>
                <p className="text-xs text-red-500">You can still add to cart at the original price</p>
              </div>
            </div>
          )}

          {/* Active — Chat Input */}
          {!isClosed && (
            <div className="space-y-2">
              {/* Offer toggle panel */}
              {showOfferPanel && (
                <div className="bg-green-50 rounded-xl p-3 border border-green-100 flex items-center gap-3">
                  <Tag className="w-4 h-4 text-green-600 shrink-0" />
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-green-700 font-black text-sm">₹</span>
                    <input
                      type="number"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(Number(e.target.value))}
                      className="flex-1 bg-white border border-green-200 rounded-lg px-3 py-1.5 text-sm font-bold text-green-900 focus:border-green-500 outline-none w-20"
                      min={product.min_price || 1}
                    />
                    <span className="text-xs text-gray-400 font-bold">/{product.unit}</span>
                  </div>
                  <button onClick={() => setShowOfferPanel(false)} className="text-xs text-gray-400 font-bold hover:text-gray-600">✕</button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowOfferPanel(!showOfferPanel)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                    showOfferPanel
                      ? 'bg-green-700 text-white'
                      : 'bg-green-50 text-green-600 hover:bg-green-100'
                  }`}
                  title="Make Price Offer"
                >
                  <Tag className="w-4 h-4" />
                </button>
                <input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  placeholder={showOfferPanel ? 'Add a note with your offer...' : 'Type a message...'}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:border-green-400 outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isSending || (!inputText.trim() && !(showOfferPanel && offerPrice > 0))}
                  className="w-10 h-10 bg-green-700 text-white rounded-xl flex items-center justify-center hover:bg-green-800 transition-colors disabled:opacity-50 shrink-0"
                >
                  {isSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Quick actions for buyer */}
              {negotiation.latest_offer && user?.role === 'BUYER' && (
                <div className="flex gap-2">
                  <button
                    onClick={handleAccept}
                    className="flex-1 py-2 bg-green-50 text-green-700 rounded-xl text-xs font-bold hover:bg-green-100 transition-colors flex items-center justify-center gap-1"
                  >
                    <CheckCircle className="w-3 h-3" /> Accept Current Price
                  </button>
                  <button
                    onClick={handleReject}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
