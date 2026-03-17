import React from 'react';
import { 
  FolderPlus, 
  CalendarClock, 
  FileText, 
  Bot, 
  CreditCard, 
  Users 
} from 'lucide-react';
import { AutomationCard } from './AutomationCard';
import { translations, Locale } from '../../lib/i18n';

interface AutomationGridProps {
  locale: Locale;
  onNavigate: (view: string) => void;
}

export const AutomationGrid: React.FC<AutomationGridProps> = ({ locale, onNavigate }) => {
  const t = translations[locale];

  const tools = [
    {
      id: 'cases',
      title: t.createCaseTitle,
      description: t.createCaseDesc,
      icon: FolderPlus,
      color: 'bg-[#1428A0]',
      view: 'cases'
    },
    {
      id: 'deadlines',
      title: t.deadlineMgmtTitle,
      description: t.deadlineMgmtDesc,
      icon: CalendarClock,
      color: 'bg-emerald-600',
      view: 'deadlines'
    },
    {
      id: 'oa',
      title: t.oaResponseTitle,
      description: t.oaResponseDesc,
      icon: Bot,
      color: 'bg-indigo-600',
      view: 'oa'
    },
    {
      id: 'docs',
      title: t.docGenTitle,
      description: t.docGenDesc,
      icon: FileText,
      color: 'bg-blue-600',
      view: 'docs'
    },
    {
      id: 'fees',
      title: t.feeMgmtTitle,
      description: t.feeMgmtDesc,
      icon: CreditCard,
      color: 'bg-slate-900',
      view: 'fees'
    },
    {
      id: 'clients',
      title: t.clientMgmtTitle,
      description: t.clientMgmtDesc,
      icon: Users,
      color: 'bg-blue-800',
      view: 'clients'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool) => (
        <AutomationCard
          key={tool.id}
          title={tool.title}
          description={tool.description}
          icon={tool.icon}
          color={tool.color}
          onClick={() => onNavigate(tool.view)}
        />
      ))}
    </div>
  );
};
