import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Image as ImageIcon, Mic, Phone, Video, Globe, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'image' | 'voice';
  translation?: string;
  mediaUrl?: string;
}

interface ChatWidgetProps {
  t: any;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! How can I help you with your patent today?",
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm analyzing your request. This is a simulated response for the translation chat.",
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
        translation: "요청을 분석 중입니다. 이것은 번역 채팅을 위한 시뮬레이션 응답입니다."
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 30) {
          stopRecording();
          return 30;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    if (recordingTime > 0) {
      const voiceMsg: Message = {
        id: Date.now().toString(),
        text: `Voice message (${recordingTime}s)`,
        sender: 'user',
        timestamp: new Date(),
        type: 'voice'
      };
      setMessages(prev => [...prev, voiceMsg]);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 left-0 w-[400px] h-[600px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    AI
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{t.chatTitle}</h3>
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Active Now</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                  <Phone size={18} />
                </button>
                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                  <Video size={18} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50"
            >
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${msg.sender === 'user' ? 'order-2' : ''}`}>
                    <div className={`p-4 rounded-2xl shadow-sm ${
                      msg.sender === 'user' 
                        ? 'bg-[#1428A0] text-white rounded-tr-none' 
                        : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                    }`}>
                      {msg.type === 'voice' ? (
                        <div className="flex items-center gap-2">
                          <Mic size={16} />
                          <div className="h-1 w-24 bg-white/30 rounded-full overflow-hidden">
                            <div className="h-full bg-white w-1/2" />
                          </div>
                          <span className="text-xs">{msg.text}</span>
                        </div>
                      ) : (
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      )}
                      
                      {msg.translation && (
                        <div className="mt-2 pt-2 border-t border-white/10 text-[11px] opacity-80 italic flex items-center gap-1">
                          <Globe size={10} />
                          {msg.translation}
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 px-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              {isRecording ? (
                <div className="flex items-center justify-between bg-rose-50 p-3 rounded-2xl border border-rose-100">
                  <div className="flex items-center gap-3 text-rose-600">
                    <div className="w-2 h-2 bg-rose-600 rounded-full animate-pulse" />
                    <span className="text-sm font-bold">Recording... {recordingTime}s / 30s</span>
                  </div>
                  <button 
                    onClick={stopRecording}
                    className="px-4 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 transition-colors"
                  >
                    STOP
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                    <ImageIcon size={20} />
                  </button>
                  <button 
                    onMouseDown={startRecording}
                    onMouseUp={stopRecording}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                  >
                    <Mic size={20} />
                  </button>
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder={t.message + "..."}
                      className="w-full pl-4 pr-10 py-3 bg-slate-50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                    <button 
                      onClick={handleSend}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-2xl shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'bg-slate-800 -rotate-90' : 'bg-white hover:scale-110 border border-slate-100'
        }`}
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <MessageCircle size={24} className="text-[#1428A0]" />
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
