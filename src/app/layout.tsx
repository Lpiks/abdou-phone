import type { Metadata } from 'next';
import './globals.css';
import ClientProviders from '@/components/common/ClientProviders';

export const metadata: Metadata = {
  title: 'Abdou Phone | Accessoires Smartphone Haute Performance Algérie',
  description:
    'Boutique en ligne spécialisée en accessoires smartphone en Algérie : Chargeurs rapides GaN, câbles blindés 100W, coques MagSafe antichoc, verres trempés 9H et powerbanks. Livraison 58 Wilayas & Paiement à la livraison.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-phone-void text-phone-frost antialiased selection:bg-phone-emerald/20 selection:text-phone-frost font-sans">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
