import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AIChatMessage } from '../types';
import { aiQuickReplies, generateAIResponse } from '../data/aiResponses';

interface AIChatContextValue {
  messages: AIChatMessage[];
  isOpen: boolean;
  isTyping: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  send: (text: string) => void;
  clear: () => void;
  quickReplies: typeof aiQuickReplies;
}

const AIChatContext = createContext<AIChatContextValue>({
  messages: [],
  isOpen: false,
  isTyping: false,
  open: () => {},
  close: () => {},
  toggle: () => {},
  send: () => {},
  clear: () => {},
  quickReplies: aiQuickReplies,
});

const greetingMessage: AIChatMessage = {
  id: 'ai-greeting',
  role: 'assistant',
  content:
    "Hey 👋 I'm your ShopX co-pilot. Ask me about deals, sizing, delivery — or tap a quick action below.",
  timestamp: new Date().toISOString(),
};

export const AIChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([greetingMessage]);
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
  const clear = useCallback(() => setMessages([greetingMessage]), []);

  const send = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMessage: AIChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setTimeout(() => {
      const responseText = generateAIResponse(trimmed);
      const assistantMessage: AIChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: responseText,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 750 + Math.random() * 600);
  }, []);

  const value = useMemo(
    () => ({
      messages,
      isOpen,
      isTyping,
      open,
      close,
      toggle,
      send,
      clear,
      quickReplies: aiQuickReplies,
    }),
    [messages, isOpen, isTyping, open, close, toggle, send, clear]
  );

  return <AIChatContext.Provider value={value}>{children}</AIChatContext.Provider>;
};

export const useAIChat = () => useContext(AIChatContext);
