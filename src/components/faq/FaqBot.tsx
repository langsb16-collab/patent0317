import React, { useState } from 'react';
import { MessageSquare, X, Bot, ChevronRight, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FaqBotProps {
  t: any;
}

const FaqBot: React.FC<FaqBotProps> = ({ t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

  const questions = t.faqQuestions || [];
  const answers = t.faqAnswers || [];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-[400px] max-h-[600px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-[#1428A0] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-bold">{t.faqTitle}</h3>
                  <p className="text-xs text-white/70">AI Assistant Online</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50">
              {selectedQuestion === null ? (
                <>
                  <p className="text-xs font-bold text-slate-400 uppercase px-2 mb-2">Frequently Asked Questions</p>
                  {questions.map((q: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedQuestion(idx)}
                      className="w-full text-left p-4 bg-white rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all flex items-center justify-between group"
                    >
                      <span className="text-sm font-medium text-slate-700">{q}</span>
                      <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                    </button>
                  ))}
                </>
              ) : (
                <div className="space-y-4">
                  <button 
                    onClick={() => setSelectedQuestion(null)}
                    className="text-xs font-bold text-blue-600 hover:underline px-2"
                  >
                    ← Back to Questions
                  </button>
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <h4 className="font-bold text-slate-900 mb-4">{questions[selectedQuestion]}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {answers[selectedQuestion] || "Sorry, an answer for this question is not available in this language yet."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Type your question..."
                  className="w-full pl-4 pr-12 py-3 bg-slate-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-2xl shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'bg-slate-800 rotate-90' : 'bg-[#1428A0] hover:scale-110'
        } text-white`}
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </button>
    </div>
  );
};

export default FaqBot;
