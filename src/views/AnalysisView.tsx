import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Search, 
  Globe, 
  MessageSquare, 
  HelpCircle, 
  Send, 
  Mic, 
  Image as ImageIcon, 
  Sparkles,
  ChevronRight,
  Download,
  FileCheck,
  ShieldCheck,
  Scale,
  Zap,
  CheckCircle2,
  AlertCircle,
  X,
  User,
  Phone,
  CreditCard,
  Check,
  FileText,
  Calendar,
  Share2,
  FileSearch
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { translations, Locale } from '../lib/i18n';
import { GoogleGenAI } from "@google/genai";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

interface AnalysisViewProps {
  locale: Locale;
}

export default function AnalysisView({ locale }: AnalysisViewProps) {
  const t = translations[locale];
  const location = useLocation();
  const [idea, setIdea] = useState(location.state?.idea || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  
  // 멀티모달 입력 상태
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isChatting, setIsChatting] = useState(false);
  const [showFilingModal, setShowFilingModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [filingStep, setFilingStep] = useState(1);
  const [filingData, setFilingData] = useState({
    name: '',
    residentNumber: '',
    phone: ''
  });
  const [isFiling, setIsFiling] = useState(false);
  const [filingSuccess, setFilingSuccess] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  useEffect(() => {
    if (location.state?.idea) {
      analyzeIdea(location.state.idea);
    }
  }, []);

  const analyzeIdea = async (ideaText: string = idea) => {
    if (!ideaText.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    setChatMessages([]);

    const model = "gemini-3-flash-preview";
    const prompt = `
      You are a world-class Senior Patent Attorney and IP Strategist. 
      Analyze the following invention idea and provide a comprehensive, professional patentability report in ${locale === 'ko' ? 'Korean' : 'English'}.
      
      Idea: ${ideaText}
      
      Your analysis must include:
      1. Novelty Score (0-100%): How unique is this compared to existing technology?
      2. Similarity Score (0-100%): How much does it overlap with known patents?
      3. Patentability Assessment: A clear Yes/No/Maybe with reasoning.
      4. Executive Summary: A concise overview of the invention and its core value proposition.
      5. Similar Patents: List 3-4 hypothetical or real-world similar patent categories/examples with similarity percentages.
      6. Strategic Recommendations: Actionable steps for filing and strengthening the IP.
      7. FAQs: 3 common questions a client might have about this specific idea.

      Provide the response strictly in JSON format:
      {
        "noveltyScore": number,
        "similarityScore": number,
        "patentPossible": boolean,
        "summary": "string (markdown supported)",
        "similarPatents": [{"id": "string", "title": "string", "similarity": number}],
        "strategy": "string (markdown supported)",
        "faqs": [{"q": "string", "a": "string"}]
      }
    `;

    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { 
          responseMimeType: "application/json",
          temperature: 0.7
        }
      });
      
      const text = response.text;
      if (!text) throw new Error("Empty response from AI");
      
      const data = JSON.parse(text);
      setResult(data);
      
      // Initial welcome message from AI
      setChatMessages([{
        role: 'assistant',
        text: locale === 'ko' 
          ? `분석이 완료되었습니다! 이 아이디어의 신규성 점수는 **${data.noveltyScore}%**입니다. 추가로 궁금하신 점이 있으신가요?`
          : `Analysis complete! The novelty score for this idea is **${data.noveltyScore}%**. Do you have any further questions?`
      }]);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 멀티모달 핸들러
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);

    // 이미지 프리뷰 생성
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('audio/')) {
      setFilePreview('🎵 ' + file.name);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        setFilePreview('🎤 녹음 완료');
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Recording error:', error);
      alert('마이크 접근 권한이 필요합니다.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const analyzeMultimodal = async () => {
    if (!idea.trim() && !uploadedFile && !audioBlob) {
      alert('텍스트, 이미지 또는 음성을 입력해주세요.');
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      let finalText = idea;

      // 이미지 처리
      if (uploadedFile && uploadedFile.type.startsWith('image/')) {
        const imageBase64 = await fileToBase64(uploadedFile);
        const imageAnalysis = await analyzeImage(imageBase64);
        finalText += '\n\n[이미지 설명]: ' + imageAnalysis;
      }

      // 음성 처리
      if (audioBlob) {
        const audioText = await transcribeAudio(audioBlob);
        finalText += '\n\n[음성 입력]: ' + audioText;
      } else if (uploadedFile && uploadedFile.type.startsWith('audio/')) {
        const audioText = await transcribeAudio(uploadedFile);
        finalText += '\n\n[음성 입력]: ' + audioText;
      }

      // 통합 분석
      await analyzeIdea(finalText);
    } catch (error) {
      console.error('Multimodal analysis error:', error);
      alert('분석 중 오류가 발생했습니다.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const analyzeImage = async (imageBase64: string): Promise<string> => {
    try {
      const model = "gemini-3-flash-preview";
      const response = await ai.models.generateContent({
        model,
        contents: [
          {
            parts: [
              { text: "이 이미지를 자세히 설명하고, 특허 출원 관점에서 핵심 기술적 특징을 분석해주세요." },
              { 
                inlineData: { 
                  mimeType: "image/jpeg",
                  data: imageBase64.split(',')[1]
                }
              }
            ]
          }
        ]
      });
      return response.text || '이미지 분석 실패';
    } catch (error) {
      console.error('Image analysis error:', error);
      return '이미지 분석 중 오류 발생';
    }
  };

  const transcribeAudio = async (audio: Blob | File): Promise<string> => {
    // 실제 구현에서는 Whisper API 또는 다른 음성 인식 서비스 사용
    // 여기서는 시뮬레이션
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('음성 입력: 스마트 온도 제어 시스템에 대한 아이디어입니다. 사용자의 생활 패턴을 학습하여 자동으로 최적 온도를 유지합니다.');
      }, 1000);
    });
  };

  const handleChat = async () => {
    if (!chatInput.trim() || isChatting) return;
    
    const userMsg = { role: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatting(true);

    const model = "gemini-3-flash-preview";
    const history = chatMessages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`).join('\n');
    
    try {
      const response = await ai.models.generateContent({
        model,
        contents: `
          Context of the Patent Analysis: ${JSON.stringify(result)}
          
          Conversation History:
          ${history}
          
          User's New Question: ${chatInput}
          
          As a professional Patent Attorney, provide a helpful and accurate response in ${locale === 'ko' ? 'Korean' : 'English'}.
        `,
        config: { 
          systemInstruction: "You are a professional Patent Attorney assistant. Be precise, helpful, and maintain a professional tone.",
          temperature: 0.8
        }
      });
      
      const aiText = response.text;
      if (aiText) {
        setChatMessages(prev => [...prev, { role: 'assistant', text: aiText }]);
      }
    } catch (error) {
      console.error("Chat failed:", error);
    } finally {
      setIsChatting(false);
    }
  };

  const handleCopySummary = () => {
    if (result?.summary) {
      navigator.clipboard.writeText(result.summary);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('analysis-report');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      const filename = `Patent_Analysis_${new Date().getTime()}.pdf`;
      pdf.save(filename);
    } catch (error) {
      console.error('PDF generation failed:', error);
    }
  };

  const handleFiling = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFiling(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsFiling(false);
    setFilingSuccess(true);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-50 overflow-hidden">
      {/* Input Section */}
      <div className="w-full lg:w-[450px] flex flex-col bg-white border-r border-slate-100 shadow-2xl z-10">
        <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{t.patentAnalysis}</h2>
            <p className="text-slate-500 font-medium">AI-powered global patentability assessment</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{t.ideaTitle}</label>
              <input 
                type="text" 
                value={idea.split('\n')[0] || ''}
                onChange={(e) => setIdea(e.target.value + '\n' + (idea.split('\n').slice(1).join('\n') || ''))}
                placeholder="e.g., Smart AI-powered Coffee Machine"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#1428A0] focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-medium"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{t.ideaDescription}</label>
              <textarea 
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder={t.ideaPlaceholder}
                className="w-full h-64 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-[#1428A0] focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-medium resize-none leading-relaxed"
              />
            </div>

            {/* 멀티모달 입력 UI */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">멀티모달 입력</label>
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                >
                  <ImageIcon size={18} />
                  이미지/음성 업로드
                </button>
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`px-4 py-3 border rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    isRecording 
                      ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' 
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Mic size={18} />
                  {isRecording ? '녹음 중지' : '음성 녹음'}
                </button>
              </div>
              
              {/* 파일 프리뷰 */}
              {filePreview && (
                <div className="relative p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3">
                  {uploadedFile?.type.startsWith('image/') ? (
                    <img src={filePreview} alt="preview" className="w-16 h-16 object-cover rounded-lg" />
                  ) : (
                    <div className="text-2xl">{filePreview.split(' ')[0]}</div>
                  )}
                  <div className="flex-1 text-xs font-bold text-slate-700">
                    {uploadedFile?.name || filePreview}
                  </div>
                  <button
                    onClick={() => {
                      setUploadedFile(null);
                      setFilePreview(null);
                      setAudioBlob(null);
                    }}
                    className="p-1 hover:bg-blue-100 rounded-lg transition-all"
                  >
                    <X size={16} className="text-slate-400" />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{t.targetCountries}</label>
              <div className="grid grid-cols-2 gap-2">
                {['US', 'KR', 'CN', 'JP', 'EP', 'DE'].map(country => (
                  <button 
                    key={country}
                    className="px-4 py-3 rounded-xl text-xs font-black transition-all border bg-white text-slate-400 border-slate-200 hover:border-slate-300"
                  >
                    {country}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-slate-50/50 border-t border-slate-100">
          <button 
            onClick={() => analyzeMultimodal()}
            disabled={isAnalyzing || (!idea.trim() && !uploadedFile && !audioBlob)}
            className="w-full bg-[#1428A0] text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/10 disabled:opacity-50 active:scale-95"
          >
            {isAnalyzing ? (
              <>
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t.analyzing}</span>
              </>
            ) : (
              <>
                <Sparkles size={22} />
                {t.startAnalysis}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Report Section */}
      <div className="flex-1 overflow-y-auto bg-slate-50 custom-scrollbar">
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-12 max-w-5xl mx-auto space-y-12"
            >
              {/* Report Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-[#1428A0] text-[10px] font-black uppercase tracking-widest">
                    <FileText size={14} />
                    {t.patentabilityReport}
                  </div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tighter">{idea.split('\n')[0] || 'Patent Analysis Report'}</h1>
                  <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date().toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5"><Globe size={14} /> Global</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={handleDownloadPDF}
                    className="p-4 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-100 transition-all border border-slate-200"
                  >
                    <Download size={24} />
                  </button>
                  <button className="p-4 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-100 transition-all border border-slate-200">
                    <Share2 size={24} />
                  </button>
                  <button 
                    onClick={() => setShowFilingModal(true)}
                    className="bg-[#1428A0] text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/10"
                  >
                    <Send size={20} />
                    {t.filePatent}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Report */}
                <div className="lg:col-span-2 space-y-8">
                  <div id="analysis-report" className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 space-y-10">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-8">
                      <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <FileCheck className="text-[#1428A0]" size={24} />
                        </div>
                        {t.patentResult}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-8 bg-blue-50 rounded-3xl text-center space-y-2 border border-blue-100">
                        <div className="text-[10px] font-black text-[#1428A0] uppercase tracking-widest">{t.noveltyScore}</div>
                        <div className="text-5xl font-black text-[#1428A0] tracking-tighter">{result.noveltyScore}%</div>
                      </div>
                      <div className="p-8 bg-amber-50 rounded-3xl text-center space-y-2 border border-amber-100">
                        <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{t.similarityScore}</div>
                        <div className="text-5xl font-black text-amber-700 tracking-tighter">{result.similarityScore}%</div>
                      </div>
                      <div className="p-8 bg-emerald-50 rounded-3xl text-center space-y-2 border border-emerald-100">
                        <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Possibility</div>
                        <div className="text-2xl font-black text-emerald-700 tracking-tight">
                          {result.patentPossible ? t.patentPossible : t.patentImpossible}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Analysis Summary</h3>
                        <button 
                          onClick={handleCopySummary}
                          className="text-sm text-[#1428A0] font-black hover:underline flex items-center gap-1 uppercase tracking-wider"
                        >
                          {copySuccess ? <CheckCircle2 size={14} /> : <Sparkles size={14} />}
                          {copySuccess ? 'Copied!' : 'Copy Summary'}
                        </button>
                      </div>
                      <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed bg-slate-50 p-8 rounded-3xl border border-slate-100 font-medium">
                        <ReactMarkdown>{result.summary}</ReactMarkdown>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">Strategic Recommendations</h3>
                      <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed bg-blue-50/30 p-8 rounded-3xl border border-blue-100/50 font-medium">
                        <ReactMarkdown>{result.strategy}</ReactMarkdown>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">Similar Patents</h3>
                      <div className="grid grid-cols-1 gap-4">
                        {result.similarPatents.map((p: any, i: number) => (
                          <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all group">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 font-black shadow-sm border border-slate-100 group-hover:text-[#1428A0] transition-colors">
                                {p.id}
                              </div>
                              <span className="font-black text-slate-800 tracking-tight">{p.title}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-24 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-[#1428A0]" style={{ width: `${p.similarity}%` }} />
                              </div>
                              <span className="text-sm font-black text-[#1428A0]">{p.similarity}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Filing Section */}
                  <div className="bg-slate-900 p-12 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] pointer-events-none" />
                    <div className="space-y-4 relative z-10">
                      <h3 className="text-4xl font-black tracking-tighter">{t.electronicFiling}</h3>
                      <p className="text-slate-400 max-w-md font-medium">Start your patent application process instantly with AI assistance and expert review.</p>
                    </div>
                    <button 
                      onClick={() => setShowFilingModal(true)}
                      className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-xl hover:bg-blue-50 transition-all shadow-xl shadow-white/10 relative z-10 flex items-center gap-2 group"
                    >
                      {t.submit}
                      <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Sidebar: Chat & FAQ */}
                <div className="space-y-8">
                  {/* Chat Box */}
                  <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col h-[600px] overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                      <div className="p-2 bg-[#1428A0] rounded-lg text-white">
                        <MessageSquare size={20} />
                      </div>
                      <h3 className="font-black text-slate-900 tracking-tight">{t.chatTitle}</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                      {chatMessages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] p-5 rounded-2xl text-sm leading-relaxed font-medium ${
                            msg.role === 'user' 
                              ? 'bg-[#1428A0] text-white rounded-tr-none shadow-md' 
                              : 'bg-slate-100 text-slate-700 rounded-tl-none'
                          }`}>
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                          </div>
                        </div>
                      ))}
                      {isChatting && (
                        <div className="flex justify-start">
                          <div className="bg-slate-100 p-5 rounded-2xl flex gap-1.5">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>
                    <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleChat()}
                          placeholder={t.message}
                          className="flex-1 bg-white border border-slate-200 rounded-xl px-5 py-4 text-sm font-medium focus:ring-4 focus:ring-blue-500/5 focus:border-[#1428A0] transition-all"
                        />
                        <button 
                          onClick={handleChat}
                          disabled={isChatting || !chatInput.trim()}
                          className="p-4 bg-[#1428A0] text-white rounded-xl hover:bg-blue-800 transition-all disabled:opacity-50"
                        >
                          <Send size={20} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* FAQ Section */}
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-8">
                    <h3 className="font-black text-slate-900 flex items-center gap-3 tracking-tight">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <HelpCircle className="text-[#1428A0]" size={20} />
                      </div>
                      {t.faqTitle}
                    </h3>
                    <div className="space-y-6">
                      {result.faqs.map((faq: any, i: number) => (
                        <div key={i} className="space-y-2 group">
                          <div className="text-sm font-black text-slate-800 group-hover:text-[#1428A0] transition-colors tracking-tight">Q: {faq.q}</div>
                          <div className="text-sm text-slate-500 leading-relaxed font-medium">A: {faq.a}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-20 space-y-8">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full" />
                <div className="relative w-32 h-32 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center text-slate-200">
                  <FileSearch size={64} />
                </div>
              </div>
              <div className="max-w-md space-y-4">
                <h3 className="text-3xl font-black text-slate-300 tracking-tighter">{t.noReportYet}</h3>
                <p className="text-slate-400 font-medium leading-relaxed">{t.enterDetails}</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Filing Modal */}
      <AnimatePresence>
        {showFilingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilingModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{t.filingFormTitle}</h3>
                  <button onClick={() => setShowFilingModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <X size={24} />
                  </button>
                </div>

                {!filingSuccess ? (
                  <form onSubmit={handleFiling} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.userName}</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                          required
                          type="text"
                          value={filingData.name}
                          onChange={(e) => setFilingData({...filingData, name: e.target.value})}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-[#1428A0] transition-all font-medium"
                          placeholder="Full Name"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.residentNumber}</label>
                      <div className="relative">
                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                          required
                          type="password"
                          value={filingData.residentNumber}
                          onChange={(e) => setFilingData({...filingData, residentNumber: e.target.value})}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-[#1428A0] transition-all font-medium"
                          placeholder="ID Number"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.phoneNumber}</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                          required
                          type="tel"
                          value={filingData.phone}
                          onChange={(e) => setFilingData({...filingData, phone: e.target.value})}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-[#1428A0] transition-all font-medium"
                          placeholder="Phone Number"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isFiling}
                      className="w-full bg-[#1428A0] text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/10 disabled:opacity-50 mt-4 active:scale-95"
                    >
                      {isFiling ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>{t.filingProcessing}</span>
                        </div>
                      ) : t.submit}
                    </button>
                  </form>
                ) : (
                  <div className="text-center space-y-8 py-10">
                    <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <Check size={48} />
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{t.filingSuccess}</h4>
                      <p className="text-slate-500 text-lg font-medium">Your application has been submitted to the Patent Office.</p>
                    </div>
                    <button 
                      onClick={() => setShowFilingModal(false)}
                      className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all"
                    >
                      {t.close}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
