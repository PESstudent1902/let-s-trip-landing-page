"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { MessageSquare, X, Send, User, Bot, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi there! 👋 I'm your LetsTrip travel guide. Looking for a holiday package? Tell me your destination, budget, or travel style and I'll find the perfect match!" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickChips = useMemo(
    () => ["Thailand under 60k", "Dubai luxury", "Bali couples", "Singapore family", "Best budget package"],
    []
  );

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Prevent body scroll when chat is open on mobile
  useEffect(() => {
    const isMobile = window.innerWidth < 640;
    if (isOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });

      const data = await res.json();
      
      if (data.error) {
        setMessages((prev) => [...prev, { role: "assistant", content: `Sorry, something went wrong. Please try again or reach us on WhatsApp at +91 88677 67171.` }]);
      } else if (data.choices && data.choices.length > 0) {
        const content = String(data.choices[0]?.message?.content || "");
        // Display the response as-is (plain text from the AI)
        setMessages((prev) => [...prev, { role: "assistant", content: content || "I couldn't process that. Try asking about a specific destination!" }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I couldn't process that request. Try asking about Thailand, Dubai, Bali, or Singapore!" }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Connection issue. Please try again or reach us on WhatsApp at +91 88677 67171." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChipClick = (chip: string) => {
    setInput(chip);
    // Auto-submit after a brief delay
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      setInput(chip);
    }, 50);
  };

  return (
    <>
      {/* Floating Button — positioned above MobileWhatsAppCTA on mobile */}
      <div className="fixed bottom-6 right-6 z-50 md:bottom-8 md:right-8">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
            isOpen ? "bg-red-500 text-white" : "bg-gradient-to-br from-cyan-400 to-cyan-600 text-[#0A1628] hover:shadow-[0_0_30px_rgba(0,240,255,0.4)]"
          }`}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div key="open" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <MessageSquare size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
        {/* Pulse ring when closed */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full animate-ping bg-cyan-400/20 pointer-events-none" />
        )}
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed z-50 
              inset-0 sm:inset-auto
              sm:bottom-28 sm:right-6 
              sm:w-[400px] sm:h-[520px] sm:max-h-[80vh] 
              sm:rounded-2xl
              bg-[#0A1628] border-0 sm:border sm:border-white/10 
              shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#192122] px-4 py-3.5 sm:py-4 border-b border-white/10 flex items-center gap-3 flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-[#0A1628]">
                <Bot size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-sm" style={{ fontFamily: "var(--font-headline)" }}>LetsTrip Assistant</h3>
                <p className="text-cyan-400 text-xs">AI-powered travel guide</p>
              </div>
              {/* Close button visible on mobile */}
              <button onClick={() => setIsOpen(false)} className="sm:hidden p-2 rounded-lg hover:bg-white/10 text-gray-400 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 overscroll-contain">
              {/* Quick chips — show only at the start */}
              {messages.length <= 1 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {quickChips.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleChipClick(chip)}
                      className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200 hover:bg-white/10 active:scale-95 transition-all"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <Sparkles size={12} className="text-cyan-400" />
                        {chip}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "bg-white/10 text-white" : "bg-gradient-to-br from-cyan-400 to-cyan-600 text-[#0A1628]"}`}>
                    {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm leading-relaxed ${msg.role === "user" ? "bg-cyan-500 text-[#0A1628] rounded-tr-sm" : "bg-white/10 text-white rounded-tl-sm"}`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 text-[#0A1628] flex items-center justify-center flex-shrink-0">
                    <Bot size={16} />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-white/10 text-white rounded-tl-sm flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-cyan-400" />
                    <span className="text-sm text-gray-400">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 sm:p-4 bg-[#192122] border-t border-white/10 flex-shrink-0 safe-bottom">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about packages, destinations..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 text-[#0A1628] flex items-center justify-center disabled:opacity-40 transition-opacity active:scale-95"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
