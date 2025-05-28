export type DayOfWeek = "1" | "2" | "3" | "4" | "5" | "6" | "7";

export const dayMapping: Record<string, string> = {
  "1": "Monday",
  "2": "Tuesday",
  "3": "Wednesday",
  "4": "Thursday",
  "5": "Friday",
  "6": "Saturday",
  "7": "Sunday"
};

export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface MenuItem {
  id: string;
  cook_id: string;
  item_name: string;
  description: string;
  price: number;
  meal_type: string;
  dietary_type: string;
  day_of_week: DayOfWeek;
  created_at: string;
}

export interface CartItem extends Omit<MenuItem, 'created_at'> {
  quantity: number;
}

export interface Cook {
  id: string;
  cook_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  description: string;
  address: Address;
  profile_image: string;
  certification?: Record<string, any>;
  rating: number;
  totalorders: number;
  isAvailable: boolean;
  region: string;
  weeklySchedule?: Record<string, any>;
  cuisineType?: Record<string, any>;
  latitude?: string;
  longitude?: string;
  menuItems: MenuItem[];
}

export type ExtendedCook = Cook;