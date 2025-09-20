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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">
            {new Date(dayData.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-1">Daily Summary</div>
          <div className="flex justify-between items-center">
            <span className="text-white">Total P&L:</span>
            <span className={`font-bold ${dayData.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(dayData.totalProfit)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white">Trades:</span>
            <span className="text-gray-300">{dayData.totalTrades}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm text-gray-400 mb-2">Trade Details</div>
          {dayData.trades.map((trade, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-white">{trade.symbol}</span>
                <span className={`font-bold ${trade.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(trade.profit)}
                </span>
              </div>
              
              <div className="text-xs space-y-1 text-gray-300">
                <div className="flex justify-between">
                  <span>Buy Date:</span>
                  <span>{new Date(trade.buyDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sell Date:</span>
                  <span>{new Date(trade.sellDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shares:</span>
                  <span>{trade.shares.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Buy Amount:</span>
                  <span>{formatCurrency(trade.buyAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sell Amount:</span>
                  <span>{formatCurrency(trade.sellAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Return:</span>
                  <span className={trade.profitPercentage >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {formatPercentage(trade.profitPercentage)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}