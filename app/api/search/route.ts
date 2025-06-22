import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Sample data for demo when database is empty
function getSampleSearchResults(query: string) {
  const sampleItems = [
    {
      id: 'sample-1',
      name: 'Homemade Chicken Biryani',
      description: 'Authentic Hyderabadi style biryani with tender chicken and aromatic basmati rice',
      price: 180,
      cuisine_type: 'Indian',
      cook_name: 'Priya Sharma',
      location: 'Near IIT Delhi'
    },
    {
      id: 'sample-2',
      name: 'Butter Chicken with Naan',
      description: 'Creamy and rich butter chicken served with fresh homemade naan',
      price: 160,
      cuisine_type: 'North Indian',
      cook_name: 'Rajesh Kumar',
      location: 'DU North Campus'
    },
    {
      id: 'sample-3',
      name: 'South Indian Thali',
      description: 'Complete meal with sambar, rasam, vegetables, rice, and curd',
      price: 120,
      cuisine_type: 'South Indian',
      cook_name: 'Lakshmi Nair',
      location: 'Munirka'
    },
    {
      id: 'sample-4',
      name: 'Pasta Arrabiata',
      description: 'Spicy Italian pasta in tomato and chili sauce',
      price: 140,
      cuisine_type: 'Italian',
      cook_name: 'Maria Fernandez',
      location: 'Karol Bagh'
    },
    {
      id: 'sample-5',
      name: 'Rajma Chawal',
      description: 'Comfort food - kidney beans curry with steamed rice',
      price: 100,
      cuisine_type: 'North Indian',
      cook_name: 'Sunita Devi',
      location: 'Lajpat Nagar'
    },
    {
      id: 'sample-6',
      name: 'Chole Bhature',
      description: 'Spicy chickpea curry with fluffy deep-fried bread',
      price: 80,
      cuisine_type: 'Punjabi',
      cook_name: 'Harpreet Singh',
      location: 'Punjabi Bagh'
    },
    {
      id: 'sample-7',
      name: 'Chinese Fried Rice',
      description: 'Wok-tossed rice with vegetables and Indo-Chinese flavors',
      price: 90,
      cuisine_type: 'Chinese',
      cook_name: 'Wong Li',
      location: 'Mayur Vihar'
    },
    {
      id: 'sample-8',
      name: 'Masala Dosa',
      description: 'Crispy South Indian crepe with spiced potato filling',
      price: 70,
      cuisine_type: 'South Indian',
      cook_name: 'Venkat Reddy',
      location: 'CR Park'
    }
  ];

  // Filter based on query
  const filteredItems = sampleItems.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase()) ||
    item.cuisine_type.toLowerCase().includes(query.toLowerCase())
  );

  // Format for search results
  return filteredItems.map(item => ({
    id: item.id,
    title: item.name,
    subtitle: `₹${item.price} • ${item.cuisine_type} • ${item.cook_name}`,
    description: item.description,
    type: 'menu_item',
    href: `/item/${item.id}`,
    price: item.price,
    rating: 4.5,
    cuisine: item.cuisine_type,
    cook_name: item.cook_name,
    location: item.location
  }));
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query || query.trim().length < 2) {
      return NextResponse.json([]);
    }

    // Create Supabase client
    const supabase = await createClient();

    // Search for menu items with cook information using the correct table structure
    const { data: items, error } = await supabase
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
        cooks (
          first_name,
          last_name,
          region,
          rating,
          isAvailable
        )
      `)
      .eq('is_available', true)
      .or(`item_name.ilike.%${query}%,description.ilike.%${query}%,dietary_type.ilike.%${query}%,category.ilike.%${query}%,meal_type.ilike.%${query}%`)
      .limit(limit);

    console.log('Menu search result:', { items, error });

    // Also search for cooks directly
    const { data: cooks, error: cookError } = await supabase
      .from('cooks')
      .select(`
        id,
        first_name,
        last_name,
        region,
        rating,
        description,
        cuisineType,
        isAvailable
      `)
      .eq('isAvailable', true)
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,description.ilike.%${query}%,region.ilike.%${query}%`)
      .limit(Math.floor(limit / 2));

    console.log('Cook search result:', { cooks, cookError });

    if (error) {
      console.error('Search error:', error);
      return NextResponse.json([]);
    }

    // If no results from database, return some sample data for demo
    if ((!items || items.length === 0) && (!cooks || cooks.length === 0)) {
      const sampleResults = getSampleSearchResults(query);
      return NextResponse.json(sampleResults);
    }

    // Format menu item results
    const itemResults = (items || []).map((item: any) => ({
      id: item.id,
      title: item.item_name,
      subtitle: `₹${item.price} • ${item.dietary_type || 'Mixed'} • ${item.cooks.first_name} ${item.cooks.last_name}`,
      description: item.description,
      type: 'menu_item',
      href: `/item/${item.id}`,
      price: parseFloat(item.price),
      rating: parseFloat(item.cooks.rating) || 4.0,
      cuisine: item.dietary_type || item.meal_type || 'Mixed',
      cook_name: `${item.cooks.first_name} ${item.cooks.last_name}`,
      location: item.cooks.region
    }));

    // Format cook results
    const cookResults = (cooks || []).map((cook: any) => ({
      id: cook.id,
      title: `${cook.first_name} ${cook.last_name}`,
      subtitle: `Cook • ${cook.region} • ${parseFloat(cook.rating) || 4.0}⭐`,
      description: cook.description || `Specializes in ${Array.isArray(cook.cuisineType) ? cook.cuisineType.join(', ') : (cook.cuisineType || 'Various cuisines')}`,
      type: 'cook',
      href: `/cooks/${cook.id}`,
      rating: parseFloat(cook.rating) || 4.0,
      cook_name: `${cook.first_name} ${cook.last_name}`,
      location: cook.region,
      cuisine: Array.isArray(cook.cuisineType) ? cook.cuisineType.join(', ') : (cook.cuisineType || 'Various')
    }));

    // Combine and return results
    const allResults = [...cookResults, ...itemResults];
    return NextResponse.json(allResults);

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query, location } = await request.json();

    if (!query || query.trim().length < 2) {
      return NextResponse.json([]);
    }

    const supabase = await createClient();

    let searchQuery = supabase
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
          rating,
          isAvailable
        )
      `)
      .eq('is_available', true)
      .eq('cooks.isAvailable', true)
      .or(`item_name.ilike.%${query}%,description.ilike.%${query}%,dietary_type.ilike.%${query}%,category.ilike.%${query}%,meal_type.ilike.%${query}%,cooks.first_name.ilike.%${query}%,cooks.last_name.ilike.%${query}%`)
      .limit(10);

    // Add location filter if provided
    if (location) {
      searchQuery = searchQuery.ilike('cooks.region', `%${location}%`);
    }

    const { data: items, error } = await searchQuery;

    if (error) {
      console.error('Search error:', error);
      return NextResponse.json([]);
    }

    const results = (items || []).map((item: any) => ({
      id: item.id,
      title: item.item_name,
      subtitle: `₹${item.price} • ${item.dietary_type || 'Mixed'} • ${item.cooks.first_name} ${item.cooks.last_name}`,
      description: item.description,
      type: 'menu_item',
      href: `/item/${item.id}`,
      price: parseFloat(item.price),
      rating: parseFloat(item.cooks.rating) || 4.0,
      cuisine: item.dietary_type || item.meal_type || 'Mixed',
      cook_name: `${item.cooks.first_name} ${item.cooks.last_name}`,
      location: item.cooks.region
    }));

    return NextResponse.json(results);

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json([]);
  }
}
