import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createEnhancedChatbot } from '@/lib/enhanced-ai';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = await createClient();
    
    // Get user session
    const { data: { session } } = await supabase.auth.getSession();

    let userId: string | undefined;
    let userRole: string | undefined;

    if (session?.user) {
      userId = session.user.id;
      
      // Get user role from the users table first
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (!userError && userData?.role) {
        userRole = userData.role;
      } else {
        // If not found in users table, check if they're a cook
        const { data: cookData, error: cookError } = await supabase
          .from('cooks')
          .select('id')
          .eq('id', userId)
          .single();

        if (!cookError && cookData) {
          userRole = 'cook';
        } else {
          // Default to customer if authenticated but no specific role found
          userRole = 'customer';
        }
      }
    }

    // Create enhanced chatbot with full database context
    const chatbot = await createEnhancedChatbot(userId, userRole);
    
    // Handle initialization request
    if (message === '__INIT__') {
      return NextResponse.json({
        response: chatbot.getWelcomeMessage(),
        quickActions: chatbot.getQuickActions(),
        context: {
          userType: userRole || 'guest',
          authenticated: !!session?.user,
          hasContext: !!userId
        },
        timestamp: new Date().toISOString()
      });
    }

    // Regular message processing
    const response = await chatbot.sendMessage(message);

    return NextResponse.json({
      response,
      quickActions: chatbot.getQuickActions(),
      context: {
        userType: userRole || 'guest',
        authenticated: !!session?.user,
        hasContext: !!userId
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Chat API Error:', error);
    
    // Return different error messages for guests vs logged-in users
    try {
      const errorSupabase = await createClient();
      const { data: { session } } = await errorSupabase.auth.getSession();
      const isGuest = !session?.user;
      
      return NextResponse.json(
        { 
          error: 'Failed to process chat message',
          response: isGuest 
            ? `Welcome to Campus Dabba! 🍽️ 

I'm your AI food assistant, though I'm having a small technical hiccup right now.

**While I get back on track, here's what we offer:**
• Authentic homemade meals from verified cooks
• Location-based cook discovery  
• Affordable student-friendly prices
• Real-time order tracking

**Try asking me:**
• "How does Campus Dabba work?"
• "Show me popular dishes"
• "How do I sign up?"

Please try again in a moment! 😊`
            : "I'm experiencing some technical difficulties. Please try again in a moment! 😅"
        },
        { status: 500 }
      );
    } catch (sessionError) {
      // If we can't even check session, assume guest
      return NextResponse.json(
        { 
          error: 'Failed to process chat message',
          response: `Welcome to Campus Dabba! 🍽️ 

I'm your AI food assistant, though I'm having a small technical hiccup right now.

Please try again in a moment! 😊`
        },
        { status: 500 }
      );
    }
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Enhanced AI Chat API is working',
    timestamp: new Date().toISOString(),
    features: [
      'Real-time database context',
      'Personalized recommendations',
      'Smart search integration',
      'Role-based responses'
    ]
  });
}
