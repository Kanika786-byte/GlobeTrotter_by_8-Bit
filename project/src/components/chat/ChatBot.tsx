import React, { useState, useRef, useEffect } from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon, 
  PaperAirplaneIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm your AI travel assistant. I can help you plan trips, find destinations, and book services within your budget. What would you like to explore today?",
      timestamp: new Date(),
      suggestions: [
        "Plan a trip to Goa under ₹20,000",
        "Find luxury hotels in Dubai", 
        "Suggest weekend getaways from Delhi",
        "Best budget destinations in India"
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): ChatMessage => {
    const message = userMessage.toLowerCase();
    
    // Budget-based responses
    if (message.includes('budget') || message.includes('cheap') || message.includes('affordable')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "I'd love to help you plan a budget-friendly trip! Here are some great options:\n\n🏖️ **Goa** - ₹3,500/day\n• Beautiful beaches and Portuguese heritage\n• Budget hotels from ₹1,500/night\n• Local food under ₹500/meal\n\n🏔️ **Rishikesh** - ₹2,000/day\n• Spiritual retreat and adventure sports\n• Ashrams and budget stays from ₹800/night\n• Simple vegetarian meals under ₹300\n\nWhat's your total budget and how many days are you planning?",
        timestamp: new Date(),
        suggestions: [
          "Show me Goa itinerary for ₹15,000",
          "Budget hotels in Rishikesh",
          "5-day trip under ₹25,000",
          "Cheapest flights to these destinations"
        ]
      };
    }
    
    // Luxury travel responses
    if (message.includes('luxury') || message.includes('premium') || message.includes('expensive')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "Excellent choice for a luxury experience! Here are some premium destinations:\n\n✨ **Dubai** - ₹25,000/day\n• Luxury shopping and modern architecture\n• 5-star hotels from ₹15,000/night\n• Fine dining experiences\n\n🏰 **Udaipur** - ₹18,000/day\n• Royal palaces and heritage hotels\n• Palace hotels from ₹12,000/night\n• Royal dining experiences\n\nWould you like me to create a detailed luxury itinerary?",
        timestamp: new Date(),
        suggestions: [
          "7-day luxury Dubai package",
          "Royal Rajasthan palace tour",
          "Luxury resorts in Maldives",
          "Premium flight options"
        ]
      };
    }
    
    // Destination-specific responses
    if (message.includes('goa')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "Goa is perfect for a beach vacation! Here's what I recommend:\n\n🏖️ **Best Time**: November to March\n💰 **Budget**: ₹3,500-₹8,000 per day\n🏨 **Stay**: Beach resorts or heritage hotels\n🍽️ **Food**: Seafood and Portuguese cuisine\n\n**Must-visit places**:\n• Baga Beach (nightlife)\n• Old Goa (heritage churches)\n• Dudhsagar Falls (adventure)\n• Anjuna Market (shopping)\n\nShall I help you book flights and hotels for Goa?",
        timestamp: new Date(),
        suggestions: [
          "Book Goa package for 5 days",
          "Best beaches in Goa",
          "Goa nightlife recommendations",
          "Adventure activities in Goa"
        ]
      };
    }
    
    // Trip planning responses
    if (message.includes('plan') || message.includes('itinerary') || message.includes('trip')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: "I'd be happy to help you plan your trip! To create the perfect itinerary, I need to know:\n\n📍 **Where** would you like to go?\n📅 **When** are you planning to travel?\n💰 **What's your budget** range?\n👥 **How many travelers**?\n🎯 **What interests you** most? (adventure, culture, relaxation, food, etc.)\n\nOnce I have these details, I can create a personalized day-by-day itinerary with bookings!",
        timestamp: new Date(),
        suggestions: [
          "Plan 7-day Kerala trip for ₹30,000",
          "Weekend getaway from Mumbai",
          "Family trip to Rajasthan",
          "Solo backpacking in Himachal"
        ]
      };
    }
    
    // Default helpful response
    return {
      id: Date.now().toString(),
      type: 'bot',
      content: "I'm here to help you with all your travel needs! I can assist you with:\n\n✈️ **Flight bookings** - Find best deals and routes\n🏨 **Hotel reservations** - From budget to luxury stays\n🚂 **Train tickets** - Comfortable rail journeys\n🚗 **Cab services** - Local and outstation rides\n🗺️ **Trip planning** - Complete itineraries with budget optimization\n\nWhat would you like to explore today?",
      timestamp: new Date(),
      suggestions: [
        "Plan a budget trip",
        "Find luxury destinations",
        "Weekend getaway ideas",
        "International travel options"
      ]
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
          isOpen 
            ? 'bg-gray-600 hover:bg-gray-700' 
            : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
        }`}
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6 text-white mx-auto" />
        ) : (
          <ChatBubbleLeftRightIcon className="h-6 w-6 text-white mx-auto" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-t-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <SparklesIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">AI Travel Assistant</h3>
                <p className="text-xs text-orange-100">Powered by Globe Trotter AI</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  {message.suggestions && (
                    <div className="mt-3 space-y-1">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="block w-full text-left text-xs bg-white bg-opacity-20 hover:bg-opacity-30 rounded px-2 py-1 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about travel plans, destinations, or bookings..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 text-sm"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                size="sm"
                className="px-3"
              >
                <PaperAirplaneIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};