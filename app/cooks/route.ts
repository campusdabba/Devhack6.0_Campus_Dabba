import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/client';

export async function GET(request: Request) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    // Get single cook with menu items
  const { data: cook, error: cookError } = await supabase
    .from('cooks')
    .select('*')
      .eq('id', id)
    .single();

  if (cookError) {
    return NextResponse.json({ error: cookError.message }, { status: 500 });
  }

  const { data: menuItems, error: menuError } = await supabase
    .from('dabba_menu')
    .select('*')
      .eq('cook_id', id);

  if (menuError) {
    return NextResponse.json({ error: menuError.message }, { status: 500 });
  }

  return NextResponse.json({ cook, menuItems });
  } else {
    // Get all cooks
    const { data: cooks, error } = await supabase
      .from('cooks')
      .select('*');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ cooks });
  }
}