'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';

export interface CustomSelectOption {
  value: string;
  label: string;
  badge?: string;
  icon?: React.ReactNode;
}

export interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  size?: 'sm' | 'md' | 'lg';
  required?: boolean;
  error?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  label,
  placeholder = 'Sélectionner...',
  className = '',
  disabled = false,
  searchable,
  searchPlaceholder = 'Rechercher...',
  size = 'md',
  required = false,
  error,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Auto-enable search if there are more than 8 options and not explicitly specified
  const isSearchable = searchable !== undefined ? searchable : options.length > 8;

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase().trim();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        (opt.badge && opt.badge.toLowerCase().includes(q)) ||
        opt.value.toLowerCase().includes(q)
    );
  }, [options, searchQuery]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && isSearchable) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen, isSearchable]);

  // Handle outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (!isOpen) {
        e.preventDefault();
        setIsOpen(true);
      }
    } else if (e.key === 'ArrowDown' && !isOpen) {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearchQuery('');
  };

  const sizeClasses = {
    sm: 'h-9 text-xs px-3',
    md: 'h-11 text-sm px-4',
    lg: 'h-13 text-base px-4',
  }[size];

  return (
    <div className={`relative flex flex-col gap-1.5 ${className}`} ref={containerRef}>
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider text-phone-muted flex items-center justify-between">
          <span>
            {label}
            {required && <span className="text-phone-emerald ml-1">*</span>}
          </span>
          {selectedOption?.badge && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-phone-surface-elevated text-phone-emerald border border-phone-border">
              {selectedOption.badge}
            </span>
          )}
        </label>
      )}

      {/* Custom Select Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between rounded-xl transition-all duration-200 cursor-pointer text-start rtl:text-right ltr:text-left select-none outline-none border ${sizeClasses} ${
          disabled
            ? 'bg-phone-surface/50 border-phone-border/50 text-phone-dim cursor-not-allowed opacity-60'
            : isOpen
            ? 'bg-phone-surface-elevated border-phone-emerald/80 shadow-glow text-phone-frost'
            : error
            ? 'bg-phone-surface border-phone-danger text-phone-frost'
            : 'bg-phone-surface border-phone-border hover:border-phone-border-light hover:bg-phone-surface-hover text-phone-frost'
        }`}
      >
        <span className="flex items-center gap-2.5 truncate">
          {selectedOption?.icon && (
            <span className="text-phone-emerald shrink-0">{selectedOption.icon}</span>
          )}
          <span className={`truncate ${selectedOption ? 'text-phone-frost font-medium' : 'text-phone-dim'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>

        <span className="flex items-center gap-1.5 shrink-0 ml-2">
          {selectedOption && !disabled && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              title="Effacer"
              className="p-1 rounded-md text-phone-dim hover:text-phone-frost hover:bg-phone-border transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-phone-muted transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-phone-emerald' : ''
            }`}
          />
        </span>
      </button>

      {error && <span className="text-[11px] text-phone-danger font-medium mt-0.5">{error}</span>}

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute top-[calc(100%+6px)] left-0 w-full z-50 rounded-xl bg-phone-surface border border-phone-border shadow-card backdrop-blur-md overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150"
        >
          {/* Integrated Search Box */}
          {isSearchable && (
            <div className="p-2 border-b border-phone-border bg-phone-void/40">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-phone-dim absolute start-3 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full h-8 ps-8 pe-3 text-xs rounded-lg bg-phone-surface-elevated border border-phone-border text-phone-frost placeholder-phone-dim focus:outline-none focus:border-phone-emerald/60"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 text-phone-dim hover:text-phone-frost cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-xs text-phone-dim font-medium">
                Aucun résultat trouvé
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = option.value === value;
                return (
                  <div
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(option.value)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-colors duration-150 ${
                      isSelected
                        ? 'bg-phone-emerald/15 text-phone-emerald border border-phone-emerald/30 font-semibold'
                        : 'text-phone-frost hover:bg-phone-surface-hover hover:text-phone-frost'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {option.icon && (
                        <span className="shrink-0 text-phone-dim">{option.icon}</span>
                      )}
                      <span className="truncate">{option.label}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      {option.badge && (
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            isSelected
                              ? 'bg-phone-emerald/20 text-phone-emerald'
                              : 'bg-phone-border text-phone-muted'
                          }`}
                        >
                          {option.badge}
                        </span>
                      )}
                      {isSelected && <Check className="w-4 h-4 text-phone-emerald shrink-0" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
