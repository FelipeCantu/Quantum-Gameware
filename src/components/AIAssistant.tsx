'use client';

// The AI assistant: a square launcher and a chat panel. Styles in styles/assistant.css (tokens only,
// so light and dark follow the site theme).
import { useState, useRef, useEffect, useCallback } from 'react';

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

const formatTime = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// --- Component ---
export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isOpen, scrollToBottom]);

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

  // Reset unread count when opening chat; focus the input; Escape closes and returns focus
  useEffect(() => {
    if (!isOpen) return;
    setUnreadCount(0);
    lastUnreadMessageIdRef.current = null;
    textareaRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        launcherRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
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

  // Don't render until visible
  if (!isVisible) {
    return null;
  }

  const canSend = input.trim().length > 0 && !isLoading;

  return (
    <>
      {/* Launcher. Its aria-label must end in "AI Assistant": atlas.css hides it under the mobile menu. */}
      <button
        ref={launcherRef}
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="qga-launch"
        aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
        aria-expanded={isOpen}
        aria-controls="qga-panel"
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
            <path d="M4 5h16v11H10l-4 3.5V16H4z" strokeLinejoin="round" />
            <path d="M8.5 10.5h.01M12 10.5h.01M15.5 10.5h.01" strokeWidth={2.2} strokeLinecap="round" />
          </svg>
        )}
        {!isOpen && unreadCount > 0 && (
          <span className="qga-launch__badge" aria-label={`${unreadCount} unread`}>{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <section id="qga-panel" className="qga" role="dialog" aria-label="QG Assistant chat">
          <header className="qga__head">
            <div className="qga__avatar">
              <img src="/qg-axolotl-rbg.png" alt="" />
            </div>
            <div className="qga__id">
              <h2 className="qga__title">QG Assistant</h2>
              <p className="qga__status">Online</p>
            </div>
            <div className="qga__tools">
              {messages.length > 1 && (
                <button type="button" onClick={clearChat} className="qga__tool" title="Clear chat history">
                  Clear
                </button>
              )}
              <button type="button" onClick={() => setIsOpen(false)} className="qga__tool qga__tool--close" aria-label="Close chat">
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.4} aria-hidden="true"><path d="M1 1l10 10M11 1L1 11" /></svg>
              </button>
            </div>
          </header>

          <div className="qga__log" role="log" aria-live="polite" aria-busy={isLoading}>
            {messages.map((message) => {
              const isUser = message.role === 'user';
              return (
                <div key={message.id} className={`qga-msg ${isUser ? 'qga-msg--user' : 'qga-msg--assistant'}`}>
                  <span className="qga-msg__who">
                    {isUser ? 'You' : 'QG'} · <time dateTime={message.timestamp.toISOString()}>{formatTime(message.timestamp)}</time>
                  </span>
                  <div className="qga-msg__body">
                    {parseMessageContent(message.content).map((part, idx) => (
                      part.type === 'link' ? (
                        <a
                          key={idx}
                          href={part.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsOpen(false)} // Close chat when clicking link
                        >
                          {part.content}
                        </a>
                      ) : (
                        <span key={idx}>{part.content}</span>
                      )
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isLoading && (
              <div className="qga-msg qga-msg--assistant">
                <span className="qga-msg__who">QG · typing</span>
                <div className="qga-typing" aria-label="QG Assistant is typing"><span /><span /><span /></div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form className="qga__form" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
            <label htmlFor="qga-input" className="sr-only">Message QG Assistant</label>
            <textarea
              id="qga-input"
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress} // Use onKeyDown for better input handling
              placeholder="Ask about gear, orders, shipping…"
              rows={1}
              className="qga__input"
              disabled={isLoading}
            />
            <button type="submit" className="qga__send" disabled={!canSend} aria-label="Send message">
              {isLoading ? (
                <svg className="qga__spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true"><path d="M12 3a9 9 0 1 0 9 9" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true"><path d="M5 19L19 5M9 5h10v10" /></svg>
              )}
            </button>
          </form>
        </section>
      )}
    </>
  );
}
