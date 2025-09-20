import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "BlinCalendar",
  description: "Professional trading journal with sleek v0 aesthetic - track your trades with confidence",
  keywords: "trading journal, trade tracker, financial analytics, professional trading",
  authors: [{ name: "BlinCalendar" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <div className="tv-header">
          <div className="tv-header-content">
            <h1 className="tv-logo">BlinCalendar</h1>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <span style={{ 
                fontSize: '14px', 
                color: 'var(--v0-text-secondary)',
                fontWeight: '500'
              }}>
                Professional Trading Journal
              </span>
            </div>
          </div>
        </div>
        <main className="tv-container">
          {children}
        </main>
      </body>
    </html>
  );
}
