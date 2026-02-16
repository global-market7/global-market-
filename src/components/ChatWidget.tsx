import { useState, useRef, useEffect } from 'react';
import { X, Send, Paperclip, Smile } from 'lucide-react';

interface ChatMessage {
  id: string;
  text: string;
  isMe: boolean;
  time: Date;
}

interface Props {
  open: boolean;
  sellerName: string;
  messages: ChatMessage[];
  onClose: () => void;
  onSend: (text: string) => void;
}

export function ChatWidget({ open, sellerName, messages, onClose, onSend }: Props) {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0 && !messages[messages.length - 1].isMe) {
      setIsTyping(false);
    }
  }, [messages]);

  if (!open) return null;

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput('');
    setIsTyping(true);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-24 left-5 w-[380px] max-w-[calc(100vw-40px)] h-[520px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col z-[999] overflow-hidden animate-[slideUp_0.3s_ease-out]">
      {/* Header */}
      <div className="bg-gradient-to-l from-blue-600 via-blue-700 to-indigo-700 text-white p-4 flex justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-40 h-40 bg-white/5 rounded-full -translate-x-20 -translate-y-20" />
        <div className="flex items-center gap-3 relative z-10">
          <div className="relative">
            <div className="w-11 h-11 bg-white/15 backdrop-blur rounded-xl flex items-center justify-center font-bold text-lg">
              {sellerName.charAt(0)}
            </div>
            <div className="absolute -bottom-0.5 -left-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-blue-700" />
          </div>
          <div>
            <div className="font-bold text-sm">{sellerName}</div>
            <div className="text-[11px] text-blue-200">متصل الآن • يرد عادة خلال دقائق</div>
          </div>
        </div>
        <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-xl transition-colors relative z-10">
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-slate-50 to-white flex flex-col gap-3 custom-scrollbar">
        <div className="text-center">
          <span className="text-[10px] text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100">
            بداية المحادثة
          </span>
        </div>

        {messages.map(msg => (
          <div
            key={msg.id}
            className={`max-w-[80%] animate-[fadeInUp_0.3s_ease-out] ${msg.isMe ? 'self-end' : 'self-start'}`}
          >
            <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.isMe
                ? 'bg-gradient-to-l from-blue-600 to-indigo-600 text-white rounded-bl-md shadow-sm'
                : 'bg-white text-slate-700 rounded-br-md border border-slate-100 shadow-sm'
            }`}>
              {msg.text}
            </div>
            <span className={`text-[10px] text-slate-400 mt-1 block ${msg.isMe ? 'text-left' : 'text-right'}`}>
              {formatTime(msg.time)}
              {msg.isMe && ' ✓✓'}
            </span>
          </div>
        ))}

        {isTyping && (
          <div className="self-start animate-[fadeIn_0.3s]">
            <div className="bg-white px-4 py-3 rounded-2xl rounded-br-md border border-slate-100 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick replies */}
      <div className="px-3 py-2 flex gap-2 overflow-x-auto scrollbar-hide border-t border-slate-50">
        {['ما السعر؟', 'هل يتوفر شحن؟', 'أريد عينة', 'ما MOQ؟'].map(text => (
          <button
            key={text}
            onClick={() => { setInput(text); }}
            className="text-[11px] text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full whitespace-nowrap hover:bg-blue-100 transition-colors font-medium flex-shrink-0"
          >
            {text}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-slate-100 flex gap-2 items-center bg-white">
        <button className="text-slate-400 hover:text-slate-600 p-1.5 transition-colors">
          <Paperclip size={18} />
        </button>
        <button className="text-slate-400 hover:text-slate-600 p-1.5 transition-colors">
          <Smile size={18} />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="اكتب رسالتك..."
          className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400 transition-colors"
          style={{ fontFamily: "'Tajawal', sans-serif" }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl flex items-center justify-center hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
