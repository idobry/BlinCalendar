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
      className: 'text-blue-600 dark:text-blue-400'
    },
    {
      label: 'Total Profit/Loss',
      value: formatCurrency(summary.totalProfit),
      className: summary.totalProfit >= 0 
        ? 'text-green-600 dark:text-green-400' 
        : 'text-red-600 dark:text-red-400'
    },
    {
      label: 'Total Wins',
      value: summary.totalWins.toString(),
      className: 'text-green-600 dark:text-green-400'
    },
    {
      label: 'Total Losses',
      value: summary.totalLosses.toString(),
      className: 'text-red-600 dark:text-red-400'
    },
    {
      label: 'Win Rate',
      value: formatPercentage(summary.winRate),
      className: summary.winRate >= 50 
        ? 'text-green-600 dark:text-green-400' 
        : 'text-red-600 dark:text-red-400'
    },
    {
      label: 'Total Trades',
      value: summary.totalTrades.toString(),
      className: 'text-gray-700 dark:text-gray-300'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Trading Summary
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center"
          >
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {stat.label}
            </div>
            <div className={`text-2xl font-bold ${stat.className}`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>
      
      {/* Additional insights */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Average Profit per Trade
            </div>
            <div className={`text-xl font-bold ${
              summary.totalTrades > 0 && (summary.totalProfit / summary.totalTrades) >= 0
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}>
              {summary.totalTrades > 0 
                ? formatCurrency(summary.totalProfit / summary.totalTrades)
                : '$0.00'
              }
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Return on Investment
            </div>
            <div className={`text-xl font-bold ${
              summary.totalInvested > 0 && (summary.totalProfit / summary.totalInvested) >= 0
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}>
              {summary.totalInvested > 0 
                ? formatPercentage((summary.totalProfit / summary.totalInvested) * 100)
                : '0.0%'
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}