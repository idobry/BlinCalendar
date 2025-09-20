import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: "BlinCalendar",
  description: "Professional trading journal with TradingView-style interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="tv-header">
          <div className="tv-header-content">
            <h1 className="tv-logo">BlinCalendar</h1>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: 'var(--tv-text-secondary)' }}>
               
              </span>
            </div>
          </div>
        </div>
        <div className="tv-container">
          {children}
        </div>
      </body>
    </html>
  );
}
