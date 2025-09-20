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
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar({ dailyData, year, month, isCompact = false }: CalendarProps) {
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

  const getCellClassName = (dayData: DailyData | null) => {
    if (!dayData || !dayData.hasActivity) {
      return 'bg-gray-800 text-gray-500';
    }
    
    if (dayData.totalProfit > 0) {
      return 'bg-green-600 text-white';
    } else if (dayData.totalProfit < 0) {
      return 'bg-red-600 text-white';
    } else {
      return 'bg-gray-600 text-white';
    }
  };

  const handleDayClick = (dayData: DailyData | null) => {
    if (dayData && dayData.hasActivity) {
      setSelectedDay(dayData);
    }
  };

  return (
    <>
      <div className={`bg-gray-900 text-white ${isCompact ? 'p-3' : 'p-6'} rounded-lg`}>
        <h2 className={`${isCompact ? 'text-lg' : 'text-2xl'} font-bold ${isCompact ? 'mb-3' : 'mb-6'}`}>
          {MONTH_NAMES[month]}, {year}
        </h2>
        
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAY_NAMES.map(day => (
            <div key={day} className={`text-center text-gray-400 font-medium ${isCompact ? 'py-1 text-xs' : 'py-2'}`}>
              {isCompact ? day.slice(0, 1) : day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((dayData, index) => (
            <div
              key={index}
              onClick={() => handleDayClick(dayData)}
              className={`
                ${isCompact ? 'aspect-square p-1' : 'aspect-square p-2'} 
                rounded border border-gray-700 flex flex-col justify-between
                ${getCellClassName(dayData)}
                ${dayData && dayData.hasActivity ? 'cursor-pointer hover:opacity-80 hover:border-gray-400' : ''}
                ${!dayData || !dayData.hasActivity ? 'cursor-default' : ''}
              `}
            >
              {dayData && (
                <>
                  <div className={`${isCompact ? 'text-xs' : 'text-lg'} font-bold`}>
                    {new Date(dayData.date).getDate()}
                  </div>
                  {dayData.hasActivity && (
                    <div className={`${isCompact ? 'text-[0.6rem] leading-tight' : 'text-xs'}`}>
                      <div className="font-semibold">
                        {isCompact ? 
                          (dayData.totalProfit >= 0 ? '+' : '') + Math.round(dayData.totalProfit) :
                          formatCurrency(dayData.totalProfit)
                        }
                      </div>
                      {!isCompact && (
                        <div className="opacity-75">
                          {dayData.totalTrades} trade{dayData.totalTrades !== 1 ? 's' : ''}
                        </div>
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