import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Maximize2, 
  Minimize2, 
  Mic, 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import { ChatMessage, FarmerProfile, Language } from '../types/index.ts';
import { translations } from '../utils/translations.ts';
import { askRythuAI } from '../services/geminiService.ts';

interface RythuAIChatProps {
  farmer: FarmerProfile | null;
  language: Language;
}

export const RythuAIChat: React.FC<RythuAIChatProps> = ({ farmer, language }) => {
  const t = translations[language];

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: language === 'te'
        ? `నమస్కారం! నేను విశాఖపట్నం అగ్రిటెక్ AI మిత్రను. మీ పంట వ్యాధులు, 80% సబ్సిడీ డ్రోన్ పిచికారీ, లేదా YSR రైతు భరోసా పథకం గురించి ఏమైనా అడగండి!`
        : `Namaste! I am Rythu AI Mitra, your 24/7 intelligent farming advisor for Visakhapatnam and Coastal AP. Ask me anything about crop diseases, 80% subsidized drone spraying, or welfare schemes!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        'How to book 80% subsidized drone spray?',
        'Remedy for Paddy Leaf Blast in Anakapalle',
        'Eligibility for YSR Rythu Bharosa ₹13,500',
        'Current Sugarcane FRP rate at Chodavaram',
      ],
    },
  ]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setIsTyping(true);

    try {
      const response = await askRythuAI(textToSend.trim(), language, farmer);
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: response.timestamp,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-2xl shadow-emerald-950 flex items-center gap-2.5 cursor-pointer ring-2 ring-emerald-300/40 animate-bounce duration-1000"
          aria-label="Open Rythu AI Mitra chat"
        >
          <div className="relative">
            <Bot className="w-5 h-5" />
            <span className="w-2 h-2 rounded-full bg-emerald-300 absolute -top-0.5 -right-0.5 animate-ping" />
          </div>
          <span className="hidden sm:inline font-heading tracking-wide">
            {t.chatWithAi}
          </span>
        </button>
      )}

      {/* Expanded Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[94vw] sm:w-[420px] h-[550px] max-h-[85vh] bg-[#071d13] border border-emerald-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-emerald-400/30 animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-900 to-teal-900 px-4 py-3 border-b border-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
                <Bot className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white font-heading">
                    Rythu AI Mitra
                  </h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[10px] text-emerald-300/80">
                  Powered by Gemini 3.8 · Visakhapatnam Smart Agri
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-emerald-800/50"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none shadow-md'
                      : 'bg-emerald-950/80 text-slate-200 border border-emerald-800/70 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <div
                    className={`mt-1.5 flex items-center justify-between text-[10px] ${
                      msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'assistant' && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="hover:text-emerald-300 ml-2"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Suggestions chips */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {msg.suggestions.map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(sug)}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-950/90 text-emerald-300 border border-emerald-800/80 hover:bg-emerald-900 hover:border-emerald-500 text-left transition-colors"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-950/40 w-fit text-xs text-emerald-300">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Rythu AI is analyzing agronomic data...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 bg-[#05170f] border-t border-emerald-900">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={t.askQuestionPlaceholder}
                  className="w-full bg-emerald-950/80 border border-emerald-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white cursor-pointer shadow-md"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
