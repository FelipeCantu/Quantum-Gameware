'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useTheme } from '@/context/ThemeContext'; // Assuming this context exists

// --- Type Definitions ---
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  id: string; // Ensure ID is non-optional for reliable keying
}

// --- Constants ---
const CHAT_STORAGE_KEY = 'qg_chat_messages';
const CHAT_TIMESTAMP_KEY = 'qg_chat_timestamp';
const CHAT_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours
const MAX_TEXTAREA_HEIGHT = 100; // Max height for the input in pixels

// Utility function to load and parse messages
const loadMessages = (): Message[] => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return [{
      role: 'assistant',
      content: "Hi! I'm your Quantum Gameware assistant. How can I help you today? I can help you find products, answer questions about our store, or assist with your orders!",
      timestamp: new Date(),
      id: 'initial',
    }];
  }

  try {
    const savedMessages = localStorage.getItem(CHAT_STORAGE_KEY);
    const savedTimestamp = localStorage.getItem(CHAT_TIMESTAMP_KEY);
    const now = Date.now();

    if (savedMessages && savedTimestamp) {
      const timestamp = parseInt(savedTimestamp, 10);

      if (now - timestamp < CHAT_EXPIRY_TIME) {
        const parsed = JSON.parse(savedMessages);
        // Map to ensure Date objects are correct and ID is a string
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
          id: msg.id || Date.now().toString(), // Ensure ID fallback
        }));
      } else {
        // Clear expired chat
        localStorage.removeItem(CHAT_STORAGE_KEY);
        localStorage.removeItem(CHAT_TIMESTAMP_KEY);
      }
    }
  } catch (error) {
    console.error('Error loading chat messages:', error);
  }

  // Return initial message if loading failed or chat expired/empty
  return [{
    role: 'assistant',
    content: "Hi! I'm your Quantum Gameware assistant. How can I help you today? I can help you find products, answer questions about our store, or assist with your orders!",
    timestamp: new Date(),
    id: 'initial',
  }];
};

// Utility function to save messages
const saveMessages = (messages: Message[]) => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    localStorage.setItem(CHAT_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.error('Error saving chat messages:', error);
  }
};

// Type definitions for parsed message content
type MessagePart =
  | { type: 'text'; content: string }
  | { type: 'link'; content: string; url: string };

// Utility function to parse message content for links
const parseMessageContent = (content: string): MessagePart[] => {
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: MessagePart[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkPattern.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: content.substring(lastIndex, match.index) });
    }

    parts.push({
      type: 'link',
      content: match[1],
      url: match[2]
    });

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({ type: 'text', content: content.substring(lastIndex) });
  }

  return parts.length > 0 ? parts : [{ type: 'text', content }];
};

// --- Component ---
export default function AIAssistant() {
  const { effectiveTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const lastUnreadMessageIdRef = useRef<string | null>(null);

  // 1. Initialization: Load initial state and messages
  useEffect(() => {
    const initialMessages = loadMessages();
    setMessages(initialMessages);
    setIsInitialized(true);

    // Visibility delay (e.g., after a logo animation)
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // 2. Persistence: Save messages whenever they change, after initialization
  useEffect(() => {
    if (isInitialized && messages.length > 0) {
      saveMessages(messages);
    }
  }, [messages, isInitialized]);

  // 3. Side Effects: Scroll, Unread Count, Textarea Resize
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Track unread messages (only increment once per new assistant message)
  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      // Only increment if it's a new assistant message we haven't counted yet
      if (
        lastMessage.role === 'assistant' &&
        lastMessage.id !== 'initial' &&
        lastMessage.id !== lastUnreadMessageIdRef.current
      ) {
        lastUnreadMessageIdRef.current = lastMessage.id;
        setUnreadCount(prev => prev + 1);
      }
    }
  }, [messages, isOpen]);

  // Reset unread count when opening chat
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      lastUnreadMessageIdRef.current = null;
    }
  }, [isOpen]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      // Set height based on scrollHeight, constrained by MAX_TEXTAREA_HEIGHT
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
    }
  }, [input]);

  // --- Core Functions ---

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: trimmedInput,
      timestamp: new Date(),
      id: Date.now().toString() + '-user',
    };

    // Optimistic UI update
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare the history for the API call (using map for clean data transfer)
      const chatHistory = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to fetch AI response.');
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        id: Date.now().toString() + '-assistant',
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: "I apologize, but I'm having trouble connecting right now. Please try again later or contact our support team directly.",
        timestamp: new Date(),
        id: Date.now().toString() + '-error',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    const initialMessage = loadMessages().find(m => m.id === 'initial') || {
      role: 'assistant',
      content: "Hi! I'm your Quantum Gameware assistant. How can I help you today? I can help you find products, answer questions about our store, or assist with your orders!",
      timestamp: new Date(),
      id: 'initial',
    } as Message;

    setMessages([initialMessage]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CHAT_STORAGE_KEY);
      localStorage.removeItem(CHAT_TIMESTAMP_KEY);
    }
    setUnreadCount(0); // Reset unread count on clear
  };

  // --- Style Helpers (for cleaner JSX) ---
  const isLight = effectiveTheme === 'light';
  const themeClasses = {
    chatWindow: isLight
      ? 'bg-white/95 border border-gray-200/50'
      : 'bg-gray-800/95 border border-gray-700/50',
    messagesContainer: isLight
      ? 'bg-gray-50/50'
      : 'bg-gray-900/50',
    messageBoxAssistant: isLight
      ? 'bg-white text-gray-900 border border-gray-200/50'
      : 'bg-gray-800 text-white border border-gray-700/50',
    inputContainer: isLight
      ? 'bg-white/80 border-gray-200/50'
      : 'bg-gray-800/80 border-gray-700/50',
    inputField: isLight
      ? 'bg-gray-100 hover:bg-gray-200 text-gray-900 placeholder-gray-500 focus:bg-white'
      : 'bg-gray-700 hover:bg-gray-600 text-white placeholder-gray-400 focus:bg-gray-600',
    sendButtonDisabled: isLight
      ? 'bg-gray-200 text-gray-400'
      : 'bg-gray-700 text-gray-500',
  };
  const gradientPrimary = 'bg-gradient-to-r from-blue-600 to-purple-600';
  const gradientPrimaryHover = 'hover:from-blue-700 hover:to-purple-700';
  const gradientSecondary = 'bg-gradient-to-r from-blue-500 to-purple-500';
  const gradientSecondaryHover = 'hover:from-blue-600 hover:to-purple-600';
  const accentGradient = isLight ? gradientPrimary : gradientSecondary;
  const accentGradientHover = isLight ? gradientPrimaryHover : gradientSecondaryHover;

  // Don't render until visible
  if (!isVisible) {
    return null;
  }

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className={`fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${accentGradient} ${accentGradientHover}`}
        aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white transition-transform duration-300 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce shadow-lg">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-0 right-0 z-[9999] w-full h-full 
            md:bottom-24 md:right-6 md:w-96 md:h-[600px] md:max-h-[calc(100vh-8rem)] md:rounded-2xl
            shadow-2xl flex flex-col overflow-hidden transition-all duration-300
            animate-in slide-in-from-bottom-8 fade-in duration-300
            backdrop-blur-xl ${themeClasses.chatWindow}`}
          style={{
            backdropFilter: 'blur(20px)',
            // Refined shadow for better depth in both light/dark
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)'
          }}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[length:200%_100%] animate-gradient px-4 py-4 sm:px-6 flex items-center justify-between shadow-lg">
            {/* Animated shimmer overlay for premium look */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>

            <div className="flex items-center space-x-3 relative z-10">
              <div className="w-10 h-10 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse blur-sm"></div>
                {/* Use a better placeholder or a real image for QG Assistant */}
                <img src="/qg-axolotl-rbg.png" alt="QG Assistant" className="w-10 h-10 object-contain relative z-10 drop-shadow-md" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg drop-shadow-sm">QG Assistant</h3>
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <p className="text-white/90 text-sm">Online</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 relative z-10">
              {messages.length > 1 && (
                <button
                  onClick={clearChat}
                  className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
                  aria-label="Clear chat history"
                  title="Clear chat history"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
                aria-label="Close chat"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div
            className={`flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar ${themeClasses.messagesContainer}`}
            style={{
              // Use a subtle radial pattern to give the background texture
              backgroundImage: isLight
                ? 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.05) 0%, transparent 40%)'
                : 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.1) 0%, transparent 40%)',
              backgroundAttachment: 'fixed', // Keeps the pattern fixed during scroll
            }}
          >
            {messages.map((message, index) => {
              const isUser = message.role === 'user';
              return (
                <div
                  key={message.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`relative max-w-[85%]`}>
                    {/* Message tail/bubble pointer */}
                    <div className={`absolute ${isUser ? '-right-1.5' : '-left-1.5'} top-3 z-0`}>
                      <svg width="12" height="12" viewBox="0 0 12 12" className={`drop-shadow-sm ${isUser ? 'text-blue-600' : isLight ? 'text-white' : 'text-gray-800'}`}>
                        <path d={isUser ? "M 0 0 L 12 0 L 0 12 Z" : "M 0 0 L 12 0 L 12 12 Z"} fill="currentColor" />
                      </svg>
                    </div>

                    <div
                      className={`relative z-10 rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl
                      ${isUser ? 'bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 text-white px-4 py-2.5 rounded-br-none' : `${themeClasses.messageBoxAssistant} px-4 py-3 rounded-tl-none`}`}
                    >
                      <div className={`whitespace-pre-wrap break-words ${isUser ? 'text-[15px] leading-snug' : 'text-sm leading-relaxed'}`}>
                        {parseMessageContent(message.content).map((part, idx) => (
                          part.type === 'link' ? (
                            <a
                              key={idx}
                              href={part.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => setIsOpen(false)} // Close chat when clicking link
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] my-1 mr-1 ${accentGradient} ${accentGradientHover} text-white shadow-md`}
                            >
                              {part.content}
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          ) : (
                            <span key={idx}>{part.content}</span>
                          )
                        ))}
                      </div>
                      <p
                        className={`flex items-center mt-1.5 ${isUser ? 'text-[11px] text-white/70 justify-end' : 'text-xs text-gray-500 justify-start'} ${!isUser && !isLight ? 'text-gray-400' : ''}`}
                      >
                        {!isUser && (
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Loading/Typing Indicator */}
            {isLoading && (
              <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="relative">
                  <div className={`rounded-2xl px-6 py-4 shadow-md ${themeClasses.messageBoxAssistant} rounded-tl-none`}>
                    <div className="flex space-x-2 items-center">
                      <div className={`w-2.5 h-2.5 rounded-full animate-bounce ${accentGradient}`} style={{ animationDelay: '0ms' }}></div>
                      <div className={`w-2.5 h-2.5 rounded-full animate-bounce ${accentGradient}`} style={{ animationDelay: '150ms' }}></div>
                      <div className={`w-2.5 h-2.5 rounded-full animate-bounce ${accentGradient}`} style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className={`p-4 border-t backdrop-blur-xl ${themeClasses.inputContainer}`}>
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress} // Use onKeyDown for better input handling
                  placeholder="Type your message..."
                  rows={1}
                  className={`w-full resize-none rounded-3xl px-4 py-3
                    focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-transparent
                    transition-all duration-300 shadow-inner hover:shadow-md
                    ${themeClasses.inputField}`}
                  style={{ maxHeight: `${MAX_TEXTAREA_HEIGHT}px`, minHeight: '48px' }}
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={`p-3 rounded-full transition-all duration-200 shadow-xl
                  hover:shadow-2xl active:scale-90 transform w-12 h-12 flex items-center justify-center
                  ${input.trim() && !isLoading
                    ? `${accentGradient} ${accentGradientHover} text-white scale-100`
                    : `${themeClasses.sendButtonDisabled} cursor-not-allowed opacity-60 scale-95`
                  }`}
                aria-label="Send message"
              >
                {isLoading ? (
                  <svg className="w-5 h-5 animate-spin text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9-18-9 2-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}