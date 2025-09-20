import { TradeRecord, CompletedTrade, DailyData, TradingSummary } from './types';

export function processTradeData(rawData: TradeRecord[]): {
  dailyData: DailyData[];
  summary: TradingSummary;
} {
  // Sort data by date
  const sortedData = [...rawData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Group trades by symbol to match buy/sell pairs
  const symbolTrades: Record<string, TradeRecord[]> = {};
  
  sortedData.forEach(trade => {
    if (trade.symbol && (trade.action === 'buy' || trade.action === 'sell')) {
      if (!symbolTrades[trade.symbol]) {
        symbolTrades[trade.symbol] = [];
      }
      symbolTrades[trade.symbol].push(trade);
    }
  });

  // Match buy/sell pairs and create completed trades
  const completedTrades: CompletedTrade[] = [];
  
  Object.entries(symbolTrades).forEach(([symbol, trades]) => {
    const sortedTrades = trades.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const buyQueue: TradeRecord[] = [];
    
    sortedTrades.forEach(trade => {
      if (trade.action === 'buy') {
        buyQueue.push(trade);
      } else if (trade.action === 'sell' && buyQueue.length > 0) {
        // Match with oldest buy (FIFO)
        const buyTrade = buyQueue.shift()!;
        
        const profit = trade.amount_usd + buyTrade.amount_usd; // sell amount is positive, buy amount is negative
        const profitPercentage = (profit / Math.abs(buyTrade.amount_usd)) * 100;
        
        completedTrades.push({
          symbol,
          buyDate: buyTrade.date,
          sellDate: trade.date,
          shares: trade.shares || 0,
          buyAmount: Math.abs(buyTrade.amount_usd),
          sellAmount: trade.amount_usd,
          profit,
          profitPercentage
        });
      }
    });
  });

  // Group completed trades by sell date for daily view
  const dailyMap: Record<string, CompletedTrade[]> = {};
  
  completedTrades.forEach(trade => {
    if (!dailyMap[trade.sellDate]) {
      dailyMap[trade.sellDate] = [];
    }
    dailyMap[trade.sellDate].push(trade);
  });

  // Create daily data array
  const dailyData: DailyData[] = Object.entries(dailyMap).map(([date, trades]) => {
    const totalProfit = trades.reduce((sum, trade) => sum + trade.profit, 0);
    
    return {
      date,
      trades,
      totalProfit,
      totalTrades: trades.length,
      hasActivity: true
    };
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Calculate summary statistics
  const totalInvested = rawData
    .filter(trade => trade.action === 'buy' || trade.action === 'deposit')
    .reduce((sum, trade) => sum + Math.abs(trade.amount_usd), 0);
  
  const totalProfit = completedTrades.reduce((sum, trade) => sum + trade.profit, 0);
  const totalWins = completedTrades.filter(trade => trade.profit > 0).length;
  const totalLosses = completedTrades.filter(trade => trade.profit < 0).length;
  const winRate = completedTrades.length > 0 ? (totalWins / completedTrades.length) * 100 : 0;

  const summary: TradingSummary = {
    totalInvested,
    totalWins,
    totalLosses,
    totalProfit,
    totalTrades: completedTrades.length,
    winRate
  };

  return { dailyData, summary };
}

export function generateCalendarData(dailyData: DailyData[], year: number, month: number): DailyData[] {
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  
  const calendarData: DailyData[] = [];
  
  // Create data for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const existingData = dailyData.find(d => d.date === dateStr);
    
    if (existingData) {
      calendarData.push(existingData);
    } else {
      calendarData.push({
        date: dateStr,
        trades: [],
        totalProfit: 0,
        totalTrades: 0,
        hasActivity: false
      });
    }
  }
  
  return calendarData;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatPercentage(percentage: number): string {
  return `${percentage > 0 ? '+' : ''}${percentage.toFixed(1)}%`;
}