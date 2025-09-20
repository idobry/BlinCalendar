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
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '60vh',
          flexDirection: 'column',
          gap: '32px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{ 
              fontSize: '32px', 
              fontWeight: '600', 
              color: 'var(--v0-text-primary)',
              marginBottom: '12px',
              letterSpacing: '-0.025em'
            }}>
              Welcome to BlinCalendar
            </h2>
            <p style={{ 
              fontSize: '16px', 
              color: 'var(--v0-text-secondary)',
              maxWidth: '480px',
              lineHeight: '1.6'
            }}>
              Professional trading journal with sleek analytics. Import your trading data to get started with comprehensive performance tracking.
            </p>
          </div>
          
          <div className="tv-panel" style={{ maxWidth: '600px', width: '100%' }}>
            <div className="tv-panel-header">
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18"/>
                  <path d="M7 16l4-4 4 4 6-6"/>
                </svg>
                Import Trading Data
              </span>
            </div>
            <div className="tv-panel-content">
              <FileUpload onDataLoaded={handleDataLoaded} />
              <div style={{ 
                marginTop: '24px', 
                textAlign: 'center',
                paddingTop: '24px',
                borderTop: '1px solid var(--v0-border)'
              }}>
                <button
                  onClick={loadMockData}
                  className="tv-button-secondary"
                  style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                  Load Demo Data
                </button>
                <p style={{ 
                  fontSize: '13px', 
                  color: 'var(--v0-text-muted)',
                  marginTop: '8px'
                }}>
                  Try the interface with sample trading data
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Performance Dashboard Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <div>
              <h2 style={{ 
                fontSize: '28px', 
                fontWeight: '600', 
                color: 'var(--v0-text-primary)',
                marginBottom: '4px',
                letterSpacing: '-0.025em'
              }}>
                Trading Dashboard
              </h2>
              <p style={{ 
                fontSize: '14px', 
                color: 'var(--v0-text-secondary)'
              }}>
                {tradeData.length} trades loaded • Professional analytics
              </p>
            </div>
            
            <button
              onClick={() => {
                setTradeData([]);
                setDailyData([]);
                setSummary(null);
              }}
              className="tv-button-secondary"
              style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
              Import New Data
            </button>
          </div>

          {/* Performance Summary Cards */}
          {summary && (
            <SummaryStats summary={summary} />
          )}

          {/* Month Navigation Panel */}
          {availableMonths.length > 0 && (
            <div className="tv-panel">
              <div className="tv-panel-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Time Navigation
                </span>
              </div>
              <div className="tv-panel-content">
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '20px', 
                  justifyContent: 'center', 
                  flexWrap: 'wrap' 
                }}>
                  <button
                    onClick={() => {
                      if (currentMonth === 0) {
                        setCurrentMonth(11);
                        setCurrentYear(currentYear - 1);
                      } else {
                        setCurrentMonth(currentMonth - 1);
                      }
                    }}
                    className="tv-button-secondary tv-button-small"
                  >
                    ← Previous
                  </button>
                  
                  <select
                    value={`${currentYear}-${currentMonth}`}
                    onChange={(e) => {
                      const [year, month] = e.target.value.split('-').map(Number);
                      setCurrentYear(year);
                      setCurrentMonth(month);
                    }}
                    className="tv-select"
                    style={{ minWidth: '220px', fontSize: '14px' }}
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
                    className="tv-button-secondary tv-button-small"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Calendar Grid with Enhanced Layout */}
          <div>
            <div style={{ 
              display: 'grid', 
              gap: '24px', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
              marginBottom: '16px'
            }}>
              {/* Previous Month (Compact) */}
              <div style={{ opacity: '0.75' }}>
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
              
              {/* Current Month (Featured) */}
              <div style={{ 
                gridColumn: availableMonths.length > 2 ? 'span 1' : 'span 2',
                transform: 'scale(1.02)',
                zIndex: 10,
                position: 'relative'
              }}>
                <Calendar
                  dailyData={generateCalendarData(dailyData, currentYear, currentMonth)}
                  year={currentYear}
                  month={currentMonth}
                  isCompact={false}
                  monthlyProfitLoss={getMonthlyProfitLoss(currentYear, currentMonth)}
                />
              </div>
              
              {/* Next Month (Compact) */}
              <div style={{ opacity: '0.75' }}>
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
        </div>
      )}
    </>
  );
}