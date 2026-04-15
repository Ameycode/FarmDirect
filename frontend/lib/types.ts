export type UserRole = 'FARMER' | 'BUYER';

export interface User {
  id: number;
  phone: string;
  name: string;
  role: UserRole;
  language: string;
  avatar: string | null;
  is_verified: boolean;
  created_at: string;
}

export interface FarmProfile {
  id: number;
  farm_name: string;
  description: string;
  address: string;
  village: string;
  district: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  delivery_radius_km: number;
  phone: string;
  avatar: string | null;
  cover_image: string | null;
  is_verified: boolean;
  is_active: boolean;
  rating: number;
  total_reviews: number;
  owner_name: string;
  owner_phone: string;
  distance_km: number | null;
  product_count: number;
  created_at: string;
}

export interface Product {
  id: number;
  farm_id: number;
  farm_name: string;
  farmer_name: string;
  farm_district: string;
  name: string;
  description: string;
  category: string;
  price: number;
  is_negotiable: boolean;
  min_price: number | null;
  quantity: number;
  unit: string;
  harvest_date: string | null;
  is_organic: boolean;
  is_available: boolean;
  image_url: string;
  display_image: string | null;
  created_at: string;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  negotiated_price: number | null;
  subtotal: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total: number;
}

export interface OrderItem {
  id: number;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  buyer_name: string;
  buyer_phone: string;
  farm_name: string;
  status: string;
  delivery_type: 'DELIVERY' | 'PICKUP';
  payment_method: 'COD' | 'UPI';
  delivery_address: string;
  total: number;
  notes: string;
  scheduled_at: string | null;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export type NegotiationStatus = 'ACTIVE' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
export type MessageType = 'TEXT' | 'OFFER' | 'COUNTER' | 'ACCEPT' | 'REJECT' | 'SYSTEM';

export interface NegotiationMessage {
  id: number;
  sender: number;
  sender_name: string;
  sender_role: UserRole;
  message: string;
  price_offer: number | null;
  message_type: MessageType;
  created_at: string;
}

export interface NegotiationLastMessage {
  message: string;
  sender_name: string;
  message_type: MessageType;
  price_offer: string | null;
  created_at: string;
}

export interface Negotiation {
  id: number;
  buyer_name: string;
  buyer_phone: string;
  farmer_name: string;
  product_name: string;
  product_image: string | null;
  product_price: number;
  product_unit: string;
  product_min_price: number | null;
  farm_name: string;
  farm_id: number;
  status: NegotiationStatus;
  initial_offer: number | null;
  final_price: number | null;
  latest_offer: number | null;
  last_message: NegotiationLastMessage | null;
  message_count: number;
  messages?: NegotiationMessage[];
  created_at: string;
  updated_at: string;
}
