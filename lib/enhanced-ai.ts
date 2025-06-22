import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { aiDataService, AIContext } from './ai-data-service';

// Initialize Gemini AI with secure server-side API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

const model = genAI.getGenerativeModel({ 
  model: 'gemini-2.0-flash',
  safetySettings,
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048,
  }
});

export interface EnhancedChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: Partial<AIContext>;
}

export class EnhancedAIChatbot {
  private conversationHistory: EnhancedChatMessage[] = [];
  private context: AIContext | null = null;

  async initialize(userId?: string, userRole?: string): Promise<void> {
    console.log('[EnhancedAIChatbot] Initializing with:', { userId, userRole });
    this.context = await aiDataService.buildAIContext(userId, userRole);
    console.log('[EnhancedAIChatbot] Context built:', {
      hasUser: !!this.context?.user,
      userRole: this.context?.user?.role,
      location: this.context?.location,
      ordersCount: this.context?.recentOrders.length,
      cooksCount: this.context?.availableCooks.length
    });
  }

  private buildSystemPrompt(): string {
    if (!this.context) {
      return "You are a helpful AI assistant for Campus Dabba, a food delivery platform.";
    }

    const { user, recentOrders, availableCooks, popularItems, timeOfDay, location } = this.context;

    let systemPrompt = `You are an intelligent AI assistant for Campus Dabba, a premium food delivery platform connecting students with verified home cooks.

**Current Context:**
- Time: ${timeOfDay} time
- Location: ${location || 'Not specified'}
- User: ${user ? `${user.role} (${user.email})` : 'Guest'}

**Campus Dabba Platform:**
Campus Dabba is a unique food delivery service that focuses on authentic, homemade meals prepared by verified local cooks. We prioritize food safety, affordability, and authentic regional cuisines for college students.

**Key Features:**
- Verified home cooks with proper documentation
- Real-time order tracking and communication
- Affordable pricing for students
- Authentic regional and home-style cooking
- Safe and hygienic food preparation
- Community-driven platform with ratings and reviews

**Your Role:**
- Provide helpful, accurate information about Campus Dabba
- Assist with orders, menu recommendations, and platform navigation
- Offer personalized suggestions based on user context
- Use real data to make recommendations
- Be friendly, conversational, and food-focused
- Format responses with markdown for better readability

`;

    // Add user-specific context
    if (user) {
      if (user.role === 'student') {
        systemPrompt += `
**Student Context:**
- User preferences: ${user.preferences?.join(', ') || 'None specified'}
- Recent orders: ${recentOrders.length} orders found
- Available cooks nearby: ${availableCooks.length} verified cooks

`;
        if (recentOrders.length > 0) {
          systemPrompt += `**Recent Order History:**
${recentOrders.slice(0, 3).map(order => 
  `- Order #${order.id.slice(-6)}: ₹${order.total_amount} (${order.status}) from ${order.cook_name || 'Unknown Cook'}`
).join('\n')}

`;
        }

        if (availableCooks.length > 0) {
          systemPrompt += `**Available Cooks Near You:**
${availableCooks.slice(0, 5).map(cook => 
  `- ${cook.name}: ${cook.specialties.join(', ')} (★${cook.rating.toFixed(1)})`
).join('\n')}

`;
        }
      } else if (user.role === 'cook') {
        systemPrompt += `
**Cook Context:**
- Recent orders to fulfill: ${recentOrders.length} orders
- Help with menu management, order fulfillment, and earnings

`;
        if (recentOrders.length > 0) {
          systemPrompt += `**Recent Orders:**
${recentOrders.slice(0, 3).map(order => 
  `- Order #${order.id.slice(-6)}: ₹${order.total_amount} (${order.status})`
).join('\n')}

`;
        }
      } else if (user.role === 'admin') {
        systemPrompt += `
**Admin Context:**
- Platform management and oversight
- Help with user verification, analytics, and system administration

`;
      }
    }

    // Add popular items context
    if (popularItems.length > 0) {
      systemPrompt += `**Popular Items Available:**
${popularItems.slice(0, 8).map(item => 
  `- ${item.name}: ₹${item.price} (${item.cuisine_type}) by ${item.cook_name}`
).join('\n')}

`;
    }

    systemPrompt += `
**Response Guidelines:**
- Keep responses helpful and concise
- Use emojis appropriately for food and emotions
- Provide specific recommendations using real data
- Format with markdown (bold, bullets, etc.)
- If suggesting items/cooks, use actual names and prices
- For questions outside Campus Dabba scope, gently redirect
- Always maintain a friendly, enthusiastic tone about food
- Use bullet points for lists and **bold** for emphasis

Remember: Use the real data provided above to make specific, personalized recommendations!`;

    return systemPrompt;
  }

  async sendMessage(userMessage: string): Promise<string> {
    try {
      // Handle initialization request
      if (userMessage === '__INIT__') {
        return this.getWelcomeMessage();
      }

      // Refresh context if it's stale (older than 5 minutes)
      if (!this.context || (Date.now() - (this.context as any)._timestamp > 5 * 60 * 1000)) {
        const userId = this.context?.user?.id;
        const userRole = this.context?.user?.role;
        await this.initialize(userId, userRole);
      }

      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: userMessage,
        timestamp: new Date(),
        context: this.context || undefined
      });

      // Build conversation context (last 4 messages)
      const conversationContext = this.conversationHistory
        .slice(-4)
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

      // Check if this might be a search query and get search results if possible
      const searchKeywords = ['find', 'search', 'looking for', 'want', 'craving', 'order', 'show me'];
      const isSearchQuery = searchKeywords.some(keyword => 
        userMessage.toLowerCase().includes(keyword)
      );

      let searchResults = '';
      if (isSearchQuery) {
        try {
          // Try to get search results from the search API
          const response = await fetch(`/api/search?q=${encodeURIComponent(userMessage)}&limit=5`);
          if (response.ok) {
            const results = await response.json();
            if (results.length > 0) {
              searchResults = `\n\n**Search Results for "${userMessage}":**
${results.map((item: any) => 
  `- **${item.title}**: ${item.subtitle}\n  ${item.description || 'Delicious homemade dish'}`
).join('\n')}
`;
            }
          }
        } catch (error) {
          console.log('Search not available, continuing with AI response');
        }
      }

      // Create the full prompt
      const fullPrompt = `${this.buildSystemPrompt()}

**Recent Conversation:**
${conversationContext}

${searchResults}

**User's Current Message:** ${userMessage}

Please provide a helpful, personalized response using the context and data above. Make specific recommendations using real menu items, cooks, and prices when relevant.`;

      // Generate response
      const result = await model.generateContent(fullPrompt);
      const response = result.response;
      const assistantMessage = response.text();

      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage,
        timestamp: new Date()
      });

      return assistantMessage;
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Return a helpful fallback message based on user type
      const userType = this.context?.user?.role || 'guest';
      
      if (userType === 'guest') {
        return `I'm having a small hiccup right now! 😅 

While I get back on track, here's what Campus Dabba offers:

🍽️ **Authentic homemade meals** from verified home cooks
📍 **Location-based** cook discovery
💰 **Affordable prices** perfect for students
⭐ **Rated and reviewed** by the community
🚚 **Real-time tracking** for your orders

Try asking me about "How does Campus Dabba work?" or "Show me popular dishes" in a moment!`;
      } else {
        return "I'm having trouble processing your request right now. 😅 Please try again in a moment, or contact our support team for immediate assistance!";
      }
    }
  }

  getQuickActions(): string[] {
    if (!this.context) return [];

    const { user, timeOfDay } = this.context;

    const baseActions = [
      `Show me ${timeOfDay} options`,
      "What's popular near me?",
      "Find healthy food options",
      "Show me budget-friendly meals"
    ];

    if (!user) {
      return [
        "How does Campus Dabba work?",
        "Sign up as a student",
        "Register as a cook",
        ...baseActions
      ];
    }

    switch (user.role) {
      case 'student':
        return [
          ...baseActions,
          "Track my current order",
          "Reorder from favorites",
          "Find new cooks near me",
          "Show my order history"
        ];
      case 'cook':
        return [
          "Check pending orders",
          "Update my menu",
          "View my earnings",
          "Manage availability",
          "Get cooking tips"
        ];
      case 'admin':
        return [
          "View platform statistics",
          "Check pending verifications",
          "Review reported issues",
          "Export analytics data"
        ];
      default:
        return baseActions;
    }
  }

  getWelcomeMessage(): string {
    if (!this.context) {
      return "Welcome to Campus Dabba! 🍽️ How can I help you today?";
    }

    const { user, timeOfDay, availableCooks, popularItems } = this.context;

    if (!user) {
      return `Welcome to Campus Dabba! 🍽️ I see we have ${availableCooks.length} verified cooks available for ${timeOfDay}. How can I help you get started?`;
    }

    switch (user.role) {
      case 'student':
        return `Hi there! 👋 Ready for some delicious ${timeOfDay}? I found ${availableCooks.length} cooks near you with ${popularItems.length} amazing dishes. What are you craving?`;
      case 'cook':
        return `Hello, Chef! 👨‍🍳 Ready to serve some amazing home-cooked meals? I can help you manage orders, update your menu, or provide cooking tips.`;
      case 'admin':
        return `Welcome, Admin! 🛠️ I'm here to help you manage the Campus Dabba platform. What would you like to check on today?`;
      default:
        return `Welcome back! 🍽️ How can I assist you with Campus Dabba today?`;
    }
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }

  getHistory(): EnhancedChatMessage[] {
    return this.conversationHistory;
  }

  async refreshContext(userId?: string, userRole?: string): Promise<void> {
    await this.initialize(userId, userRole);
  }
}

// Factory function to create enhanced chatbot
export async function createEnhancedChatbot(userId?: string, userRole?: string): Promise<EnhancedAIChatbot> {
  console.log('[createEnhancedChatbot] Creating chatbot with:', { userId, userRole });
  const chatbot = new EnhancedAIChatbot();
  await chatbot.initialize(userId, userRole);
  return chatbot;
}

// Quick search function for the search bar
export async function quickSearch(query: string, location?: string): Promise<any[]> {
  try {
    const results = await aiDataService.searchItems(query, location, 8);
    return results.map(item => ({
      id: item.id,
      title: item.name,
      subtitle: `₹${item.price} • ${item.cuisine_type} • ${item.cook_name}`,
      description: item.description,
      type: 'menu_item',
      href: `/item/${item.id}`
    }));
  } catch (error) {
    console.error('Error in quick search:', error);
    return [];
  }
}
