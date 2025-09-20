'use client';

import { useState } from 'react';
import { TradeRecord, DailyData, TradingSummary } from '@/lib/types';
import { processTradeData, generateCalendarData } from '@/lib/tradeProcessor';
import FileUpload from '@/components/FileUpload';
import Calendar from '@/components/Calendar';
import SummaryStats from '@/components/SummaryStats';

export default function Home() {
  const [tradeData, setTradeData] = useState<TradeRecord[]>([]);
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [summary, setSummary] = useState<TradingSummary | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const handleDataLoaded = (data: TradeRecord[]) => {
    setTradeData(data);
    const processed = processTradeData(data);
    setDailyData(processed.dailyData);
    setSummary(processed.summary);
  };

  const loadMockData = async () => {
    try {
      const response = await fetch('/mock-data.json');
      const mockData = await response.json();
      handleDataLoaded(mockData);
    } catch (error) {
      console.error('Error loading mock data:', error);
    }
  };

  const getAvailableMonths = () => {
    if (dailyData.length === 0) return [];
    
    const months = new Set<string>();
    dailyData.forEach((day: DailyData) => {
      const date = new Date(day.date);
      months.add(`${date.getFullYear()}-${date.getMonth()}`);
    });
    
    return Array.from(months).sort().map(monthStr => {
      const [year, month] = monthStr.split('-').map(Number);
      return { year, month };
    });
  };

  const getMonthlyProfitLoss = (year: number, month: number) => {
    const monthData = dailyData.filter(day => {
      const date = new Date(day.date);
      return date.getFullYear() === year && date.getMonth() === month;
    });
    
    return monthData.reduce((total, day) => total + day.totalProfit, 0);
  };

  const availableMonths = getAvailableMonths();

  return (
    <>
      {tradeData.length === 0 ? (
        <div className="tv-panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="tv-panel-header">
            Import Trading Data
          </div>
          <div className="tv-panel-content">
            <FileUpload onDataLoaded={handleDataLoaded} />
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button
                onClick={loadMockData}
                className="tv-button-secondary"
                style={{ marginTop: '10px' }}
              >
                Load Mock Data (For Testing)
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="tv-grid">
          {/* Performance Summary - Full Width */}
          {summary && (
            <div className="tv-grid-full">
              <SummaryStats summary={summary} />
            </div>
          )}

          {/* Month Navigation */}
          {availableMonths.length > 0 && (
            <div className="tv-grid-full">
              <div className="tv-panel">
                <div className="tv-panel-header">
                  Time Navigation
                </div>
                <div className="tv-panel-content">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => {
                        if (currentMonth === 0) {
                          setCurrentMonth(11);
                          setCurrentYear(currentYear - 1);
                        } else {
                          setCurrentMonth(currentMonth - 1);
                        }
                      }}
                      className="tv-button-secondary"
                    >
                      ← Previous Month
                    </button>
                    
                    <select
                      value={`${currentYear}-${currentMonth}`}
                      onChange={(e) => {
                        const [year, month] = e.target.value.split('-').map(Number);
                        setCurrentYear(year);
                        setCurrentMonth(month);
                      }}
                      className="tv-select"
                      style={{ minWidth: '200px' }}
                    >
                      {availableMonths.map(({ year, month }) => (
                        <option key={`${year}-${month}`} value={`${year}-${month}`}>
                          {new Date(year, month).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long' 
                          })}
                        </option>
                      ))}
                    </select>
                    
                    <button
                      onClick={() => {
                        if (currentMonth === 11) {
                          setCurrentMonth(0);
                          setCurrentYear(currentYear + 1);
                        } else {
                          setCurrentMonth(currentMonth + 1);
                        }
                      }}
                      className="tv-button-secondary"
                    >
                      Next Month →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Calendar View with Monthly Summaries */}
          <div className="tv-grid-full">
            <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
              {/* Previous Month */}
              <div>
                <Calendar
                  dailyData={generateCalendarData(dailyData, 
                    currentMonth === 0 ? currentYear - 1 : currentYear, 
                    currentMonth === 0 ? 11 : currentMonth - 1
                  )}
                  year={currentMonth === 0 ? currentYear - 1 : currentYear}
                  month={currentMonth === 0 ? 11 : currentMonth - 1}
                  isCompact={true}
                  monthlyProfitLoss={getMonthlyProfitLoss(currentMonth === 0 ? currentYear - 1 : currentYear, currentMonth === 0 ? 11 : currentMonth - 1)}
                />
              </div>
              
              {/* Current Month */}
              <div>
                <Calendar
                  dailyData={generateCalendarData(dailyData, currentYear, currentMonth)}
                  year={currentYear}
                  month={currentMonth}
                  isCompact={false}
                  monthlyProfitLoss={getMonthlyProfitLoss(currentYear, currentMonth)}
                />
              </div>
              
              {/* Next Month */}
              <div>
                <Calendar
                  dailyData={generateCalendarData(dailyData, 
                    currentMonth === 11 ? currentYear + 1 : currentYear, 
                    currentMonth === 11 ? 0 : currentMonth + 1
                  )}
                  year={currentMonth === 11 ? currentYear + 1 : currentYear}
                  month={currentMonth === 11 ? 0 : currentMonth + 1}
                  isCompact={true}
                  monthlyProfitLoss={getMonthlyProfitLoss(currentMonth === 11 ? currentYear + 1 : currentYear, currentMonth === 11 ? 0 : currentMonth + 1)}
                />
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="tv-grid-full">
            <div className="tv-panel">
              <div className="tv-panel-header">
                Data Controls
              </div>
              <div className="tv-panel-content" style={{ textAlign: 'center' }}>
                <button
                  onClick={() => {
                    setTradeData([]);
                    setDailyData([]);
                    setSummary(null);
                  }}
                  className="tv-button"
                >
                  Import New Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}