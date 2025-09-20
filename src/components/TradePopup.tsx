'use client';

import { DailyData } from '@/lib/types';
import { formatCurrency, formatPercentage } from '@/lib/tradeProcessor';

interface TradePopupProps {
  dayData: DailyData;
  onClose: () => void;
}

export default function TradePopup({ dayData, onClose }: TradePopupProps) {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={handleBackdropClick}
    >
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      
      <div 
        className="tv-panel" 
        style={{ 
          maxWidth: '700px', 
          width: '100%', 
          maxHeight: '85vh', 
          overflow: 'hidden',
          animation: 'slideUp 0.3s ease-out',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}
      >
        <div className="tv-panel-header">
          <div>
            <span style={{ fontSize: '18px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {new Date(dayData.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <div style={{ 
              fontSize: '13px', 
              color: 'var(--v0-text-secondary)',
              marginTop: '2px'
            }}>
              Trading Day Summary
            </div>
          </div>
          <button
            onClick={onClose}
            className="tv-button-secondary"
            style={{
              minWidth: '40px',
              minHeight: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              padding: '0'
            }}
          >
            ×
          </button>
        </div>

        <div className="tv-panel-content" style={{ maxHeight: '65vh', overflow: 'auto' }}>
          {/* Daily Summary */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div 
                className="tv-metric-card"
                style={{
                  background: dayData.totalProfit >= 0 
                    ? 'linear-gradient(145deg, var(--v0-surface), rgba(16, 185, 129, 0.05))' 
                    : 'linear-gradient(145deg, var(--v0-surface), rgba(239, 68, 68, 0.05))',
                  border: `1px solid ${dayData.totalProfit >= 0 
                    ? 'rgba(16, 185, 129, 0.2)' 
                    : 'rgba(239, 68, 68, 0.2)'}`
                }}
              >
                <div className="tv-metric-label">Daily P&L</div>
                <div className={`tv-metric-value mono ${dayData.totalProfit >= 0 ? 'tv-positive' : 'tv-negative'}`}>
                  {formatCurrency(dayData.totalProfit)}
                </div>
              </div>
              <div className="tv-metric-card">
                <div className="tv-metric-label">Total Trades</div>
                <div className="tv-metric-value mono tv-neutral">
                  {dayData.totalTrades}
                </div>
              </div>
            </div>
          </div>

          {/* Trade Details */}
          <div>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18"/>
                <path d="M7 16l4-4 4 4 6-6"/>
              </svg>
              <h3 style={{ 
                color: 'var(--v0-text-primary)', 
                fontSize: '16px', 
                fontWeight: '500', 
                margin: '0'
              }}>
                Trade Details
              </h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {dayData.trades.map((trade, index) => (
                <div 
                  key={index} 
                  className="tv-panel" 
                  style={{ 
                    margin: 0,
                    background: trade.profit >= 0 
                      ? 'linear-gradient(145deg, var(--v0-surface), rgba(16, 185, 129, 0.03))' 
                      : 'linear-gradient(145deg, var(--v0-surface), rgba(239, 68, 68, 0.03))',
                    border: `1px solid ${
                      trade.profit >= 0 
                        ? 'rgba(16, 185, 129, 0.1)' 
                        : 'rgba(239, 68, 68, 0.1)'
                    }`
                  }}
                >
                  <div className="tv-panel-header" style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ 
                        fontWeight: '600', 
                        fontSize: '16px',
                        padding: '4px 8px',
                        backgroundColor: 'var(--v0-surface-light)',
                        borderRadius: '6px',
                        fontFamily: 'SF Mono, Monaco, Cascadia Code, Roboto Mono, Consolas, Courier New, monospace'
                      }}>
                        {trade.symbol}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className={`mono ${trade.profit >= 0 ? 'tv-positive' : 'tv-negative'}`} 
                           style={{ fontWeight: '600', fontSize: '16px' }}>
                        {formatCurrency(trade.profit)}
                      </div>
                      <div className={`mono ${trade.profitPercentage >= 0 ? 'tv-positive' : 'tv-negative'}`}
                           style={{ fontSize: '13px', opacity: '0.8' }}>
                        {formatPercentage(trade.profitPercentage)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="tv-panel-content" style={{ padding: '16px' }}>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr', 
                      gap: '12px 20px', 
                      fontSize: '13px' 
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--v0-text-secondary)' }}>Buy Date:</span>
                        <span style={{ fontWeight: '500' }}>
                          {new Date(trade.buyDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--v0-text-secondary)' }}>Sell Date:</span>
                        <span style={{ fontWeight: '500' }}>
                          {new Date(trade.sellDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--v0-text-secondary)' }}>Shares:</span>
                        <span className="mono" style={{ fontWeight: '500' }}>
                          {trade.shares.toFixed(4)}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--v0-text-secondary)' }}>Hold Time:</span>
                        <span style={{ fontWeight: '500' }}>
                          {Math.ceil((new Date(trade.sellDate).getTime() - new Date(trade.buyDate).getTime()) / (1000 * 60 * 60 * 24))} days
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--v0-text-secondary)' }}>Buy Amount:</span>
                        <span className="mono" style={{ fontWeight: '500' }}>
                          {formatCurrency(trade.buyAmount)}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--v0-text-secondary)' }}>Sell Amount:</span>
                        <span className="mono" style={{ fontWeight: '500' }}>
                          {formatCurrency(trade.sellAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ 
            marginTop: '32px', 
            paddingTop: '24px',
            borderTop: '1px solid var(--v0-border)',
            textAlign: 'center' 
          }}>
            <button
              onClick={onClose}
              className="tv-button"
              style={{ minWidth: '120px' }}
            >
              ✓ Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}