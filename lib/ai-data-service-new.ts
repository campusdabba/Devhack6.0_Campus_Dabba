import { createClient } from '@/utils/supabase/client';

export interface UserData {
  id: string;
  email: string;
  role: 'student' | 'cook' | 'admin';
  profile: any;
  location?: string;
  preferences?: string[];
}

export interface OrderData {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  cook_name?: string;
  items: any[];
  delivery_address?: string;
}

export interface CookData {
  id: string;
  name: string;
  specialties: string[];
  rating: number;
  location: string;
  is_verified: boolean;
  is_available: boolean;
  menu_items?: any[];
}

export interface MenuItemData {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  cuisine_type: string;
  is_available: boolean;
  cook_id: string;
  cook_name?: string;
}

export interface AIContext {
  user: UserData | null;
  recentOrders: OrderData[];
  availableCooks: CookData[];
  popularItems: MenuItemData[];
  userPreferences: string[];
  location: string | null;
  currentWeather?: string;
  timeOfDay: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export class AIDataService {
  private supabase = createClient();

  async getUserData(userId: string): Promise<UserData | null> {
    try {
      const { data: user, error: userError } = await this.supabase
        .from('users')
        .select('id, email, role')
        .eq('id', userId)
        .single();

      if (userError || !user) return null;

      return {
        id: user.id,
        email: user.email,
        role: user.role,
        profile: null, // Simplified for now
        location: undefined, // Could be extracted from other tables
        preferences: [] // Could be extracted from other tables
      };
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }

  async getRecentOrders(userId: string, limit: number = 5): Promise<OrderData[]> {
    try {
      // For now, return empty as the orders table structure isn't clear
      // This would need to be implemented based on actual order schema
      return [];
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      return [];
    }
  }

  async getAvailableCooks(location?: string, limit: number = 10): Promise<CookData[]> {
    try {
      let query = this.supabase
        .from('cooks')
        .select(`
          id,
          first_name,
          last_name,
          cuisineType,
          rating,
          region,
          isAvailable,
          dabba_menu (
            id,
            item_name,
            price,
            dietary_type,
            is_available
          )
        `)
        .eq('isAvailable', true)
        .order('rating', { ascending: false })
        .limit(limit);

      if (location) {
        query = query.ilike('region', `%${location}%`);
      }

      const { data: cooks, error } = await query;

      if (error || !cooks) {
        console.error('Error fetching cooks:', error);
        return [];
      }

      return cooks.map(cook => ({
        id: cook.id,
        name: `${cook.first_name} ${cook.last_name}`,
        specialties: Array.isArray(cook.cuisineType) ? cook.cuisineType : (cook.cuisineType ? [cook.cuisineType] : []),
        rating: parseFloat(cook.rating) || 0,
        location: cook.region,
        is_verified: true, // Assuming all cooks in the system are verified
        is_available: cook.isAvailable,
        menu_items: cook.dabba_menu?.filter((item: any) => item.is_available) || []
      }));
    } catch (error) {
      console.error('Error fetching available cooks:', error);
      return [];
    }
  }

  async getPopularItems(location?: string, limit: number = 20): Promise<MenuItemData[]> {
    try {
      let query = this.supabase
        .from('dabba_menu')
        .select(`
          id,
          item_name,
          description,
          price,
          category,
          dietary_type,
          meal_type,
          is_available,
          cook_id,
          cooks!inner (
            first_name,
            last_name,
            region,
            isAvailable
          )
        `)
        .eq('is_available', true)
        .eq('cooks.isAvailable', true)
        .order('price', { ascending: true }) // Order by price for now, could be improved with popularity metrics
        .limit(limit);

      if (location) {
        query = query.ilike('cooks.region', `%${location}%`);
      }

      const { data: items, error } = await query;

      if (error || !items) {
        console.error('Error fetching menu items:', error);
        return [];
      }

      return items.map((item: any) => ({
        id: item.id,
        name: item.item_name,
        description: item.description,
        price: parseFloat(item.price),
        category: item.category || item.meal_type || 'General',
        cuisine_type: item.dietary_type || 'Mixed',
        is_available: item.is_available,
        cook_id: item.cook_id,
        cook_name: `${item.cooks.first_name} ${item.cooks.last_name}`
      }));
    } catch (error) {
      console.error('Error fetching popular items:', error);
      return [];
    }
  }

  async searchMenuItems(query: string, location?: string, limit: number = 15): Promise<MenuItemData[]> {
    try {
      let searchQuery = this.supabase
        .from('dabba_menu')
        .select(`
          id,
          item_name,
          description,
          price,
          category,
          dietary_type,
          meal_type,
          is_available,
          cook_id,
          cooks!inner (
            first_name,
            last_name,
            region,
            isAvailable
          )
        `)
        .eq('is_available', true)
        .eq('cooks.isAvailable', true)
        .or(`item_name.ilike.%${query}%,description.ilike.%${query}%,dietary_type.ilike.%${query}%,category.ilike.%${query}%,meal_type.ilike.%${query}%`)
        .limit(limit);

      if (location) {
        searchQuery = searchQuery.ilike('cooks.region', `%${location}%`);
      }

      const { data: items, error } = await searchQuery;

      if (error || !items) {
        console.error('Error searching menu items:', error);
        return [];
      }

      return items.map((item: any) => ({
        id: item.id,
        name: item.item_name,
        description: item.description,
        price: parseFloat(item.price),
        category: item.category || item.meal_type || 'General',
        cuisine_type: item.dietary_type || 'Mixed',
        is_available: item.is_available,
        cook_id: item.cook_id,
        cook_name: `${item.cooks.first_name} ${item.cooks.last_name}`
      }));
    } catch (error) {
      console.error('Error searching menu items:', error);
      return [];
    }
  }

  private getTimeOfDay(): 'breakfast' | 'lunch' | 'dinner' | 'snack' {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 11) return 'breakfast';
    if (hour >= 11 && hour < 16) return 'lunch';
    if (hour >= 16 && hour < 22) return 'dinner';
    return 'snack';
  }

  async buildAIContext(userId?: string, location?: string): Promise<AIContext> {
    try {
      console.log('Building AI context for user:', userId, 'location:', location);

      const [
        userData,
        recentOrders,
        availableCooks,
        popularItems
      ] = await Promise.all([
        userId ? this.getUserData(userId) : null,
        userId ? this.getRecentOrders(userId) : [],
        this.getAvailableCooks(location, 8),
        this.getPopularItems(location, 15)
      ]);

      const context = {
        user: userData,
        recentOrders,
        availableCooks,
        popularItems,
        userPreferences: userData?.preferences || [],
        location: location || null,
        timeOfDay: this.getTimeOfDay()
      };

      console.log('AI context built:', {
        userFound: !!userData,
        cooksCount: availableCooks.length,
        itemsCount: popularItems.length,
        timeOfDay: context.timeOfDay
      });

      return context;
    } catch (error) {
      console.error('Error building AI context:', error);
      return {
        user: null,
        recentOrders: [],
        availableCooks: [],
        popularItems: [],
        userPreferences: [],
        location: null,
        timeOfDay: this.getTimeOfDay()
      };
    }
  }
}
