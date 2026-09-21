"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageSquareText,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  TrendingUp,
  Package,
  Mic,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

const PRESET_QUESTIONS = [
  "How my market dey go this week?",
  "Which product I suppose reorder now?",
  "Summarize my net profit & expenses",
  "Any deadstock or slow products?",
];

export default function OgaBizSenseChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Oga! Welcome! I be Oga BizSense, your 24/7 AI Business Coach. Ask me anything about your sales, profit, expenses, or stock sharp sharp!",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!questionText) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });

      const data = await res.json();
      const botReplyText =
        data.reply ||
        "Oga, my network slow small. Abeg try ask again make I check your ledger!";

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: botReplyText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Error talking to AI coach:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: "Oga, connection issue dey. Check your internet connection or backend server!",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-gradient-to-r from-teal-600 to-indigo-600 px-5 py-3.5 text-white shadow-2xl hover:scale-105 transition-all duration-300 border border-teal-400/30 group"
        >
          <div className="relative">
            <Bot className="h-6 w-6 text-white" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-400"></span>
            </span>
          </div>
          <span className="font-bold text-sm tracking-wide">Ask Oga BizSense</span>
          <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
        </button>
      )}

      {/* Chat Drawer / Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] rounded-3xl bg-slate-900 text-white shadow-2xl border border-slate-700/80 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 p-4 border-b border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative rounded-2xl bg-teal-500/20 p-2.5 border border-teal-500/30">
                <Bot className="h-6 w-6 text-teal-300" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-slate-900"></span>
              </div>
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  Oga BizSense AI
                  <span className="rounded-full bg-teal-500/20 border border-teal-500/30 px-2 py-0.5 text-[10px] text-teal-300 font-semibold uppercase tracking-wider">
                    Pidgin Coach
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Grounded on your LedgerLite DB
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Action Chips */}
          <div className="bg-slate-950/60 px-3 py-2 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {PRESET_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={loading}
                className="shrink-0 rounded-full bg-slate-800/80 hover:bg-teal-900/50 border border-slate-700 hover:border-teal-500/50 px-3 py-1 text-xs text-slate-300 hover:text-teal-200 transition disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-900/90">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 items-end ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "bot" && (
                  <div className="rounded-full bg-teal-500/20 p-1.5 text-teal-300 border border-teal-500/30 mb-1 shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-teal-600 text-white rounded-br-none"
                      : "bg-slate-800 text-slate-100 border border-slate-700/80 rounded-bl-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span
                    className={`block text-[10px] mt-1 text-right ${
                      msg.sender === "user" ? "text-teal-200" : "text-slate-400"
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === "user" && (
                  <div className="rounded-full bg-indigo-500/20 p-1.5 text-indigo-300 border border-indigo-500/30 mb-1 shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2.5 text-slate-400 text-xs p-2">
                <Bot className="h-4 w-4 text-teal-400 animate-spin" />
                <span>Oga BizSense dey calculate your market numbers...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask Oga BizSense in Pidgin or English..."
              disabled={loading}
              className="flex-1 bg-slate-900 border border-slate-700/80 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition disabled:opacity-50"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="rounded-2xl bg-teal-600 hover:bg-teal-500 p-2.5 text-white transition disabled:opacity-40 disabled:hover:bg-teal-600 shrink-0"
              title="Send Message"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
