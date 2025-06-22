"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/components/providers/auth-provider";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const FloatingChatButton = () => {
  const { user, userRole, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function getWelcomeMessage(role: string | string[] | null) {
    const roleString = Array.isArray(role) ? role[0] : role;
    if (roleString === 'admin') {
      return "🛠️ **Admin Dashboard Assistant**\n\nI can help you with:\n• **Platform Management** - Monitor system health and performance\n• **User Verification** - Approve cooks and handle user issues\n• **Analytics & Reports** - View platform statistics and insights\n• **Payment Management** - Handle disputes and transaction issues\n• **Content Moderation** - Manage reviews and reported content\n\nWhat administrative task can I help you with?";
    } else if (roleString === 'cook') {
      return "👨‍🍳 **Welcome to your Cook Assistant!**\n\nI can help you with:\n• **Order Management** - Track and manage incoming orders\n• **Menu Updates** - Add, edit, or remove menu items\n• **Customer Support** - Handle customer queries\n• **Earnings Tracking** - Monitor your revenue and payments\n• **Cooking Tips** - Get professional cooking advice\n\nWhat would you like assistance with today?";
    } else if (roleString === 'student') {
      return "🍽️ **Hey there, hungry student!**\n\nI'm here to help you discover amazing homemade food:\n• **Find Local Cooks** - Discover authentic cuisines near you\n• **Browse Menus** - See what's cooking today\n• **Track Orders** - Real-time order tracking\n• **Food Recommendations** - Personalized suggestions\n• **Payment Help** - Assistance with payments and refunds\n\nWhat are you craving today?";
    } else {
      return "🏠 **Welcome to Campus Dabba!**\n\nI'm here to help you get started:\n• **Learn How It Works** - Understand our platform\n• **Student Registration** - Join as a food lover\n• **Cook Registration** - Start earning by cooking\n• **Safety & Trust** - Learn about our verification process\n• **Support** - Get help with any questions\n\nHow can I assist you today?";
    }
  }

  function getQuickActions(role: string | string[] | null) {
    const roleString = Array.isArray(role) ? role[0] : role;
    if (roleString === 'admin') {
      return ["Platform analytics", "User verification", "Payment disputes", "System status"];
    } else if (roleString === 'cook') {
      return ["View today's orders", "Update my menu", "Check earnings", "Customer feedback"];
    } else if (roleString === 'student') {
      return ["Find cooks near me", "What's popular today?", "Track my order", "Payment help"];
    } else {
      return ["How does it work?", "Sign up as student", "Become a cook", "Is it safe?"];
    }
  }

  function getPlaceholderText(role: string | string[] | null) {
    const roleString = Array.isArray(role) ? role[0] : role;
    if (roleString === 'admin') {
      return "Ask about platform management, analytics...";
    } else if (roleString === 'cook') {
      return "Ask about orders, menu, earnings...";
    } else if (roleString === 'student') {
      return "Ask about food, orders, cooks...";
    } else {
      return "Ask about Campus Dabba...";
    }
  }

  const [messages, setMessages] = useState<Message[]>([]);

  // Update welcome message when user role changes and not loading
  useEffect(() => {
    if (!loading) {
      console.log('FloatingChatButton: Auth state changed', { user: !!user, userRole, loading });
      setMessages([
        {
          role: "assistant",
          content: getWelcomeMessage(userRole),
          timestamp: new Date()
        }
      ]);
    }
  }, [userRole, loading, user]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: input,
          context: `Campus Dabba support chat - User role: ${Array.isArray(userRole) ? userRole[0] : userRole || 'guest'}`
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response || "I'm sorry, I couldn't process your request. Please try again.",
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "I'm experiencing some technical difficulties. Please try again later.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = getQuickActions(userRole);
  const roleString = Array.isArray(userRole) ? userRole[0] : userRole;

  return (
    <>
      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-orange-500 hover:bg-orange-600 shadow-lg hover:shadow-xl transition-all duration-300"
          size="lg"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} className="text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle size={24} className="text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>

        {/* Notification Badge */}
        {!isOpen && (
          <motion.div
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5, type: "spring" }}
          >
            <span className="text-white text-xs font-bold">!</span>
          </motion.div>
        )}
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-40 w-80 sm:w-96"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="shadow-2xl border-0 overflow-hidden bg-white dark:bg-gray-900">
              {/* Header */}
              <div className="bg-orange-500 text-white p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Campus Dabba Support</h3>
                  <p className="text-xs opacity-90">
                    {loading ? 'Loading...' :
                     (Array.isArray(userRole) ? userRole[0] : userRole) === 'admin' ? 'Admin Assistant' :
                     (Array.isArray(userRole) ? userRole[0] : userRole) === 'cook' ? 'Cook Assistant' : 
                     (Array.isArray(userRole) ? userRole[0] : userRole) === 'student' ? 'Student Helper' : 
                     'We reply instantly'}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <CardContent className="h-80 overflow-y-auto p-4 space-y-3">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <Loader2 size={16} className="animate-spin" />
                      <span className="text-sm">Loading your assistant...</span>
                    </div>
                  </div>
                ) : (
                  <AnimatePresence>
                    {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex items-start gap-2 ${
                        message.role === "user" ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        message.role === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-orange-500 text-white"
                      }`}>
                        {message.role === "user" ? <User size={12} /> : <Bot size={12} />}
                      </div>
                      <div className={`max-w-[80%] ${
                        message.role === "user" ? "text-right" : "text-left"
                      }`}>
                        <div className={`inline-block p-2 rounded-lg text-sm ${
                          message.role === "user"
                            ? "bg-blue-500 text-white rounded-tr-sm"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-sm"
                        }`}>
                          <div className="leading-relaxed prose prose-sm max-w-none dark:prose-invert">
                            {message.role === "assistant" ? (
                              <ReactMarkdown 
                                components={{
                                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                  ul: ({ children }) => <ul className="mb-2 last:mb-0 list-disc list-inside">{children}</ul>,
                                  li: ({ children }) => <li className="mb-1">{children}</li>,
                                  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                  em: ({ children }) => <em className="italic">{children}</em>,
                                }}
                              >
                                {message.content}
                              </ReactMarkdown>
                            ) : (
                              <div className="whitespace-pre-wrap">{message.content}</div>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  </AnimatePresence>

                  {/* Loading Indicator */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-2"
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center">
                        <Bot size={12} />
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg rounded-tl-sm p-2">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                          <Loader2 size={12} className="animate-spin" />
                          <span className="text-xs">Typing...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                )}
                  </motion.div>
                )}
              </CardContent>

              {/* Input */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-3">
                <div className="flex items-center gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={getPlaceholderText(userRole)}
                    disabled={isLoading}
                    className="flex-1 text-sm rounded-full border-gray-300 dark:border-gray-600 focus:ring-1 focus:ring-orange-400"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                    size="sm"
                    className="rounded-full w-8 h-8 p-0 bg-orange-500 hover:bg-orange-600 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 size={14} className="animate-spin text-white" />
                    ) : (
                      <Send size={14} className="text-white" />
                    )}
                  </Button>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {quickActions.slice(0, 3).map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setInput(suggestion)}
                      disabled={isLoading}
                      className="text-xs px-2 py-1 h-auto rounded-full border-gray-300 dark:border-gray-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChatButton;