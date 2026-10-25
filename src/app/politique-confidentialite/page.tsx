import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Lock, FileCheck, CheckCircle2 } from 'lucide-react';
import StoreShell from '@/components/store/StoreShell';

export default function PolitiqueConfidentialitePage() {
  return (
    <StoreShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase text-phone-muted hover:text-phone-frost transition-colors cursor-pointer mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l&apos;accueil</span>
        </Link>

        {/* Title */}
        <div className="space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-phone-emerald/10 border border-phone-emerald/30 text-xs font-mono font-bold text-phone-emerald">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Conformité Loi 18-07 / ANPDP (Algérie)</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-phone-frost tracking-tight">
            Politique de Confidentialité &amp; Protection des Données
          </h1>
          <p className="text-xs sm:text-sm text-phone-muted max-w-2xl leading-relaxed">
            Abdou Phone s&apos;engage à protéger rigoureusement vos données à caractère personnel conformément aux dispositions de la <strong>Loi n° 18-07</strong> du 10 juin 2018 relative à la protection des personnes physiques dans le traitement des données à caractère personnel en Algérie.
          </p>
        </div>

        {/* Legal Sections */}
        <div className="space-y-6 text-xs sm:text-sm text-phone-muted leading-relaxed">
          <div className="p-6 sm:p-8 rounded-3xl bg-phone-surface border border-phone-border space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-phone-frost flex items-center gap-2">
              <Lock className="w-4 h-4 text-phone-emerald" />
              <span>1. Données collectées et Principe de Minimisation</span>
            </h2>
            <p>
              Dans le cadre strict du traitement de votre commande en ligne avec paiement à la livraison, Abdou Phone ne collecte que les informations strictement nécessaires :
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-phone-frost font-medium">
              <li>Nom et Prénom du destinataire</li>
              <li>Numéro de téléphone mobile (pour la confirmation et le livreur)</li>
              <li>Wilaya, commune et adresse de livraison</li>
            </ul>
            <p className="text-phone-dim text-xs">
              Aucune donnée bancaire n&apos;est collectée ou stockée sur nos serveurs puisque le règlement s&apos;effectue exclusivement en espèces à la livraison (Cash on Delivery).
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-phone-surface border border-phone-border space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-phone-frost flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-phone-emerald" />
              <span>2. Finalité du Traitement &amp; Non-Cession à des Tiers</span>
            </h2>
            <p>
              Vos coordonnées sont exploitées aux seules fins de :
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>L&apos;appel téléphonique de validation de commande par notre équipe.</li>
              <li>L&apos;acheminement du colis par notre service de livraison vers votre wilaya.</li>
              <li>L&apos;émission du bon de commande et le suivi après-vente.</li>
            </ul>
            <p className="text-phone-emerald font-semibold">
              Vos données ne sont ni vendues, ni louées, ni cédées à des régies publicitaires tierces (Zéro Pixel Meta, Zéro Pixel TikTok).
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-phone-surface border border-phone-border space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-phone-frost flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-phone-emerald" />
              <span>3. Vos Droits d&apos;Accès, de Rectification et d&apos;Opposition</span>
            </h2>
            <p>
              Conformément à la Loi 18-07, vous disposez d&apos;un droit d&apos;accès, de rectification et d&apos;effacement de vos données personnelles. Vous pouvez exercer ce droit à tout moment en nous contactant :
            </p>
            <div className="p-4 rounded-2xl bg-phone-surface-elevated border border-phone-border text-xs font-mono text-phone-frost space-y-1">
              <div>Email Dédié DPO : privacy@abdouphone.dz</div>
              <div>Téléphone : +213 (0) 669 01 48 90</div>
              <div>Autorité de Contrôle : Autorité Nationale de Protection des Données à caractère Personnel (ANPDP - Algérie)</div>
            </div>
          </div>
        </div>
      </div>
    </StoreShell>
  );
}
