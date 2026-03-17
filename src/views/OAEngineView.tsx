import React, { useState } from 'react';
import { translations, Locale } from '../lib/i18n';
import { analyzeOA, OAAnalysisResult } from '../lib/ai/oaEngine';
import { 
  FileSearch, 
  Brain, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  Download,
  Copy,
  Sparkles
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

interface OAEngineViewProps {
  locale: Locale;
}

export default function OAEngineView({ locale }: OAEngineViewProps) {
  const t = translations[locale];
  const [oaText, setOaText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<OAAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!oaText.trim()) return;
    setIsAnalyzing(true);
    try {
      const langName = locale === 'ko' ? 'Korean' : 'English';
      const analysis = await analyzeOA(oaText, langName);
      setResult(analysis);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-[#1428A0] text-xs font-black uppercase tracking-widest">
          <Sparkles size={14} />
          AI Legal Intelligence
        </div>
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center justify-center gap-4">
          <Brain className="text-[#1428A0]" size={48} />
          {t.oaAnalysis}
        </h2>
        <p className="text-slate-500 font-medium text-lg">AI-powered Office Action analysis and response strategy generation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <FileText size={20} className="text-[#1428A0]" />
                {t.oaDocumentText}
              </h3>
              <button className="text-sm text-[#1428A0] font-black hover:underline uppercase tracking-wider">{t.uploadPdf}</button>
            </div>
            <textarea 
              value={oaText}
              onChange={(e) => setOaText(e.target.value)}
              placeholder="Paste the Office Action text here..."
              className="w-full h-[500px] p-6 bg-slate-50 border border-slate-200 rounded-[2rem] focus:border-[#1428A0] focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-medium resize-none leading-relaxed"
            />
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !oaText.trim()}
              className="w-full bg-[#1428A0] text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/10 disabled:opacity-50 active:scale-95"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{t.analyzingOa}</span>
                </>
              ) : (
                <>
                  <Sparkles size={22} />
                  {t.generateStrategy}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-8">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                {/* Summary Card */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="px-4 py-1.5 bg-rose-50 text-rose-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-rose-100">
                      {result.type}
                    </span>
                    <div className="flex gap-2">
                      <button className="p-2.5 text-slate-400 hover:text-[#1428A0] hover:bg-blue-50 rounded-xl transition-all"><Copy size={20} /></button>
                      <button className="p-2.5 text-slate-400 hover:text-[#1428A0] hover:bg-blue-50 rounded-xl transition-all"><Download size={20} /></button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xl font-black text-slate-900 tracking-tight">{t.executiveSummary}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">{result.summary}</p>
                  </div>
                </div>

                {/* Weaknesses Card */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
                  <h4 className="text-xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                    <AlertTriangle size={20} className="text-amber-500" />
                    {t.examinerWeakness}
                  </h4>
                  <ul className="space-y-3">
                    {result.weaknesses.map((w, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start gap-3 font-medium">
                        <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0 shadow-sm shadow-amber-200" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Strategy Card */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
                  <h4 className="text-xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                    <CheckCircle2 size={20} className="text-emerald-500" />
                    {t.recommendedStrategy}
                  </h4>
                  <div className="text-sm text-slate-600 prose prose-slate max-w-none font-medium leading-relaxed">
                    <ReactMarkdown>{result.strategy}</ReactMarkdown>
                  </div>
                </div>

                {/* Draft Response */}
                <div className="bg-slate-900 text-slate-100 p-8 rounded-[2.5rem] shadow-2xl space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-6">
                    <h4 className="text-xl font-black flex items-center gap-3 tracking-tight">
                      <FileText size={20} className="text-blue-400" />
                      {t.draftResponse}
                    </h4>
                    <button className="text-xs font-black bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all flex items-center gap-2 uppercase tracking-widest">
                      <Copy size={16} /> {t.copyDraft}
                    </button>
                  </div>
                  <div className="text-xs font-mono leading-relaxed opacity-80 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                    <ReactMarkdown>{result.draftResponse}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-16 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] space-y-6">
                <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center text-slate-200">
                  <FileSearch size={40} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-black text-slate-400 tracking-tight">{t.noAnalysisYet}</h4>
                  <p className="text-sm text-slate-400 font-medium">{t.enterOaText}</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
