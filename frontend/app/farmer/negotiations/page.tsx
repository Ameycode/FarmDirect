'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft, MessageCircle, Loader2, Leaf, CheckCircle, XCircle,
  Tag, Send, Clock, HandCoins, ChevronRight, User,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { negotiationsAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';
import type { Negotiation, NegotiationMessage } from '@/lib/types';

const STATUS_BADGE: Record<string, { color: string; label: string }> = {
  ACTIVE: { color: 'bg-amber-100 text-amber-700', label: 'Active' },
  ACCEPTED: { color: 'bg-green-100 text-green-700', label: 'Accepted' },
  REJECTED: { color: 'bg-red-100 text-red-600', label: 'Rejected' },
  EXPIRED: { color: 'bg-gray-100 text-gray-500', label: 'Expired' },
};

export default function FarmerNegotiationsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [filter, setFilter] = useState('ACTIVE');
  const [selected, setSelected] = useState<Negotiation | null>(null);
  const [messages, setMessages] = useState<NegotiationMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [counterPrice, setCounterPrice] = useState(0);
  const [showCounter, setShowCounter] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastPollTime = useRef<string | null>(null);

  useEffect(() => {
    if (!user) { router.push('/auth'); return; }
    if (user.role !== 'FARMER') { router.push('/discover'); }
  }, [user, router]);

  const { data: negotiations = [], isLoading, refetch } = useQuery({
    queryKey: ['farmer-negotiations', filter],
    queryFn: () => negotiationsAPI.list(filter === 'ALL' ? undefined : filter).then((r) => r.data),
    enabled: !!user && user.role === 'FARMER',
    refetchInterval: 5000,
  });

  // Load detail when selected
  useEffect(() => {
    if (!selected) return;
    negotiationsAPI.detail(selected.id).then(({ data }) => {
      setSelected(data);
      setMessages(data.messages || []);
      setCounterPrice(data.latest_offer || data.product_price);
      if (data.messages?.length > 0) {
        lastPollTime.current = data.messages[data.messages.length - 1].created_at;
      }
    });
  }, [selected?.id]);

  // Poll for new messages when chat is open
  useEffect(() => {
    if (!selected || selected.status !== 'ACTIVE') return;

    const interval = setInterval(async () => {
      try {
        const { data } = await negotiationsAPI.poll(
          selected.id,
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
        if (data.status !== selected.status) {
          setSelected(prev => prev ? {
            ...prev,
            status: data.status,
            final_price: data.final_price ? parseFloat(data.final_price) : null,
          } : null);
        }
      } catch { /* silent */ }
    }, 3000);

    return () => clearInterval(interval);
  }, [selected?.id, selected?.status]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAccept = async () => {
    if (!selected) return;
    try {
      const { data } = await negotiationsAPI.accept(selected.id);
      setSelected(data);
      setMessages(data.messages || []);
      toast.success('Offer accepted!');
      refetch();
    } catch {
      toast.error('Failed to accept');
    }
  };

  const handleReject = async () => {
    if (!selected) return;
    try {
      const { data } = await negotiationsAPI.reject(selected.id);
      setSelected(data);
      setMessages(data.messages || []);
      toast('Negotiation rejected');
      refetch();
    } catch {
      toast.error('Failed to reject');
    }
  };

  const handleSendMessage = async () => {
    if (!selected || (!inputText.trim() && !(showCounter && counterPrice > 0))) return;
    setIsSending(true);
    try {
      const payload: { message?: string; price_offer?: number; message_type: string } = {
        message_type: showCounter && counterPrice > 0 ? 'COUNTER' : 'TEXT',
      };
      if (inputText.trim()) payload.message = inputText.trim();
      if (showCounter && counterPrice > 0) payload.price_offer = counterPrice;

      const { data: msg } = await negotiationsAPI.sendMessage(selected.id, payload);
      setMessages(prev => [...prev, msg]);
      lastPollTime.current = msg.created_at;
      setInputText('');
      setShowCounter(false);
    } catch {
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  if (!user || user.role !== 'FARMER') return null;

  // Chat detail view
  if (selected) {
    const isClosed = selected.status === 'ACCEPTED' || selected.status === 'REJECTED';
    return (
      <div className="min-h-screen bg-amber-50 flex flex-col">
        {/* Chat Header */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 px-4 py-3">
            <button onClick={() => setSelected(null)} className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
              <ArrowLeft className="w-4 h-4 text-gray-600" />
            </button>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm font-black text-green-900 truncate">{selected.buyer_name}</h1>
                <p className="text-xs text-gray-500 truncate">
                  {selected.product_name} · ₹{selected.product_price}/{selected.product_unit}
                </p>
              </div>
            </div>
            <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide ${
              STATUS_BADGE[selected.status]?.color || 'bg-gray-100 text-gray-500'
            }`}>
              {STATUS_BADGE[selected.status]?.label || selected.status}
            </div>
          </div>
          {/* Offer summary bar */}
          {selected.latest_offer && (
            <div className="px-4 py-2 bg-amber-50 border-t border-amber-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Tag className="w-3.5 h-3.5 text-amber-600" />
                <span className="font-bold text-amber-800">
                  Latest Offer: ₹{selected.latest_offer}/{selected.product_unit}
                </span>
                <span className="text-amber-500 text-xs">
                  (Listed: ₹{selected.product_price})
                </span>
              </div>
            </div>
          )}
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map((msg) => {
            const isMine = msg.sender === user.id;
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
                <div className={`max-w-[80%]`}>
                  <p className={`text-[10px] font-bold text-gray-400 mb-1 ${isMine ? 'text-right' : 'text-left'}`}>
                    {isMine ? 'You' : msg.sender_name}
                  </p>
                  <div className={`rounded-2xl px-4 py-3 ${
                    isMine
                      ? 'bg-green-700 text-white rounded-br-md'
                      : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-bl-md'
                  }`}>
                    {msg.price_offer && (
                      <div className={`flex items-center gap-1.5 mb-2 pb-2 border-b ${
                        isMine ? 'border-green-600' : 'border-gray-100'
                      }`}>
                        <Tag className="w-3.5 h-3.5" />
                        <span className="text-sm font-black">
                          {msg.message_type === 'COUNTER' ? 'Counter: ' : 'Offer: '}
                          ₹{msg.price_offer}/{selected.product_unit}
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

        {/* Bottom Bar */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-lg border-t border-gray-100 px-4 py-3 shadow-lg">
          {/* Accepted */}
          {selected.status === 'ACCEPTED' && (
            <div className="bg-green-50 rounded-xl p-3 flex items-center gap-3 border border-green-200">
              <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
              <div>
                <p className="text-sm font-black text-green-800">Deal Accepted!</p>
                <p className="text-xs text-green-600">Final price: ₹{selected.final_price}/{selected.product_unit}</p>
              </div>
            </div>
          )}

          {/* Rejected */}
          {selected.status === 'REJECTED' && (
            <div className="bg-red-50 rounded-xl p-3 flex items-center gap-3 border border-red-200">
              <XCircle className="w-6 h-6 text-red-500 shrink-0" />
              <div>
                <p className="text-sm font-black text-red-700">Negotiation Closed</p>
              </div>
            </div>
          )}

          {/* Active */}
          {!isClosed && (
            <div className="space-y-2">
              {/* Counter price panel */}
              {showCounter && (
                <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 flex items-center gap-3">
                  <HandCoins className="w-4 h-4 text-amber-600 shrink-0" />
                  <div className="flex-1 flex items-center gap-2">
                    <span className="text-amber-700 font-black text-sm">₹</span>
                    <input
                      type="number"
                      value={counterPrice}
                      onChange={(e) => setCounterPrice(Number(e.target.value))}
                      className="flex-1 bg-white border border-amber-200 rounded-lg px-3 py-1.5 text-sm font-bold text-amber-900 focus:border-amber-500 outline-none w-20"
                    />
                    <span className="text-xs text-gray-400 font-bold">/{selected.product_unit}</span>
                  </div>
                  <button onClick={() => setShowCounter(false)} className="text-xs text-gray-400 font-bold hover:text-gray-600">✕</button>
                </div>
              )}

              {/* Accept / Reject row */}
              <div className="flex gap-2">
                <button
                  onClick={handleAccept}
                  className="flex-1 py-2.5 bg-green-700 text-white rounded-xl text-sm font-bold hover:bg-green-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" /> Accept ₹{selected.latest_offer}
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>

              {/* Chat input */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCounter(!showCounter)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                    showCounter
                      ? 'bg-amber-500 text-white'
                      : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                  }`}
                  title="Counter Offer"
                >
                  <HandCoins className="w-4 h-4" />
                </button>
                <input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  placeholder={showCounter ? 'Message with counter...' : 'Type a message...'}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:border-green-400 outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isSending || (!inputText.trim() && !(showCounter && counterPrice > 0))}
                  className="w-10 h-10 bg-green-700 text-white rounded-xl flex items-center justify-center hover:bg-green-800 transition-colors disabled:opacity-50 shrink-0"
                >
                  {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Negotiations List view
  return (
    <div className="min-h-screen bg-amber-50 pb-24">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-4 flex flex-col gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/farmer/dashboard" className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </Link>
          <h1 className="text-xl font-black text-green-900 flex-1 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" /> Negotiations
          </h1>
        </div>

        {/* Filters */}
        <div className="flex overflow-x-auto pb-2 gap-2 snap-x">
          {['ACTIVE', 'ACCEPTED', 'REJECTED', 'ALL'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`snap-start shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                filter === status
                  ? 'bg-green-700 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-28 animate-pulse border border-gray-100" />)}
          </div>
        ) : negotiations.length === 0 ? (
          <div className="text-center py-20">
            <MessageCircle className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-black text-gray-400 mb-2">No negotiations yet</h2>
            <p className="text-gray-400 text-sm">Buyers will negotiate prices with you here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {(negotiations as Negotiation[]).map((neg) => {
              const badge = STATUS_BADGE[neg.status] || STATUS_BADGE.ACTIVE;
              return (
                <button
                  key={neg.id}
                  onClick={() => setSelected(neg)}
                  className="w-full bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all text-left flex items-start gap-3"
                >
                  {/* Product image */}
                  <div className="relative w-14 h-14 bg-green-50 rounded-xl overflow-hidden shrink-0">
                    {neg.product_image ? (
                      <Image src={neg.product_image} alt={neg.product_name} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Leaf className="w-5 h-5 text-green-300" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="min-w-0">
                        <h3 className="font-black text-green-900 text-sm truncate">{neg.buyer_name}</h3>
                        <p className="text-xs text-gray-500 truncate">{neg.product_name}</p>
                      </div>
                      <span className={`shrink-0 text-[10px] font-black px-2 py-1 rounded-lg ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>

                    {/* Latest offer */}
                    <div className="flex items-center gap-2 mb-1">
                      {neg.latest_offer && (
                        <span className="text-sm font-black text-amber-600 flex items-center gap-1">
                          <Tag className="w-3 h-3" /> ₹{neg.latest_offer}
                        </span>
                      )}
                      <span className="text-xs text-gray-400 line-through">₹{neg.product_price}</span>
                    </div>

                    {/* Last message */}
                    {neg.last_message && (
                      <p className="text-xs text-gray-500 truncate">
                        {neg.last_message.sender_name}: {neg.last_message.message}
                      </p>
                    )}
                  </div>

                  <ChevronRight className="w-4 h-4 text-gray-300 shrink-0 mt-3" />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
