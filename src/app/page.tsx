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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeView, setActiveView] = useState<'daily' | 'monthly' | 'calendar'>('calendar');

  const handleDataLoaded = (data: TradeRecord[]) => {
    setTradeData(data);
    const processed = processTradeData(data);
    setDailyData(processed.dailyData);
    setSummary(processed.summary);
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

  const availableMonths = getAvailableMonths();
  const currentYear = selectedDate.getFullYear();
  const currentMonth = selectedDate.getMonth();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">My Trading Journal</h1>
          <p className="text-gray-400">Track your trading performance with visual calendar insights</p>
        </header>

        {tradeData.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <FileUpload onDataLoaded={handleDataLoaded} />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Navigation Tabs */}
            <div className="flex justify-center">
              <div className="bg-gray-800 rounded-lg p-1 flex">
                {[
                  { key: 'daily', label: 'Daily' },
                  { key: 'monthly', label: 'Monthly' },
                  { key: 'calendar', label: 'Calendar' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveView(tab.key as any)}
                    className={`px-6 py-2 rounded-md transition-colors ${
                      activeView === tab.key
                        ? 'bg-white text-gray-900'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary Statistics */}
            {summary && (
              <div className="mb-8">
                <SummaryStats summary={summary} />
              </div>
            )}

            {/* Month Navigation */}
            {availableMonths.length > 0 && (
              <div className="flex justify-center items-center gap-4 mb-6">
                <button
                  onClick={() => {
                    const prevMonth = new Date(selectedDate);
                    prevMonth.setMonth(prevMonth.getMonth() - 1);
                    setSelectedDate(prevMonth);
                  }}
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
                >
                  ← Previous
                </button>
                
                <div className="bg-gray-800 px-4 py-2 rounded-lg">
                  <span className="text-gray-300 text-sm">Center Month: </span>
                  <select
                    value={`${currentYear}-${currentMonth}`}
                    onChange={(e) => {
                      const [year, month] = e.target.value.split('-').map(Number);
                      setSelectedDate(new Date(year, month, 1));
                    }}
                    className="bg-transparent text-white outline-none"
                  >
                    {availableMonths.map(({ year, month }) => (
                      <option key={`${year}-${month}`} value={`${year}-${month}`} className="bg-gray-800">
                        {new Date(year, month).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long' 
                        })}
                      </option>
                    ))}
                  </select>
                </div>
                
                <button
                  onClick={() => {
                    const nextMonth = new Date(selectedDate);
                    nextMonth.setMonth(nextMonth.getMonth() + 1);
                    setSelectedDate(nextMonth);
                  }}
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
                >
                  Next →
                </button>
              </div>
            )}

            {/* Calendar View */}
            {activeView === 'calendar' && (
              <div className="space-y-4">
                {/* Desktop: 3 months in a row */}
                <div className="hidden lg:grid lg:grid-cols-3 gap-4">
                  {/* Previous Month */}
                  <Calendar
                    dailyData={generateCalendarData(dailyData, 
                      currentMonth === 0 ? currentYear - 1 : currentYear, 
                      currentMonth === 0 ? 11 : currentMonth - 1
                    )}
                    year={currentMonth === 0 ? currentYear - 1 : currentYear}
                    month={currentMonth === 0 ? 11 : currentMonth - 1}
                    isCompact={true}
                  />
                  
                  {/* Current Month */}
                  <Calendar
                    dailyData={generateCalendarData(dailyData, currentYear, currentMonth)}
                    year={currentYear}
                    month={currentMonth}
                    isCompact={true}
                  />
                  
                  {/* Next Month */}
                  <Calendar
                    dailyData={generateCalendarData(dailyData, 
                      currentMonth === 11 ? currentYear + 1 : currentYear, 
                      currentMonth === 11 ? 0 : currentMonth + 1
                    )}
                    year={currentMonth === 11 ? currentYear + 1 : currentYear}
                    month={currentMonth === 11 ? 0 : currentMonth + 1}
                    isCompact={true}
                  />
                </div>

                {/* Mobile/Tablet: Single month view */}
                <div className="lg:hidden">
                  <Calendar
                    dailyData={generateCalendarData(dailyData, currentYear, currentMonth)}
                    year={currentYear}
                    month={currentMonth}
                    isCompact={false}
                  />
                </div>
              </div>
            )}

            {/* Load New Data Button */}
            <div className="text-center">
              <button
                onClick={() => {
                  setTradeData([]);
                  setDailyData([]);
                  setSummary(null);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Load Different Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}