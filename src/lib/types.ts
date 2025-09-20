export interface TradeRecord {
  date: string;
  symbol: string | null;
  action: 'buy' | 'sell' | 'dividend' | 'deposit' | 'tax_june' | 'tax_july' | 'tax_august';
  shares: number | null;
  amount_usd: number;
}

export interface CompletedTrade {
  symbol: string;
  buyDate: string;
  sellDate: string;
  shares: number;
  buyAmount: number;
  sellAmount: number;
  profit: number;
  profitPercentage: number;
}

export interface DailyData {
  date: string;
  trades: CompletedTrade[];
  totalProfit: number;
  totalTrades: number;
  hasActivity: boolean;
}

export interface TradingSummary {
  totalInvested: number;
  totalWins: number;
  totalLosses: number;
  totalProfit: number;
  totalTrades: number;
  winRate: number;
}