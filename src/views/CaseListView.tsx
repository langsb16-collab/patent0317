import React from 'react';
import { useCaseStore } from '../store/useCaseStore';
import { translations, Locale } from '../lib/i18n';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical,
  ExternalLink,
  Globe
} from 'lucide-react';

interface CaseListViewProps {
  locale: Locale;
}

export default function CaseListView({ locale }: CaseListViewProps) {
  const t = translations[locale];
  const { cases } = useCaseStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'REGISTERED': return 'bg-emerald-100 text-emerald-700';
      case 'OA_RECEIVED': return 'bg-rose-100 text-rose-700';
      case 'FILED': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{t.caseManagement}</h2>
          <p className="text-slate-500 font-medium">Manage and track your global patent portfolio</p>
        </div>
        <button className="bg-[#1428A0] text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/10 active:scale-95">
          <Plus size={22} />
          {t.newAnalysis}
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4 bg-slate-50/30">
          <div className="flex-1 relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1428A0] transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search cases, clients, or inventors..." 
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:border-[#1428A0] focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-medium"
            />
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-all">
              <Filter size={18} />
              Filter
            </button>
            <button className="px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-all">
              <Globe size={18} />
              Country
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.caseId}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.caseTitle}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.client}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.status}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.dueDate}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.action}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {cases.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <span className="text-xs font-mono font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{c.id}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-black text-slate-900 group-hover:text-[#1428A0] transition-colors">{c.title}</span>
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                        <Globe size={10} /> {c.country}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-slate-600">{c.client}</td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(c.status)}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-slate-600">{c.dueDate || '-'}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <button className="p-2.5 text-slate-400 hover:text-[#1428A0] hover:bg-blue-50 rounded-xl transition-all">
                        <ExternalLink size={20} />
                      </button>
                      <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
