'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/lib/translations';
import { Globe, ChevronDown, Check } from 'lucide-react';

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const languages: { code: Language; short: string; label: string }[] = [
    { code: 'ar', short: 'عربي', label: 'العربية' },
    { code: 'fr', short: 'FR', label: 'Français' },
    { code: 'en', short: 'EN', label: 'English' },
  ];

  const currentLang = languages.find((l) => l.code === language) || languages[1];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`} dir="ltr">
      {/* Compact Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Changer de langue / Change language / تغيير اللغة"
        aria-expanded={isOpen}
        className="h-9 sm:h-10 px-2 sm:px-2.5 rounded-xl bg-phone-surface border border-phone-border hover:border-phone-border-light text-phone-frost text-xs font-bold font-mono flex items-center gap-1 sm:gap-1.5 cursor-pointer select-none transition-all hover:bg-phone-surface-hover active:scale-95 shrink-0"
      >
        <Globe className="w-3.5 h-3.5 text-phone-emerald shrink-0" />
        <span className="uppercase text-[11px] sm:text-xs">{currentLang.short}</span>
        <ChevronDown
          className={`w-3 h-3 text-phone-dim transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-phone-emerald' : ''
          }`}
        />
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-36 sm:w-40 rounded-2xl bg-phone-surface border border-phone-border shadow-2xl p-1.5 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="px-2.5 py-1 text-[10px] font-mono uppercase text-phone-dim border-b border-phone-border mb-1">
            Langue / اللغة
          </div>
          {languages.map((l) => {
            const isActive = language === l.code;
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => {
                  setLanguage(l.code);
                  setIsOpen(false);
                }}
                className={`w-full px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer select-none ${
                  isActive
                    ? 'bg-phone-emerald/15 text-phone-emerald font-bold'
                    : 'text-phone-muted hover:text-phone-frost hover:bg-phone-surface-hover'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] sm:text-[11px] uppercase opacity-75">
                    {l.short}
                  </span>
                  <span>{l.label}</span>
                </div>
                {isActive && <Check className="w-3.5 h-3.5 text-phone-emerald shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
