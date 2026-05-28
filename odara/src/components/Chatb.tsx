"use client";
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2, Bot } from 'lucide-react';

// Chat message type
type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

// Suggested questions for users
const SUGGESTED_QUESTIONS = [
  "What products do you sell?",
  "How do I track my order?",
  "Shipping policy?",
  "Return & refund policy?",
  "How to become a seller?",
  "Payment methods accepted?"
];

// Bot response logic (can be expanded with AI/API later)
const getBotResponse = (message: string): string => {
  const msg = message.toLowerCase();
  
  if (msg.includes('product') || msg.includes('sell') || msg.includes('item')) {
    return "We offer a wide range of authentic African products including Fashion & Apparel, Arts & Crafts, Jewelry, Food & Beverages, Beauty products, Home & Living items, and more! Browse our categories to find what you love. 🛍️";
  }
  
  if (msg.includes('track') || msg.includes('order') || msg.includes('shipping')) {
    return "You can track your order by visiting the 'Track My Order' page in the menu. Just enter your order number and email address to see real-time updates on your delivery status. 📦";
  }
  
  if (msg.includes('shipping') || msg.includes('delivery')) {
    return "We offer nationwide shipping across Nigeria. Delivery typically takes 3-7 business days depending on your location. International shipping is also available for select products. Shipping costs are calculated at checkout. 🚚";
  }
  
  if (msg.includes('return') || msg.includes('refund') || msg.includes('policy')) {
    return "We have a 14-day return policy for most items. Products must be unused and in original packaging. To initiate a return, please contact our support team with your order number. Refunds are processed within 5-7 business days. 🔄";
  }
  
  if (msg.includes('seller') || msg.includes('become') || msg.includes('vendor')) {
    return "We welcome new sellers! To become a seller on Odara, please visit our 'Sell with Us' page or contact our vendor support team. We'll guide you through the onboarding process. 🌟";
  }
  
  if (msg.includes('payment') || msg.includes('pay')) {
    return "We accept various payment methods including credit/debit cards (Visa, Mastercard), bank transfers, and mobile payments (Paystack, Flutterwave). All transactions are secure and encrypted. 💳";
  }
  
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return "Hello!  Welcome to Odara Support. How can I help you today? Feel free to ask about our products, orders, shipping, or anything else!";
  }
  
  if (msg.includes('thank')) {
    return "You're very welcome!  We're glad to help. Is there anything else you'd like to know?";
  }
  
  return "Thank you for reaching out! I'm here to help with product inquiries, order tracking, shipping info, returns, and more. Could you please provide more details about what you need assistance with? You can also check our FAQ section for quick answers. 🤗";
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello!  I'm Odara's virtual assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse = getBotResponse(text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleSend = () => {
    sendMessage(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedClick = (question: string) => {
    sendMessage(question);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Button - Floating Action Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 z-50 group"
          aria-label="Open chat"
        >
          <div className="relative">
            {/* Pulsing ring animation */}
            <div className="absolute inset-0 rounded-full animate-ping bg-[#2D1B4E] opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
            <div className="absolute inset-0 rounded-full animate-pulse bg-[#2D1B4E] opacity-20" />
            
            {/* Main button */}
            <div className="relative bg-gradient-to-br from-[#2D1B4E] to-[#1a0f2e] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer">
              <MessageCircle size={28} strokeWidth={1.8} />
              
              {/* Online indicator */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
            </div>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl transition-all duration-300 flex flex-col overflow-hidden ${
            isMinimized 
              ? 'w-80 h-14' 
              : 'w-[90vw] sm:w-[400px] h-[550px] sm:h-[600px]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#2D1B4E] to-[#1a0f2e] text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 rounded-full p-1.5">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Odara Chatbot</h3>
                <p className="text-[10px] text-white/70">Online • Usually replies instantly</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={toggleMinimize}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
              >
                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </button>
              <button
                onClick={toggleChat}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Chat Body - Only show when not minimized */}
          {!isMinimized && (
            <>
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-[#FAFAFC] to-white">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-[#2D1B4E] to-[#3d2568] text-white'
                          : 'bg-[#F0EEFB] text-[#1F2937]'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <p
                        className={`text-[9px] mt-1 ${
                          message.sender === 'user' ? 'text-white/60' : 'text-[#B0A8C8]'
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-[#F0EEFB] rounded-2xl px-4 py-2.5">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-[#2D1B4E] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-[#2D1B4E] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-[#2D1B4E] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Questions */}
              {messages.length <= 2 && (
                <div className="px-4 py-2 border-t border-[#F0EEF4] bg-[#FAFAFC]">
                  <p className="text-[10px] font-semibold text-[#B0A8C8] uppercase tracking-wider mb-2">
                    Suggested questions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_QUESTIONS.map((question, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestedClick(question)}
                        className="text-xs bg-white border border-[#EDE9F6] rounded-full px-3 py-1.5 text-[#374151] hover:bg-[#F5F3FF] hover:border-[#C4B5E0] hover:text-[#2D1B4E] transition-all"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="border-t border-[#F0EEF4] p-3 bg-white">
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 bg-[#F5F3FF] border border-[#EDE9F6] rounded-xl px-3 py-2.5 text-sm text-[#1F2937] placeholder:text-[#B0A8C8] outline-none focus:border-[#C4B5E0] focus:bg-white transition-all"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    className="bg-gradient-to-r from-[#2D1B4E] to-[#3d2568] text-white rounded-xl p-2.5 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                  >
                    <Send size={18} />
                  </button>
                </div>
                <p className="text-[9px] text-[#B0A8C8] text-center mt-2">
                  Powered by Odara Chatbot • Responses are automated
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes bounce {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-6px);
          }
        }
        .animate-bounce {
          animation: bounce 1s infinite;
        }
      `}</style>
    </>
  );
};

export default ChatBot;