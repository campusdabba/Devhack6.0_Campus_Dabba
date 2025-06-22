import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initialize Gemini AI with your working API key
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyBpr2QDT4hgyNfQecLpxl4HiiJtQ8bw5sM');

// Safety settings for content filtering
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

// Get the latest model with safety settings
const model = genAI.getGenerativeModel({ 
  model: 'gemini-2.0-flash',
  safetySettings,
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024,
  }
});

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface CampusDabbaContext {
  userType: 'student' | 'cook' | 'admin' | 'guest';
  location?: string;
  orderHistory?: any[];
  preferences?: string[];
}

export class CampusDabbaChatbot {
  private context: CampusDabbaContext;
  private conversationHistory: ChatMessage[] = [];

  constructor(context: CampusDabbaContext) {
    this.context = context;
  }

  private getSystemPrompt(): string {
    const basePrompt = `You are a helpful AI assistant for Campus Dabba, a food delivery platform that connects students with local home cooks. 

Platform Overview:
- Students can browse verified home cooks and order authentic homemade meals
- Cooks can register, get verified, manage menus, and fulfill orders
- Admins manage the platform, verify cooks, and oversee operations
- Payment is handled through Razorpay
- Real-time order tracking and notifications

Your role:
- Help users navigate the platform
- Answer questions about food, orders, cooks, and platform features
- Provide cooking tips and food recommendations
- Assist with troubleshooting common issues
- Be friendly, helpful, and food-focused

Current user context:
- User type: ${this.context.userType}
- Location: ${this.context.location || 'Not specified'}

Guidelines:
- Keep responses concise but helpful
- Focus on food, cooking, and platform-related topics
- If asked about technical issues, guide users to appropriate support
- Don't make up information about specific cooks or menu items
- Encourage users to explore the platform's features
`;

    // Add role-specific context
    switch (this.context.userType) {
      case 'student':
        return basePrompt + `
Student-specific help:
- Help find cooks and cuisines
- Explain ordering process
- Assist with delivery and payment questions
- Provide food recommendations based on preferences
- Help with account and profile management
`;
      case 'cook':
        return basePrompt + `
Cook-specific help:
- Assist with menu management
- Help with order fulfillment process
- Provide cooking tips and recipes
- Explain verification process
- Help with earnings and payment questions
- Guide through profile setup and documentation
`;
      case 'admin':
        return basePrompt + `
Admin-specific help:
- Assist with platform management
- Help with user and cook verification
- Explain analytics and reporting features
- Guide through administrative tasks
- Help with system configuration
`;
      default:
        return basePrompt + `
Guest help:
- Explain how Campus Dabba works
- Help with registration process
- Provide information about platform benefits
- Guide through getting started
`;
    }
  }

  async sendMessage(userMessage: string): Promise<string> {
    try {
      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      });

      // Build conversation context
      const conversationContext = this.conversationHistory
        .slice(-5) // Keep last 5 messages for context
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

      // Create the full prompt
      const fullPrompt = `${this.getSystemPrompt()}

Recent conversation:
${conversationContext}

Please respond to the user's latest message. Keep your response helpful, concise, and relevant to Campus Dabba.`;

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
      return "I'm sorry, I'm having trouble responding right now. Please try again in a moment, or contact our support team for assistance.";
    }
  }

  // Get suggested questions based on user type
  getSuggestedQuestions(): string[] {
    switch (this.context.userType) {
      case 'student':
        return [
          "How do I find cooks near my location?",
          "What cuisines are available on Campus Dabba?",
          "How does the ordering process work?",
          "Can I track my order in real-time?",
          "What payment methods are accepted?",
          "How do I rate a cook after delivery?"
        ];
      case 'cook':
        return [
          "How do I get verified as a cook?",
          "How do I add items to my menu?",
          "How do I manage incoming orders?",
          "When do I receive payments?",
          "How do I update my availability?",
          "What documents do I need for verification?"
        ];
      case 'admin':
        return [
          "How do I verify new cook applications?",
          "How do I view platform analytics?",
          "How do I manage user accounts?",
          "How do I handle order disputes?",
          "How do I configure platform settings?"
        ];
      default:
        return [
          "What is Campus Dabba?",
          "How do I sign up as a student?",
          "How do I register as a cook?",
          "What makes Campus Dabba different?",
          "Is the food safe and hygienic?",
          "How does delivery work?"
        ];
    }
  }

  // Clear conversation history
  clearHistory(): void {
    this.conversationHistory = [];
  }

  // Get conversation history
  getHistory(): ChatMessage[] {
    return this.conversationHistory;
  }
}

// Utility function to create chatbot instance
export function createChatbot(context: CampusDabbaContext): CampusDabbaChatbot {
  return new CampusDabbaChatbot(context);
}

// Quick food-related queries
export async function getFoodRecommendations(cuisine: string, dietary?: string[]): Promise<string> {
  try {
    const prompt = `Suggest 5 popular ${cuisine} dishes that would be great for a home-cooked meal delivery service. ${
      dietary?.length ? `Consider these dietary preferences: ${dietary.join(', ')}.` : ''
    } Format as a simple list with brief descriptions.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error getting food recommendations:', error);
    return 'Unable to get recommendations at the moment. Please try again later.';
  }
}

// Cooking tips for cooks
export async function getCookingTips(dish: string): Promise<string> {
  try {
    const prompt = `Provide 3-5 professional cooking tips for making ${dish} that would help a home cook deliver restaurant-quality food. Focus on practical, actionable advice.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error getting cooking tips:', error);
    return 'Unable to get cooking tips at the moment. Please try again later.';
  }
}

// Main AI response function for Campus Dabba
export async function getCampusDabbaAIResponse(message: string, context: string = ''): Promise<string> {
  try {
    const basePrompt = `You are a helpful AI assistant for Campus Dabba, a platform connecting college students with local home cooks for authentic, affordable meals.

${context}

Campus Dabba Key Features:
- Students can find and order from nearby home cooks
- Cooks can list their daily menus and earn money
- Focus on authentic, homemade regional cuisines
- Safe, verified community of cooks and students
- Affordable pricing for college students
- Real-time order tracking and communication

Guidelines:
- Be helpful, friendly, and concise
- Focus on Campus Dabba features and benefits
- Provide practical, actionable advice
- Use appropriate emojis to make responses engaging
- Use markdown formatting (bold, bullets, etc.) for better readability
- Keep responses under 200 words unless detailed explanation is needed
- If asked about competitors, gently redirect to Campus Dabba's unique value
- For technical issues, suggest contacting support
- Always maintain a positive, helpful tone
- Use numbered lists for step-by-step instructions
- Use bullet points for feature lists

User Message: ${message}

Please provide a helpful, well-formatted response using markdown:`;

    const result = await model.generateContent(basePrompt);
    return result.response.text();
  } catch (error) {
    console.error('Error getting AI response:', error);
    return 'I\'m experiencing some technical difficulties right now. Please try again in a moment, or feel free to contact our support team for immediate assistance!';
  }
}
