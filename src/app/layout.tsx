import type { Metadata } from "next";
import "./globals.css";

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
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
