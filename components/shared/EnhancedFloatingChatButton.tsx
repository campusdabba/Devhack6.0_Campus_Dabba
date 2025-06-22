"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/components/providers/auth-provider';
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const EnhancedFloatingChatButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quickActions, setQuickActions] = useState<string[]>([]);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, userRole, loading, refreshCounter } = useAuth();

  // Initialize chat when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeChat();
    }
  }, [isOpen, user, userRole]);

  // Re-initialize on auth changes
  useEffect(() => {
    if (isOpen) {
      initializeChat();
    }
  }, [refreshCounter, userRole]);

  const initializeChat = async () => {
    setIsLoading(true);
    try {
      // Get initial context from the enhanced AI
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: '__INIT__' })
      });

      if (response.ok) {
        const data = await response.json();
        setQuickActions(data.quickActions || []);
        
        // Set welcome message based on user role
        const welcome = getWelcomeMessage();
        setWelcomeMessage(welcome);
        
        // Add welcome message to chat
        setMessages([{
          id: Date.now().toString(),
          role: 'assistant',
          content: welcome,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      const fallbackWelcome = getWelcomeMessage();
      setWelcomeMessage(fallbackWelcome);
      setMessages([{
        id: Date.now().toString(),
        role: 'assistant',
        content: fallbackWelcome,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const getWelcomeMessage = (): string => {
    console.log('[FloatingChatButton] getWelcomeMessage called with:', {
      loading,
      hasUser: !!user,
      userRole,
      userId: user?.id
    });

    if (loading) {
      return "Welcome to Campus Dabba! 🍽️ Let me get your account details...";
    }

    if (!user) {
      return `## Welcome to Campus Dabba! 🍽️

I'm your AI food assistant! I can help you:

• **Discover** amazing home cooks near you
• **Find** your favorite cuisines and dishes  
• **Learn** about our platform and features
• **Get started** with ordering delicious meals

*What would you like to know about Campus Dabba?*`;
    }

    const timeOfDay = new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening';

    switch (userRole) {
      case 'student':
        return `## Good ${timeOfDay}! 👋

Ready for some **delicious food**? I can help you:

• **Find cooks** and dishes near you
• **Track your orders** in real-time
• **Discover** new cuisines and favorites
• **Get recommendations** based on your taste

*What are you craving today?* 🍛`;

      case 'cook':
        return `## Hello, Chef! 👨‍🍳

Great to see you! I'm here to help with:

• **Managing orders** and kitchen operations
• **Menu planning** and pricing strategies
• **Customer communication** tips
• **Cooking techniques** and recipes
• **Performance insights** and growth

*How can I assist you today?*`;

      case 'admin':
        return `## Welcome, Admin! 🛠️

I'm your platform assistant. I can help with:

• **Platform analytics** and user insights
• **Verification processes** and management
• **System monitoring** and health checks
• **User support** and issue resolution
• **Business intelligence** and reporting

*What would you like to check on?*`;

      default:
        return `## Welcome back! 🍽️

I'm your Campus Dabba AI assistant. I can help you with anything related to our food delivery platform.

*How can I assist you today?*`;
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim() })
      });

      if (response.ok) {
        const data = await response.json();
        
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);
        
        // Update quick actions if provided
        if (data.quickActions) {
          setQuickActions(data.quickActions);
        }
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble right now. Please try again in a moment! 😅",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (action: string) => {
    setMessage(action);
    // Small delay to show the message being typed
    setTimeout(() => {
      sendMessage();
    }, 100);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        
        {/* Notification dot for new features */}
        <div className="absolute -top-1 -right-1">
          <div className="relative">
            <div className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></div>
            <div className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Sparkles className="h-6 w-6" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Campus Dabba AI</h3>
            <p className="text-sm opacity-90">
              {userRole ? `${String(userRole).charAt(0).toUpperCase() + String(userRole).slice(1)} Assistant` : 'Food Assistant'}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-white/20 rounded-full h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="mb-2 last:mb-0 pl-4">{children}</ul>,
                        ol: ({ children }) => <ol className="mb-2 last:mb-0 pl-4">{children}</ol>,
                        strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                        h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-base font-semibold mb-2">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-sm font-semibold mb-1">{children}</h3>,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm">{msg.content}</p>
                )}
                <div
                  className={`text-xs mt-1 opacity-70 ${
                    msg.role === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl px-4 py-2 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Quick Actions */}
      {quickActions.length > 0 && (
        <div className="px-4 py-2 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {quickActions.slice(0, 4).map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action)}
                className="text-xs rounded-full h-7"
                disabled={isLoading}
              >
                <Zap className="h-3 w-3 mr-1" />
                {action}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about Campus Dabba..."
            disabled={isLoading}
            className="flex-1 rounded-xl"
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !message.trim()}
            size="sm"
            className="rounded-xl px-3"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedFloatingChatButton;
