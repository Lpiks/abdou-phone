import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
  asLink?: boolean;
}

export default function BrandLogo({
  size = 'md',
  showSubtitle = true,
  className = '',
  asLink = true,
}: BrandLogoProps) {
  // Dimension configurations
  const dimensions = {
    sm: { badge: 'w-8 h-8 rounded-lg', iconW: 24, iconH: 24, title: 'text-base', sub: 'text-[9px]' },
    md: { badge: 'w-10 h-10 rounded-xl', iconW: 32, iconH: 32, title: 'text-xl', sub: 'text-[10px]' },
    lg: { badge: 'w-14 h-14 rounded-2xl', iconW: 44, iconH: 44, title: 'text-2xl sm:text-3xl', sub: 'text-xs' },
  }[size];

  const content = (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* The Verified Dual-Toggle Buttons Icon Badge */}
      <div
        className={`${dimensions.badge} bg-phone-surface border border-phone-border flex items-center justify-center shrink-0 shadow-sm relative group`}
      >
        <svg
          viewBox="0 0 60 60"
          width={dimensions.iconW}
          height={dimensions.iconH}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 group-hover:scale-105"
        >
          {/* Top Pill: Outlined with right dot */}
          <rect
            x="8"
            y="12"
            width="44"
            height="16"
            rx="8"
            stroke="#F8FAFC"
            strokeWidth="3.5"
          />
          <circle cx="40" cy="20" r="3.5" fill="#F8FAFC" />

          {/* Bottom Pill: Solid with left cutout dot */}
          <rect
            x="8"
            y="32"
            width="44"
            height="16"
            rx="8"
            fill="#F8FAFC"
          />
          <circle cx="20" cy="40" r="3.5" fill="#13161D" />
        </svg>

        {/* Ambient Emerald Power Dot */}
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-phone-emerald ring-2 ring-phone-void" />
      </div>

      {/* Typographic Wordmark */}
      <div className="flex flex-col">
        <div className={`font-bold tracking-tight text-phone-frost leading-tight flex items-center gap-1.5 ${dimensions.title}`}>
          <span>ABDOU</span>
          <span className="text-phone-muted font-light">PHONE</span>
        </div>
        {showSubtitle && (
          <span className={`text-phone-dim tracking-widest uppercase font-mono font-medium hidden sm:block ${dimensions.sub}`}>
            Hardware &amp; Accessoires
          </span>
        )}
      </div>
    </div>
  );

  if (asLink) {
    return (
      <Link href="/" className="inline-flex cursor-pointer transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
}
