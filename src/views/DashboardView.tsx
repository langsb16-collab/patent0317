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
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1428A0] via-[#1E3A8A] to-[#0A1E6A] rounded-[2rem] p-12 lg:p-16 text-white shadow-2xl shadow-blue-900/30 border border-white/[0.1]">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-3xl space-y-8">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-white text-xs font-black uppercase tracking-[0.2em] border border-white/20 backdrop-blur-sm"
            >
              <Sparkles size={14} className="text-blue-300" />
              AI Powered IP OS
            </motion.div>
            <h1 className="text-5xl lg:text-6xl font-black leading-[1.1] tracking-tighter">
              {t.title}
            </h1>
            <p className="text-lg lg:text-xl text-blue-100/80 leading-relaxed font-medium max-w-xl">
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
                className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-14 pr-6 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/15 transition-all text-base font-medium backdrop-blur-sm"
              />
            </div>
            <button 
              onClick={handleStartAnalysis}
              className="bg-white text-[#1428A0] px-8 py-4 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/20 group whitespace-nowrap"
            >
              {t.startAnalysis}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#131826] p-6 rounded-2xl shadow-lg border border-white/[0.08] flex flex-col space-y-4 hover:shadow-2xl hover:shadow-blue-500/10 transition-all group hover:border-white/[0.15]"
          >
            <div className={`w-12 h-12 ${card.bg} ${card.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
              <card.icon size={24} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{card.title}</div>
              <div className="text-3xl font-black text-white tracking-tight">{card.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Automation Hub Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-[#1428A0] to-[#3B82F6] rounded-xl text-white shadow-lg shadow-blue-500/30">
              <Zap size={22} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white tracking-tight">{t.automationHubTitle}</h3>
              <p className="text-slate-400 font-medium text-sm">{t.automationHubDesc}</p>
            </div>
          </div>
          <button className="hidden sm:flex items-center gap-2 text-sm font-bold text-[#3B82F6] hover:text-[#60A5FA] transition-colors">
            View All Tools <ChevronRight size={16} />
          </button>
        </div>
        <AutomationGrid locale={locale} onNavigate={handleAutomationNavigate} />
      </section>

      {/* Activity and Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#131826] p-6 rounded-2xl shadow-lg border border-white/[0.08]">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-400" />
            {t.recentActivity}
          </h3>
          <div className="space-y-3">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-white/[0.04] rounded-xl transition-colors cursor-pointer group border border-transparent hover:border-white/[0.08]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/[0.06] rounded-full flex items-center justify-center text-slate-400 group-hover:text-blue-400 transition-colors">
                    <FileText size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-200">New Patent Filed: Image AI</div>
                    <div className="text-xs text-slate-500">2 hours ago • TechCorp Inc.</div>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-600 group-hover:text-blue-400 transition-colors" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#131826] p-6 rounded-2xl shadow-lg border border-white/[0.08]">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Clock size={20} className="text-rose-400" />
            {t.upcomingDeadlines}
          </h3>
          <div className="space-y-3">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border-l-4 border-rose-500 bg-rose-500/10 rounded-r-xl backdrop-blur-sm">
                <div>
                  <div className="text-sm font-bold text-slate-200">OA Response Due</div>
                  <div className="text-xs text-slate-500">Case: PAT-2024-002 • 3 days left</div>
                </div>
                <button className="text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors">View</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
