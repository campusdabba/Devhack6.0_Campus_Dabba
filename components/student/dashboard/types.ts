export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const dayMapping: Record<DayOfWeek, string> = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  7: "Sunday"
};

export interface MenuItem {
  id: string;
  cook_id: string;
  item_name: string;
  description: string;
  price: number;
  dietary_type: string;
  cuisine_type: string;
  meal_type: string;
  day_of_week: number;
  isAvailable: boolean;
  quantity: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
  menuItems?: MenuItem[];
}

export interface Cook {
  id: string;
  cook_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  description: string;
  address: string;
  profile_image: string;
  certification?: string;
  rating: number;
  totalOrders: number;
  isAvailable: boolean;
  region: string;
  totalorders: number;
  weeklySchedule?: string;
  cuisineType?: string;
  latitude?: number;
  longitude?: number;
  menuItems: MenuItem[];
  price?: number;
}

export interface ExtendedCook extends Omit<Cook, 'address'> {
  cook_id: string;
  first_name: string;
  last_name: string;
  profile_image: string;
  total_orders: number;
  certification?: string;
  menuItems: MenuItem[];
  address: string;
  created_at: string;
} 