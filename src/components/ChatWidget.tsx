'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const WELCOME_MESSAGE: Message = {
  role: 'assistant',
  content: "Hi! I'm Common Ground's ABA guide — here to help you understand ABA therapy, IEP terms, behavior plans, and what to expect at each stage of your journey.\n\nWhat can I help you with today?",
};

export default function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: Message = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();
      const reply: Message = {
        role: 'assistant',
        content: data.reply ?? 'Sorry, something went wrong. Please try again.',
      };
      setMessages([...updatedMessages, reply]);
    } catch {
      setMessages([
        ...updatedMessages,
        {
          role: 'assistant',
          content: 'Sorry, I\'m having trouble connecting right now. Please try again in a moment.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (pathname === '/calm') return null;

  return (
    <>
      {/* Chat Panel */}
      {open && (
        <div
          className="fixed bottom-24 right-4 z-50 flex flex-col rounded-2xl shadow-glow overflow-hidden"
          style={{
            width: '360px',
            maxWidth: 'calc(100vw - 32px)',
            height: '520px',
            maxHeight: 'calc(100vh - 120px)',
            backgroundColor: '#ffffff',
            border: '1px solid #d4d8e3',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ backgroundColor: '#1a2e52' }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-white text-sm font-bold"
                style={{ backgroundColor: '#e2283a' }}
              >
                CG
              </div>
              <div>
                <p className="text-sm font-semibold text-white leading-tight">ABA Guide</p>
                <p className="text-xs text-white/60 leading-tight">Common Ground</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition"
              aria-label="Close chat"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Disclaimer */}
          <div
            className="px-4 py-2 text-xs"
            style={{ backgroundColor: '#f4efe8', color: '#5a5d64', borderBottom: '1px solid #e8e6ef' }}
          >
            <span className="font-semibold">Educational assistant only</span> — not a licensed clinician. Always consult your BCBA for clinical decisions.
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ backgroundColor: '#f2f4f8' }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap"
                  style={
                    msg.role === 'user'
                      ? { backgroundColor: '#1a2e52', color: '#ffffff', borderBottomRightRadius: '4px' }
                      : { backgroundColor: '#ffffff', color: '#212226', borderBottomLeftRadius: '4px', border: '1px solid #e8e6ef' }
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div
                  className="rounded-2xl px-4 py-3 text-sm"
                  style={{ backgroundColor: '#ffffff', border: '1px solid #e8e6ef', borderBottomLeftRadius: '4px' }}
                >
                  <div className="flex gap-1 items-center h-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 bg-white border-t" style={{ borderColor: '#d4d8e3' }}>
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about ABA, IEPs, behavior plans…"
                rows={1}
                className="flex-1 resize-none rounded-xl border px-3.5 py-2.5 text-sm outline-none transition focus:ring-2"
                style={{
                  borderColor: '#d4d8e3',
                  color: '#212226',
                  maxHeight: '96px',
                  lineHeight: '1.5',
                  // @ts-ignore
                  fieldSizing: 'content',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#1a2e52')}
                onBlur={(e) => (e.target.style.borderColor = '#d4d8e3')}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition"
                style={{
                  backgroundColor: input.trim() && !loading ? '#1a2e52' : '#d4d8e3',
                  color: '#ffffff',
                }}
                aria-label="Send message"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M14 8L2 2l2.5 6L2 14l12-6z" fill="currentColor"/>
                </svg>
              </button>
            </div>
            <p className="mt-1.5 text-center text-xs" style={{ color: '#8f9299' }}>
              In crisis? Call or text <a href="tel:988" className="font-semibold underline" style={{ color: '#1a2e52' }}>988</a>
            </p>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-5 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-glow transition-transform hover:scale-105 active:scale-95"
        style={{ backgroundColor: '#1a2e52' }}
        aria-label="Open ABA Guide chat"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 4l12 12M16 4L4 16" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        ) : (
          <>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {hasUnread && (
              <span
                className="absolute top-1 right-1 h-3 w-3 rounded-full border-2 border-white"
                style={{ backgroundColor: '#e2283a' }}
              />
            )}
          </>
        )}
      </button>
    </>
  );
}
