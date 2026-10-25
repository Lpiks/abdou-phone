'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, RotateCcw, Headphones, ArrowUpRight } from 'lucide-react';
import BrandLogo from '@/components/common/BrandLogo';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-phone-void border-t border-phone-border mt-16 sm:mt-20">
      {/* 4 Guarantees Bar - Responsive for all screens */}
      <div className="border-b border-phone-border bg-phone-surface/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-phone-surface border border-phone-border flex items-center justify-center shrink-0 text-phone-emerald">
              <Truck className="w-4 sm:w-5 h-4 sm:h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-phone-frost">{t('guaranteeWilayas')}</div>
              <div className="text-[11px] text-phone-dim">58 wilayas à domicile &amp; stop desk</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-phone-surface border border-phone-border flex items-center justify-center shrink-0 text-phone-emerald">
              <ShieldCheck className="w-4 sm:w-5 h-4 sm:h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-phone-frost">{t('guaranteeCod')}</div>
              <div className="text-[11px] text-phone-dim">Vérification du colis avant paiement</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-phone-surface border border-phone-border flex items-center justify-center shrink-0 text-phone-emerald">
              <RotateCcw className="w-4 sm:w-5 h-4 sm:h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-phone-frost">{t('guaranteeWarranty')}</div>
              <div className="text-[11px] text-phone-dim">Échange à neuf en cas de panne</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-phone-surface border border-phone-border flex items-center justify-center shrink-0 text-phone-emerald">
              <Headphones className="w-4 sm:w-5 h-4 sm:h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-phone-frost">{t('guaranteeSupport')}</div>
              <div className="text-[11px] text-phone-dim">Assistance téléphonique 7j/7</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
        {/* Brand Info */}
        <div className="space-y-4">
          <BrandLogo size="md" />
          <p className="text-xs text-phone-muted leading-relaxed">
            {t('footerDesc')}
          </p>
          <div className="flex items-center gap-2 text-xs font-mono text-phone-dim">
            <span className="w-2 h-2 rounded-full bg-phone-emerald" />
            <span>Conforme ANPDP Loi 18-07 &amp; Loi 18-05</span>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-phone-frost font-mono">
            {t('categoriesTitle')}
          </div>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/boutique?cat=chargeurs" className="text-phone-muted hover:text-phone-emerald transition-colors cursor-pointer">
                {t('catChargers')}
              </Link>
            </li>
            <li>
              <Link href="/boutique?cat=cables" className="text-phone-muted hover:text-phone-emerald transition-colors cursor-pointer">
                {t('catCables')}
              </Link>
            </li>
            <li>
              <Link href="/boutique?cat=coques" className="text-phone-muted hover:text-phone-emerald transition-colors cursor-pointer">
                {t('catCases')}
              </Link>
            </li>
            <li>
              <Link href="/boutique?cat=protection" className="text-phone-muted hover:text-phone-emerald transition-colors cursor-pointer">
                {t('catProtection')}
              </Link>
            </li>
            <li>
              <Link href="/boutique?cat=powerbanks" className="text-phone-muted hover:text-phone-emerald transition-colors cursor-pointer">
                {t('catPowerbanks')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Service & Legal */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-phone-frost font-mono">
            Légalité &amp; Suivi (Algérie)
          </div>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/suivi-commande" className="text-phone-muted hover:text-phone-emerald transition-colors cursor-pointer flex items-center gap-1">
                <span>{t('navTrackOrder')}</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </li>
            <li>
              <Link href="/politique-confidentialite" className="text-phone-muted hover:text-phone-emerald transition-colors cursor-pointer">
                {t('footerPrivacy')}
              </Link>
            </li>
            <li>
              <Link href="/conditions-de-vente" className="text-phone-muted hover:text-phone-emerald transition-colors cursor-pointer">
                {t('footerTerms')}
              </Link>
            </li>
            <li>
              <Link href="/admin/login" className="text-phone-dim hover:text-phone-muted transition-colors cursor-pointer">
                Portail Gestionnaire
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-phone-frost font-mono">
            Expédition Directe 58 Wilayas
          </div>
          <div className="text-xs text-phone-muted space-y-2">
            <div>
              <strong className="text-phone-frost block">Validation Téléphonique :</strong>
              Chaque commande est vérifiée par téléphone avant expédition.
            </div>
            <div>
              <strong className="text-phone-frost block">Paiement Sécurisé :</strong>
              Règlement en espèces à la livraison (Cash on Delivery).
            </div>
            <div className="p-3 rounded-xl bg-phone-surface border border-phone-border text-phone-frost font-mono text-[11px]">
              Départ quotidien • 58 Wilayas d&apos;Algérie
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-phone-border py-5 text-center text-xs text-phone-dim">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div>
            &copy; {new Date().getFullYear()} {t('footerRights')}
          </div>
          <div className="text-[11px] font-mono text-phone-dim">
            Algérie Loi 18-07 &amp; Loi 18-05 • Next.js 14 Responsive
          </div>
        </div>
      </div>
    </footer>
  );
}
