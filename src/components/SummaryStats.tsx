'use client';

import { TradingSummary } from '@/lib/types';
import { formatCurrency, formatPercentage } from '@/lib/tradeProcessor';

interface SummaryStatsProps {
  summary: TradingSummary;
}

export default function SummaryStats({ summary }: SummaryStatsProps) {
  const stats = [
    {
      label: 'Total Invested',
      value: formatCurrency(summary.totalInvested),
      type: 'neutral' as const
    },
    {
      label: 'Total P&L',
      value: formatCurrency(summary.totalProfit),
      type: summary.totalProfit >= 0 ? 'positive' as const : 'negative' as const
    },
    {
      label: 'Wins',
      value: summary.totalWins.toString(),
      type: 'positive' as const
    },
    {
      label: 'Losses',
      value: summary.totalLosses.toString(),
      type: 'negative' as const
    },
    {
      label: 'Win Rate',
      value: formatPercentage(summary.winRate),
      type: summary.winRate >= 50 ? 'positive' as const : 'negative' as const
    },
    {
      label: 'Total Trades',
      value: summary.totalTrades.toString(),
      type: 'neutral' as const
    },
    {
      label: 'Avg P&L per Trade',
      value: summary.totalTrades > 0 
        ? formatCurrency(summary.totalProfit / summary.totalTrades)
        : '$0.00',
      type: summary.totalTrades > 0 && (summary.totalProfit / summary.totalTrades) >= 0 
        ? 'positive' as const : 'negative' as const
    },
    {
      label: 'ROI',
      value: summary.totalInvested > 0 
        ? formatPercentage((summary.totalProfit / summary.totalInvested) * 100)
        : '0.0%',
      type: summary.totalInvested > 0 && (summary.totalProfit / summary.totalInvested) >= 0
        ? 'positive' as const : 'negative' as const
    }
  ];

  return (
    <div className="tv-panel">
      <div className="tv-panel-header">
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
          </svg>
          Portfolio Performance
        </span>
        <div style={{ 
          fontSize: '13px', 
          color: 'var(--v0-text-secondary)',
          fontWeight: '400'
        }}>
          Overview of all trading activity
        </div>
      </div>
      
      <div className="tv-panel-content">
        {/* Key Performance Indicators - Featured */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
          gap: '16px',
          marginBottom: '24px'
        }}>
          {stats.slice(0, 4).map((stat, index) => (
            <div 
              key={index} 
              className="tv-metric-card"
              style={{
                background: stat.type === 'positive' ? 'linear-gradient(145deg, var(--v0-surface), rgba(16, 185, 129, 0.05))' :
                           stat.type === 'negative' ? 'linear-gradient(145deg, var(--v0-surface), rgba(239, 68, 68, 0.05))' :
                           'var(--v0-surface)',
                border: `1px solid ${
                  stat.type === 'positive' ? 'rgba(16, 185, 129, 0.2)' :
                  stat.type === 'negative' ? 'rgba(239, 68, 68, 0.2)' :
                  'var(--v0-border)'
                }`
              }}
            >
              <div className="tv-metric-label">
                {stat.label}
              </div>
              <div className={`tv-metric-value mono ${
                stat.type === 'positive' ? 'tv-positive' : 
                stat.type === 'negative' ? 'tv-negative' : 
                'tv-neutral'
              }`} style={{ fontSize: '22px' }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Secondary Metrics */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: '16px',
          paddingTop: '16px',
          borderTop: '1px solid var(--v0-border)'
        }}>
          {stats.slice(4).map((stat, index) => (
            <div 
              key={index + 4} 
              className="tv-metric-card"
              style={{ 
                padding: '20px',
                minHeight: 'auto'
              }}
            >
              <div className="tv-metric-label" style={{ fontSize: '12px' }}>
                {stat.label}
              </div>
              <div className={`tv-metric-value mono ${
                stat.type === 'positive' ? 'tv-positive' : 
                stat.type === 'negative' ? 'tv-negative' : 
                'tv-neutral'
              }`} style={{ fontSize: '18px', marginBottom: '4px' }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}