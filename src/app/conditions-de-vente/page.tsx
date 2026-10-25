import React from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft, Truck, RotateCcw, ShieldCheck, Check } from 'lucide-react';
import StoreShell from '@/components/store/StoreShell';

export default function ConditionsDeVentePage() {
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
            <FileText className="w-3.5 h-3.5" />
            <span>Loi 18-05 sur le Commerce Électronique (Algérie)</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-phone-frost tracking-tight">
            Conditions Générales de Vente &amp; Livraison
          </h1>
          <p className="text-xs sm:text-sm text-phone-muted max-w-2xl leading-relaxed">
            Régissant les commandes passées sur Abdou Phone conformément à la législation algérienne en vigueur.
          </p>
        </div>

        {/* Clauses */}
        <div className="space-y-6 text-xs sm:text-sm text-phone-muted leading-relaxed">
          <div className="p-6 sm:p-8 rounded-3xl bg-phone-surface border border-phone-border space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-phone-frost flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-phone-emerald" />
              <span>1. Modalités de Commande &amp; Validation Téléphonique</span>
            </h2>
            <p>
              Toute commande passée sur notre site fait l&apos;objet d&apos;un appel téléphonique de confirmation par un opérateur Abdou Phone avant toute mise en expédition. En cas d&apos;injoignabilité après 3 tentatives sous 48 heures, la commande est automatiquement annulée.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-phone-surface border border-phone-border space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-phone-frost flex items-center gap-2">
              <Truck className="w-4 h-4 text-phone-emerald" />
              <span>2. Délais d&apos;Acheminement &amp; Tarifs par Wilaya</span>
            </h2>
            <p>
              Les expéditions couvrent l&apos;ensemble des <strong>58 wilayas d&apos;Algérie</strong>. Les délais moyens constatés sont de <strong>24h à 48h</strong> pour le Nord et les grands centres urbains, et de <strong>48h à 72h</strong> pour les Hauts Plateaux et les wilayas du Sud. Les frais de livraison sont calculés et affichés de manière transparente avant la validation de votre panier.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-phone-surface border border-phone-border space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-phone-frost flex items-center gap-2">
              <Check className="w-4 h-4 text-phone-emerald" />
              <span>3. Paiement en Espèces à la Livraison (COD) &amp; Droit de Vérification</span>
            </h2>
            <p>
              Le client a le droit absolu d&apos;ouvrir son colis de protection et de vérifier l&apos;intégrité physique de ses accessoires (compatibilité, état du verre, câbles) en présence du livreur avant de remettre le règlement en espèces.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-phone-surface border border-phone-border space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-phone-frost flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-phone-emerald" />
              <span>4. Garantie Matérielle 6 Mois &amp; Échange</span>
            </h2>
            <p>
              Tous les chargeurs GaN, câbles blindés, batteries externes et écouteurs sans fil bénéficient d&apos;une <strong>garantie d&apos;échange à neuf de 6 mois</strong> contre tout vice de fabrication ou panne électronique. L&apos;échange s&apos;effectue sans frais supplémentaires sous réserve de présentation de votre numéro de commande.
            </p>
          </div>
        </div>
      </div>
    </StoreShell>
  );
}
