'use client';

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import SlideCart from './SlideCart';

export default function StoreShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-phone-void text-phone-frost antialiased selection:bg-phone-emerald/20 selection:text-phone-frost hardware-grid">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <SlideCart />
    </div>
  );
}
