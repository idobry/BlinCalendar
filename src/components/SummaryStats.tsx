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
        Portfolio Performance
      </div>
      
      <div className="tv-panel-content">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {stats.map((stat, index) => (
            <div key={index} className="tv-metric-card">
              <div className="tv-metric-label">
                {stat.label}
              </div>
              <div className={`tv-metric-value ${
                stat.type === 'positive' ? 'tv-positive' : 
                stat.type === 'negative' ? 'tv-negative' : 
                'tv-neutral'
              }`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}