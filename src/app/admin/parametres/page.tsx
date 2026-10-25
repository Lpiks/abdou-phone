'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  MapPin,
  Save,
  Check,
  Truck,
  Search,
  FileCheck,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import wilayasData from '@/data/algeria-wilayas.json';

export default function AdminParametresPage() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'legal' | 'delivery'>('legal');

  // Legal Settings State
  const [storeName, setStoreName] = useState('Abdou Phone Algérie');
  const [rcNumber, setRcNumber] = useState('16/00-9876543B26');
  const [nifNumber, setNifNumber] = useState('002616098765432');
  const [nisNumber, setNisNumber] = useState('0026160100489');
  const [anpdpRef, setAnpdpRef] = useState('ANPDP-DEC-2026-0842');
  const [ecomLicense, setEcomLicense] = useState('ECOM-DZ-2026-00418');
  const [phone, setPhone] = useState('0669 01 48 90');
  const [email, setEmail] = useState('contact@abdouphone.dz');
  const [address, setAddress] = useState('14 Rue Didouche Mourad, Alger Centre, Algérie');
  const [savedNotice, setSavedNotice] = useState(false);

  // Delivery Rates Search
  const [wilayaSearch, setWilayaSearch] = useState('');
  const [rates, setRates] = useState(wilayasData);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const filteredWilayas = rates.filter((w) =>
    w.name.toLowerCase().includes(wilayaSearch.toLowerCase()) ||
    w.arabicName.includes(wilayaSearch) ||
    w.code.includes(wilayaSearch)
  );

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-phone-frost tracking-tight flex items-center gap-2.5">
          <Building2 className="w-7 h-7 text-phone-emerald" />
          <span>{t('adminSettingsTitle')}</span>
        </h1>
        <p className="text-xs sm:text-sm text-phone-muted mt-1 max-w-2xl">
          {t('adminSettingsSubtitle')}
        </p>
      </div>

      {savedNotice && (
        <div className="p-3.5 rounded-xl bg-phone-emerald/15 border border-phone-emerald/30 text-phone-emerald text-xs font-semibold flex items-center gap-2 animate-in fade-in-0">
          <Check className="w-4 h-4" />
          <span>{t('adminSettingsSavedNotice')}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-phone-border gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('legal')}
          className={`pb-3 px-4 text-xs font-bold font-mono uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
            activeTab === 'legal'
              ? 'border-phone-emerald text-phone-emerald'
              : 'border-transparent text-phone-muted hover:text-phone-frost'
          }`}
        >
          {t('adminSettingsLegalTab')}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('delivery')}
          className={`pb-3 px-4 text-xs font-bold font-mono uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
            activeTab === 'delivery'
              ? 'border-phone-emerald text-phone-emerald'
              : 'border-transparent text-phone-muted hover:text-phone-frost'
          }`}
        >
          {t('adminSettingsDeliveryTab')} (58)
        </button>
      </div>

      {activeTab === 'legal' ? (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Legal Identifiers */}
          <div className="p-5 sm:p-7 rounded-2xl bg-phone-surface border border-phone-border space-y-5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-phone-emerald">
              <FileCheck className="w-4 h-4" />
              <span>1. Identifiants Légaux Officiels (CNRC / DGI / ANPDP)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-phone-muted font-mono mb-1.5">
                  Nom Commercial
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-phone-surface-elevated border border-phone-border text-phone-frost text-xs font-semibold focus:outline-none focus:border-phone-emerald/60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-phone-muted font-mono mb-1.5">
                  {t('adminSettingsRc')}
                </label>
                <input
                  type="text"
                  value={rcNumber}
                  onChange={(e) => setRcNumber(e.target.value)}
                  placeholder="Ex: 16/00-9876543B26"
                  className="w-full h-11 px-4 rounded-xl bg-phone-surface-elevated border border-phone-border text-phone-frost font-mono text-xs focus:outline-none focus:border-phone-emerald/60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-phone-muted font-mono mb-1.5">
                  {t('adminSettingsNif')}
                </label>
                <input
                  type="text"
                  value={nifNumber}
                  onChange={(e) => setNifNumber(e.target.value)}
                  placeholder="Ex: 002616098765432"
                  className="w-full h-11 px-4 rounded-xl bg-phone-surface-elevated border border-phone-border text-phone-frost font-mono text-xs focus:outline-none focus:border-phone-emerald/60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-phone-muted font-mono mb-1.5">
                  {t('adminSettingsNis')}
                </label>
                <input
                  type="text"
                  value={nisNumber}
                  onChange={(e) => setNisNumber(e.target.value)}
                  placeholder="Ex: 0026160100489"
                  className="w-full h-11 px-4 rounded-xl bg-phone-surface-elevated border border-phone-border text-phone-frost font-mono text-xs focus:outline-none focus:border-phone-emerald/60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-phone-muted font-mono mb-1.5">
                  {t('adminSettingsAnpdp')}
                </label>
                <input
                  type="text"
                  value={anpdpRef}
                  onChange={(e) => setAnpdpRef(e.target.value)}
                  placeholder="Ex: ANPDP-DEC-2026-0842"
                  className="w-full h-11 px-4 rounded-xl bg-phone-surface-elevated border border-phone-border text-phone-frost font-mono text-xs focus:outline-none focus:border-phone-emerald/60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-phone-muted font-mono mb-1.5">
                  {t('adminSettingsEcom')}
                </label>
                <input
                  type="text"
                  value={ecomLicense}
                  onChange={(e) => setEcomLicense(e.target.value)}
                  placeholder="Ex: ECOM-DZ-2026-00418"
                  className="w-full h-11 px-4 rounded-xl bg-phone-surface-elevated border border-phone-border text-phone-frost font-mono text-xs focus:outline-none focus:border-phone-emerald/60"
                />
              </div>
            </div>
          </div>

          {/* Contact & Support */}
          <div className="p-5 sm:p-7 rounded-2xl bg-phone-surface border border-phone-border space-y-5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-phone-cyan">
              <Phone className="w-4 h-4" />
              <span>2. Coordonnées de Contact &amp; Support Client</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-phone-muted font-mono mb-1.5">
                  Téléphone Support Client
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-phone-surface-elevated border border-phone-border text-phone-frost font-mono text-xs focus:outline-none focus:border-phone-emerald/60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-phone-muted font-mono mb-1.5">
                  Email de Contact
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-phone-surface-elevated border border-phone-border text-phone-frost text-xs focus:outline-none focus:border-phone-emerald/60"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-phone-muted font-mono mb-1.5">
                  Adresse Physique du Magasin
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-phone-surface-elevated border border-phone-border text-phone-frost text-xs focus:outline-none focus:border-phone-emerald/60"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="h-11 px-6 rounded-xl bg-phone-emerald hover:bg-phone-emerald/90 text-phone-void font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-transform hover:scale-[1.02] cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{t('adminSettingsSaveBtn')}</span>
            </button>
          </div>
        </form>
      ) : (
        /* Tab 2: 58 Wilayas Delivery Rates */
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-phone-surface border border-phone-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-phone-dim" />
              <input
                type="text"
                value={wilayaSearch}
                onChange={(e) => setWilayaSearch(e.target.value)}
                placeholder="Rechercher une wilaya (ex: Alger, 16, وهران)..."
                className="w-full h-10 ps-10 pe-4 rounded-xl bg-phone-surface-elevated border border-phone-border text-phone-frost placeholder-phone-dim text-xs font-medium focus:outline-none focus:border-phone-emerald"
              />
            </div>
            <div className="text-xs font-mono text-phone-dim self-start sm:self-auto">
              {filteredWilayas.length} wilayas affichées
            </div>
          </div>

          <div className="bg-phone-surface border border-phone-border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto min-w-0">
              <table className="w-full text-left rtl:text-right text-xs">
                <thead className="border-b border-phone-border bg-phone-surface-elevated/70 text-phone-dim font-mono uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Code</th>
                    <th className="py-3 px-4 font-semibold">Wilaya</th>
                    <th className="py-3 px-4 font-semibold">الولاية (بالعربية)</th>
                    <th className="py-3 px-4 font-semibold">Tarif Domicile</th>
                    <th className="py-3 px-4 font-semibold">Tarif Stop Desk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-phone-border/60 font-mono">
                  {filteredWilayas.map((w) => (
                    <tr key={w.code} className="hover:bg-phone-surface-elevated/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-phone-emerald">{w.code}</td>
                      <td className="py-3 px-4 font-semibold text-phone-frost font-sans">{w.name}</td>
                      <td className="py-3 px-4 text-phone-muted font-sans" dir="rtl">{w.arabicName}</td>
                      <td className="py-3 px-4 text-phone-cyan font-bold">{w.homeDeliveryFee} DZD</td>
                      <td className="py-3 px-4 text-phone-amber font-bold">{w.deskDeliveryFee} DZD</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
