import React, { useState } from 'react';
import { useCaseStore } from '../store/useCaseStore';
import { translations, Locale } from '../lib/i18n';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical,
  ExternalLink,
  Globe,
  Edit,
  Trash2,
  Eye,
  FileText,
  Download
} from 'lucide-react';

interface CaseListViewProps {
  locale: Locale;
}

export default function CaseListView({ locale }: CaseListViewProps) {
  const t = translations[locale];
  const { cases } = useCaseStore();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'REGISTERED': return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      case 'OA_RECEIVED': return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
      case 'FILED': return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border border-slate-500/30';
    }
  };

  const handleAction = (action: string, caseId: string) => {
    console.log(`Action: ${action}, Case ID: ${caseId}`);
    setOpenMenuId(null);
    
    switch(action) {
      case 'view':
        alert(`${t.caseId}: ${caseId}\n상세보기 기능은 준비 중입니다.`);
        break;
      case 'edit':
        alert(`${t.caseId}: ${caseId}\n편집 기능은 준비 중입니다.`);
        break;
      case 'download':
        alert(`${t.caseId}: ${caseId}\nPDF 다운로드 기능은 준비 중입니다.`);
        break;
      case 'delete':
        if (confirm(`${t.caseId} ${caseId}를 정말 삭제하시겠습니까?`)) {
          alert('삭제 기능은 준비 중입니다.');
        }
        break;
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter">{t.caseManagement}</h2>
          <p className="text-slate-400 font-medium">Manage and track your global patent portfolio</p>
        </div>
        <button className="bg-gradient-to-r from-[#1428A0] to-[#1E3A8A] text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-blue-500/30 active:scale-95">
          <Plus size={22} />
          {t.newAnalysis}
        </button>
      </div>

      <div className="bg-[#131826] rounded-2xl shadow-xl border border-white/[0.08] overflow-hidden">
        <div className="p-6 border-b border-white/[0.08] flex flex-col md:flex-row gap-4 bg-white/[0.02]">
          <div className="flex-1 relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search cases, clients, or inventors..." 
              className="w-full pl-14 pr-6 py-4 bg-white/[0.05] border border-white/[0.1] rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm font-medium text-white placeholder:text-slate-500 backdrop-blur-sm"
            />
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-4 bg-white/[0.05] border border-white/[0.1] rounded-xl text-sm font-bold text-slate-300 flex items-center gap-2 hover:bg-white/[0.08] hover:text-white transition-all">
              <Filter size={18} />
              Filter
            </button>
            <button className="px-6 py-4 bg-white/[0.05] border border-white/[0.1] rounded-xl text-sm font-bold text-slate-300 flex items-center gap-2 hover:bg-white/[0.08] hover:text-white transition-all">
              <Globe size={18} />
              Country
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.03]">
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{t.caseId}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{t.caseTitle}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{t.client}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{t.status}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{t.dueDate}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{t.action}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {cases.map((c) => (
                <tr key={c.id} className="hover:bg-white/[0.03] transition-colors group">
                  <td className="px-8 py-6">
                    <span className="text-xs font-mono font-black text-slate-500 bg-white/[0.05] px-2 py-1 rounded-md">{c.id}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-black text-white group-hover:text-blue-400 transition-colors">{c.title}</span>
                      <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1 uppercase tracking-wider">
                        <Globe size={10} /> {c.country}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-slate-400">{c.client}</td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(c.status)}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-slate-400">{c.dueDate || '-'}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => window.open(`/case/${c.id}`, '_blank')}
                        className="p-2.5 text-slate-500 hover:text-blue-400 hover:bg-white/[0.05] rounded-xl transition-all"
                        title="Open in new tab"
                      >
                        <ExternalLink size={20} />
                      </button>
                      <div className="relative">
                        <button 
                          onClick={() => setOpenMenuId(openMenuId === c.id ? null : c.id)}
                          className="p-2.5 text-slate-500 hover:text-white hover:bg-white/[0.05] rounded-xl transition-all"
                        >
                          <MoreVertical size={20} />
                        </button>
                        
                        {openMenuId === c.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={() => setOpenMenuId(null)}
                            />
                            <div className="absolute right-0 mt-2 w-56 bg-[#1A2333] rounded-xl shadow-2xl border border-white/[0.1] overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-xl">
                              <div className="p-2 space-y-1">
                                <button
                                  onClick={() => handleAction('view', c.id)}
                                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-200 hover:bg-white/[0.08] rounded-lg transition-all"
                                >
                                  <Eye size={18} className="text-blue-400" />
                                  <span>상세보기</span>
                                </button>
                                <button
                                  onClick={() => handleAction('edit', c.id)}
                                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-200 hover:bg-white/[0.08] rounded-lg transition-all"
                                >
                                  <Edit size={18} className="text-emerald-400" />
                                  <span>편집</span>
                                </button>
                                <button
                                  onClick={() => handleAction('download', c.id)}
                                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-200 hover:bg-white/[0.08] rounded-lg transition-all"
                                >
                                  <Download size={18} className="text-violet-400" />
                                  <span>PDF 다운로드</span>
                                </button>
                                <div className="h-px bg-white/[0.1] my-1" />
                                <button
                                  onClick={() => handleAction('delete', c.id)}
                                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-400 hover:bg-rose-500/20 rounded-lg transition-all"
                                >
                                  <Trash2 size={18} />
                                  <span>삭제</span>
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
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
