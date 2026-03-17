import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface AutomationCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  color: string;
}

export const AutomationCard: React.FC<AutomationCardProps> = ({
  title,
  description,
  icon: Icon,
  onClick,
  color,
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02, translateY: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex flex-col items-start p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all text-left group w-full"
    >
      <div className={`p-4 rounded-2xl ${color} mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-black/5`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed font-medium">{description}</p>
    </motion.button>
  );
};
