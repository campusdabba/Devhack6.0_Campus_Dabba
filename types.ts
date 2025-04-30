export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
  created_at: string;
  profile_image: string | null;
  address: string | null;
  user_preferences: any | null;
}

export interface Order {
  id: string;
  user_id: string;
  cook_id: string;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  total_amount: number;
  created_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  dabba_id: string;
  quantity: number;
  price: number;
}

export interface Dabba {
  id: string;
  cook_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_available: boolean;
  created_at: string;
}

export interface Cook {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  address: string;
  profile_image: string | null;
  rating: number;
  created_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  user_id: string;
  amount: number;
  payment_method: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
} 