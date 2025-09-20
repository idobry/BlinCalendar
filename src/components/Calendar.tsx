'use client';

import { useState } from 'react';
import { DailyData } from '@/lib/types';
import { formatCurrency } from '@/lib/tradeProcessor';
import TradePopup from './TradePopup';

interface CalendarProps {
  dailyData: DailyData[];
  year: number;
  month: number;
  isCompact?: boolean;
  monthlyProfitLoss?: number;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar({ dailyData, year, month, isCompact = false, monthlyProfitLoss = 0 }: CalendarProps) {
  const [selectedDay, setSelectedDay] = useState<DailyData | null>(null);
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Create array of days including empty slots for proper alignment
  const calendarDays: (DailyData | null)[] = [];
  
  // Add empty slots for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayData = dailyData.find(d => d.date === dateStr) || {
      date: dateStr,
      trades: [],
      totalProfit: 0,
      totalTrades: 0,
      hasActivity: false
    };
    calendarDays.push(dayData);
  }

  const handleDayClick = (dayData: DailyData | null) => {
    if (dayData && dayData.hasActivity) {
      setSelectedDay(dayData);
    }
  };

  return (
    <>
      <div className="tv-calendar" style={{ 
        transition: 'all 0.3s ease-in-out',
        ...(isCompact ? { transform: 'scale(0.95)', opacity: '0.9' } : {})
      }}>
        <div className="tv-calendar-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div>
              <span style={{ 
                fontSize: isCompact ? '16px' : '18px', 
                fontWeight: '500',
                color: 'var(--v0-text-primary)'
              }}>
                {MONTH_NAMES[month]} {year}
              </span>
              {!isCompact && (
                <div style={{ 
                  fontSize: '13px', 
                  color: 'var(--v0-text-secondary)',
                  marginTop: '2px'
                }}>
                  {dailyData.filter(d => d.hasActivity).length} trading days
                </div>
              )}
            </div>
            {monthlyProfitLoss !== 0 && (
              <div style={{ textAlign: 'right' }}>
                <div 
                  className={`${monthlyProfitLoss >= 0 ? 'tv-positive' : 'tv-negative'} mono`}
                  style={{ 
                    fontWeight: '600',
                    fontSize: isCompact ? '14px' : '16px'
                  }}
                >
                  {monthlyProfitLoss.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </div>
                {!isCompact && (
                  <div style={{ 
                    fontSize: '11px', 
                    color: 'var(--v0-text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginTop: '2px'
                  }}>
                    Monthly P&L
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Day headers */}
        <div className="tv-calendar-grid">
          {DAY_NAMES.map(day => (
            <div key={day} className="tv-calendar-day-header">
              {isCompact ? day.slice(0, 3) : day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="tv-calendar-grid">
          {calendarDays.map((dayData, index) => (
            <div
              key={index}
              onClick={() => handleDayClick(dayData)}
              className={`tv-calendar-day ${
                !dayData || !dayData.hasActivity ? '' : 
                dayData.totalProfit > 0 ? 'profit' : 
                dayData.totalProfit < 0 ? 'loss' : 'neutral'
              }`}
            >
              {dayData && (
                <>
                  <div className="tv-calendar-day-number">
                    {new Date(dayData.date).getDate()}
                  </div>
                  {dayData.hasActivity && (
                    <div className="tv-calendar-day-amount">
                      <div style={{ 
                        fontWeight: '600',
                        color: dayData.totalProfit > 0 ? 'var(--v0-green)' : 
                               dayData.totalProfit < 0 ? 'var(--v0-red)' : 
                               'var(--v0-yellow)',
                        textShadow: dayData.totalProfit !== 0 ? '0 1px 2px rgba(0, 0, 0, 0.1)' : 'none'
                      }}>
                        {isCompact ? 
                          (dayData.totalProfit >= 0 ? '+' : '') + Math.round(dayData.totalProfit) :
                          formatCurrency(dayData.totalProfit)
                        }
                      </div>
                      {!isCompact && (
                        <div style={{ 
                          fontSize: '10px', 
                          opacity: 0.75,
                          color: 'var(--v0-text-secondary)',
                          fontWeight: '500'
                        }}>
                          {dayData.totalTrades} trade{dayData.totalTrades !== 1 ? 's' : ''}
                        </div>
                      )}
                      {isCompact && dayData.totalTrades > 0 && (
                        <div style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: dayData.totalProfit > 0 ? 'var(--v0-green)' : 
                                         dayData.totalProfit < 0 ? 'var(--v0-red)' : 
                                         'var(--v0-yellow)',
                          marginTop: '2px'
                        }} />
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Trade Popup */}
      {selectedDay && (
        <TradePopup
          dayData={selectedDay}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </>
  );
}