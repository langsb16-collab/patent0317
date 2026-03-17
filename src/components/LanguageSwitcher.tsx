import React from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { Locale } from '../lib/i18n';

interface LanguageSwitcherProps {
  currentLocale: Locale;
  setLocale: (locale: Locale) => void;
  languages: { code: Locale; label: string }[];
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ currentLocale, setLocale, languages }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-sm font-medium text-slate-700"
      >
        <Globe size={16} className="text-blue-600" />
        <span>{languages.find(l => l.code === currentLocale)?.label}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 py-2 overflow-hidden">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLocale(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                  currentLocale === lang.code 
                    ? 'bg-blue-50 text-blue-700 font-bold' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {lang.label}
                {currentLocale === lang.code && (
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
