'use client';

import { DailyData, CompletedTrade } from '@/lib/types';
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
        background: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px'
      }}
      onClick={handleBackdropClick}
    >
      <div className="tv-panel" style={{ maxWidth: '600px', width: '100%', maxHeight: '80vh', overflow: 'hidden' }}>
        <div className="tv-panel-header">
          <span>
            {new Date(dayData.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
          <button
            onClick={onClose}
            className="tv-button-secondary tv-button-small"
          >
            ×
          </button>
        </div>

        <div className="tv-panel-content" style={{ maxHeight: '60vh', overflow: 'auto' }}>
          {/* Daily Summary */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="tv-metric-card">
                <div className="tv-metric-label">Total P&L</div>
                <div className={`tv-metric-value ${dayData.totalProfit >= 0 ? 'tv-positive' : 'tv-negative'}`}>
                  {formatCurrency(dayData.totalProfit)}
                </div>
              </div>
              <div className="tv-metric-card">
                <div className="tv-metric-label">Trades</div>
                <div className="tv-metric-value tv-neutral">
                  {dayData.totalTrades}
                </div>
              </div>
            </div>
          </div>

          {/* Trade Details */}
          <div>
            <h4 style={{ 
              color: 'var(--tv-text-primary)', 
              fontSize: '14px', 
              fontWeight: '600', 
              marginBottom: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Trade Details
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {dayData.trades.map((trade, index) => (
                <div key={index} className="tv-panel" style={{ margin: 0 }}>
                  <div className="tv-panel-header">
                    <span style={{ fontWeight: 'bold' }}>{trade.symbol}</span>
                    <span className={`${trade.profit >= 0 ? 'tv-positive' : 'tv-negative'}`} style={{ fontWeight: 'bold' }}>
                      {formatCurrency(trade.profit)}
                    </span>
                  </div>
                  
                  <div className="tv-panel-content" style={{ padding: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--tv-text-secondary)' }}>Buy Date:</span>
                        <span>{new Date(trade.buyDate).toLocaleDateString()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--tv-text-secondary)' }}>Sell Date:</span>
                        <span>{new Date(trade.sellDate).toLocaleDateString()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--tv-text-secondary)' }}>Shares:</span>
                        <span>{trade.shares.toFixed(4)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--tv-text-secondary)' }}>Return:</span>
                        <span className={trade.profitPercentage >= 0 ? 'tv-positive' : 'tv-negative'}>
                          {formatPercentage(trade.profitPercentage)}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--tv-text-secondary)' }}>Buy Amount:</span>
                        <span>{formatCurrency(trade.buyAmount)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--tv-text-secondary)' }}>Sell Amount:</span>
                        <span>{formatCurrency(trade.sellAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <button
              onClick={onClose}
              className="tv-button"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}