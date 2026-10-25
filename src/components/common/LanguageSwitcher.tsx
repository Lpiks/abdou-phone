'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/lib/translations';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; label: string; full: string }[] = [
    { code: 'ar', label: 'عربي', full: 'العربية' },
    { code: 'fr', label: 'FR', full: 'Français' },
    { code: 'en', label: 'EN', full: 'English' },
  ];

  return (
    <div
      className={`inline-flex items-center gap-1 p-1 rounded-xl bg-phone-surface border border-phone-border ${className}`}
      dir="ltr"
    >
      <Globe className="w-3.5 h-3.5 text-phone-dim ml-1.5 shrink-0 hidden sm:inline" />
      {languages.map((l) => {
        const isActive = language === l.code;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => setLanguage(l.code)}
            title={l.full}
            className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer select-none ${
              isActive
                ? 'bg-phone-frost text-phone-void shadow-sm'
                : 'text-phone-muted hover:text-phone-frost hover:bg-phone-surface-hover'
            }`}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
