import React, { useState } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useLocation 
} from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Brain, 
  FileSearch, 
  Settings, 
  Menu, 
  X,
  Globe,
  Bell,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Locale, translations } from './lib/i18n';
import LanguageSwitcher from './components/LanguageSwitcher';
import ChatWidget from './components/chat/ChatWidget';
import FaqBot from './components/faq/FaqBot';

// Import Views
import DashboardView from './views/DashboardView';
import CaseListView from './views/CaseListView';
import OAEngineView from './views/OAEngineView';
import AnalysisView from './views/AnalysisView';

const Sidebar = ({ locale, setLocale }: { locale: Locale, setLocale: (l: Locale) => void }) => {
  const location = useLocation();
  const t = translations[locale];

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: t.dashboard },
    { path: '/cases', icon: Briefcase, label: t.caseManagement },
    { path: '/analysis', icon: FileSearch, label: t.patentSearch },
    { path: '/oa-engine', icon: Brain, label: t.oaAnalysis },
    { path: '/settings', icon: Settings, label: t.settings },
  ];

  return (
    <aside className="hidden lg:flex w-72 bg-[#131826] border-r border-white/[0.08] flex-col sticky top-0 h-screen">
      <div className="p-8 flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-[#1428A0] to-[#3B82F6] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
          <Brain size={28} />
        </div>
        <div>
          <h1 className="text-xl font-black text-white tracking-tighter leading-none">VISION U</h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Patent OS</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-5 py-3.5 rounded-xl transition-all font-semibold group ${
              location.pathname === item.path 
                ? 'bg-gradient-to-r from-[#1428A0] to-[#1E3A8A] text-white shadow-lg shadow-blue-500/30' 
                : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
            }`}
          >
            <item.icon size={20} className="group-hover:scale-110 transition-transform" />
            <span className="text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-8 border-t border-white/[0.08]">
        <div className="bg-white/[0.04] rounded-2xl p-4 border border-white/[0.08]">
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-500/50" />
            <span className="text-xs font-bold text-slate-300">AI Engine Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

const MobileNav = ({ locale }: { locale: Locale }) => {
  const location = useLocation();
  const t = translations[locale];

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: t.dashboard },
    { path: '/cases', icon: Briefcase, label: t.caseManagement },
    { path: '/analysis', icon: FileSearch, label: t.patentSearch },
    { path: '/oa-engine', icon: Brain, label: t.oaAnalysis },
    { path: '/settings', icon: Settings, label: t.settings },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#131826]/95 backdrop-blur-xl border-t border-white/[0.08] px-6 py-3 flex items-center justify-between z-40 pb-safe">
      {menuItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex flex-col items-center gap-1 transition-all ${
            location.pathname === item.path ? 'text-[#3B82F6]' : 'text-slate-500'
          }`}
        >
          <item.icon size={20} />
          <span className="text-[10px] font-bold">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

const Navbar = ({ locale, setLocale }: { locale: Locale, setLocale: (l: Locale) => void }) => {
  const t = translations[locale];

  const languages: { code: Locale; label: string }[] = [
    { code: 'ko', label: '한국어' },
    { code: 'en', label: 'English' },
    { code: 'zh', label: '中文' },
    { code: 'ja', label: '日本語' },
    { code: 'ru', label: 'Русский' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'pt-BR', label: 'Português' },
    { code: 'id', label: 'Indonesia' },
    { code: 'ar', label: 'العربية' },
    { code: 'af', label: 'Afrikaans' },
  ];

  return (
    <header className="h-20 bg-[#131826]/80 backdrop-blur-xl border-b border-white/[0.08] px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-bold text-white lg:hidden">VISION U FREE</h2>
        <div className="hidden lg:flex items-center gap-2 text-sm text-slate-500 font-bold uppercase tracking-wider">
          <span>{t.dashboard}</span>
          <span>/</span>
          <span className="text-[#3B82F6]">Overview</span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <button className="p-2.5 text-slate-400 hover:text-white transition-all relative bg-white/[0.05] hover:bg-white/[0.1] rounded-xl">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#131826]" />
        </button>
        
        <LanguageSwitcher currentLocale={locale} setLocale={setLocale} languages={languages} />
      </div>
    </header>
  );
};

export default function App() {
  const [locale, setLocale] = useState<Locale>('ko');
  const t = translations[locale];

  return (
    <Router>
      <div className="flex min-h-screen bg-[#0B0F1A] font-sans text-slate-200">
        <Sidebar locale={locale} setLocale={setLocale} />
        
        <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
          <Navbar locale={locale} setLocale={setLocale} />
          
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<DashboardView locale={locale} />} />
              <Route path="/cases" element={<CaseListView locale={locale} />} />
              <Route path="/analysis" element={<AnalysisView locale={locale} />} />
              <Route path="/oa-engine" element={<OAEngineView locale={locale} />} />
              <Route path="/settings" element={<div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest">Settings coming soon...</div>} />
            </Routes>
          </main>
        </div>

        <MobileNav locale={locale} />
        <ChatWidget t={t} />
        <FaqBot t={t} />
      </div>
    </Router>
  );
}
