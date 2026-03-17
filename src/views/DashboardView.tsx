import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats } from '../lib/api/cases';
import { translations, Locale } from '../lib/i18n';
import { 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  ChevronRight,
  TrendingUp,
  Zap,
  Search,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AutomationGrid } from '../components/automation/AutomationGrid';

interface DashboardViewProps {
  locale: Locale;
}

export default function DashboardView({ locale }: DashboardViewProps) {
  const t = translations[locale];
  const navigate = useNavigate();
  const [idea, setIdea] = useState('');
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats
  });

  if (isLoading) return <div className="flex items-center justify-center h-full">Loading...</div>;

  const cards = [
    { title: t.totalCases, value: stats?.totalCases, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: t.pendingOAs, value: stats?.pendingOAs, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: t.registeredPatents, value: stats?.registeredPatents, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: t.upcomingDeadlines, value: stats?.upcomingDeadlines, icon: Clock, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  const handleAutomationNavigate = (view: string) => {
    switch(view) {
      case 'cases': navigate('/cases'); break;
      case 'deadlines': navigate('/cases'); break;
      case 'oa': navigate('/oa-engine'); break;
      case 'docs': navigate('/analysis'); break;
      case 'fees': navigate('/settings'); break;
      case 'clients': navigate('/settings'); break;
      default: navigate('/');
    }
  };

  const handleStartAnalysis = () => {
    if (idea.trim()) {
      navigate('/analysis', { state: { idea } });
    }
  };

  return (
    <div className="space-y-12 p-8 max-w-7xl mx-auto">
      {/* Hero Section: Idea Input */}
      <section className="relative overflow-hidden bg-[#1428A0] rounded-[3rem] p-16 text-white shadow-2xl shadow-blue-900/20">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-10">
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-white text-xs font-black uppercase tracking-[0.2em] border border-white/20 backdrop-blur-sm"
            >
              <Sparkles size={14} className="text-blue-300" />
              AI Powered IP OS
            </motion.div>
            <h1 className="text-6xl font-black leading-[1.1] tracking-tighter">
              {t.title}
            </h1>
            <p className="text-xl text-blue-100/70 leading-relaxed font-medium max-w-xl">
              {t.subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" size={22} />
              <input 
                type="text"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder={t.ideaPlaceholder}
                className="w-full bg-white/10 border border-white/20 rounded-3xl py-5 pl-14 pr-6 text-white placeholder:text-white/30 focus:outline-none focus:ring-4 focus:ring-white/10 focus:bg-white/15 transition-all text-lg font-medium"
              />
            </div>
            <button 
              onClick={handleStartAnalysis}
              className="bg-white text-[#1428A0] px-10 py-5 rounded-3xl font-black text-lg flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/10 group"
            >
              {t.startAnalysis}
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col space-y-6 hover:shadow-xl hover:shadow-blue-900/5 transition-all group"
          >
            <div className={`w-14 h-14 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <card.icon size={28} />
            </div>
            <div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{card.title}</div>
              <div className="text-4xl font-black text-slate-900 tracking-tighter">{card.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Automation Hub Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#1428A0] rounded-2xl text-white shadow-lg shadow-blue-200">
              <Zap size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t.automationHubTitle}</h3>
              <p className="text-slate-500 font-medium">{t.automationHubDesc}</p>
            </div>
          </div>
          <button className="hidden sm:flex items-center gap-2 text-sm font-bold text-[#1428A0] hover:underline">
            View All Tools <ChevronRight size={16} />
          </button>
        </div>
        <AutomationGrid locale={locale} onNavigate={handleAutomationNavigate} />
      </section>

      {/* Activity and Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-600" />
            {t.recentActivity}
          </h3>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                    <FileText size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">New Patent Filed: Image AI</div>
                    <div className="text-xs text-slate-500">2 hours ago • TechCorp Inc.</div>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Clock size={20} className="text-rose-600" />
            {t.upcomingDeadlines}
          </h3>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border-l-4 border-rose-500 bg-rose-50/30 rounded-r-xl">
                <div>
                  <div className="text-sm font-bold text-slate-800">OA Response Due</div>
                  <div className="text-xs text-slate-500">Case: PAT-2024-002 • 3 days left</div>
                </div>
                <button className="text-xs font-bold text-rose-600 hover:underline">View</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
