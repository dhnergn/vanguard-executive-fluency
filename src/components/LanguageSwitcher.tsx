import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LANGUAGE_OPTIONS, SupportedLanguage } from '../data/translations';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, currentOption } = useLanguage();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/90 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-700 hover:bg-slate-850 transition-colors"
        aria-label="Dil seçimi"
        title="Dili Değiştir / Change Language"
      >
        <span className="text-sm">{currentOption.flag}</span>
        <span className="hidden sm:inline font-mono">{currentOption.code.toUpperCase()}</span>
        <ChevronDown className="h-3 w-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-50 w-52 rounded-xl border border-slate-800 bg-slate-900 p-1.5 shadow-2xl backdrop-blur-md">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 py-1">
            Dil Seçimi / Select Language
          </div>

          <div className="max-h-64 overflow-y-auto space-y-0.5">
            {LANGUAGE_OPTIONS.map((opt) => {
              const isSelected = opt.code === language;
              return (
                <button
                  key={opt.code}
                  onClick={() => handleSelect(opt.code)}
                  className={`w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors text-left ${
                    isSelected
                      ? 'bg-amber-500/10 text-amber-300 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{opt.flag}</span>
                    <span>{opt.nativeName}</span>
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-amber-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
