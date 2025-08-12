import React, { useState, useEffect, useRef } from 'react';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

interface DatePickerProps {
  label?: string;
  value?: string;
  onChange: (date: string) => void;
  error?: string;
  placeholder?: string;
  minDate?: string;
  maxDate?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  helperText?: string;
  excludeSameDay?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  error,
  placeholder = 'Select date',
  minDate,
  maxDate,
  disabled = false,
  className,
  required = false,
  helperText,
  excludeSameDay = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper function to format date for display
  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString + 'T00:00:00'); // Ensure local timezone
      if (isNaN(date.getTime())) return '';
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '';
    }
  };

  // Get today's date in user's timezone
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate display value for input
  const displayValue = value ? formatDateForDisplay(value) : '';

  // Calculate effective minimum date
  let effectiveMinDate = today;
  if (minDate) {
    const minDateObj = new Date(minDate + 'T00:00:00');
    if (excludeSameDay) {
      effectiveMinDate = new Date(minDateObj);
      effectiveMinDate.setDate(effectiveMinDate.getDate() + 1);
    } else {
      // Use the later of today or minDate
      effectiveMinDate = minDateObj > today ? minDateObj : today;
    }
  }
  
  const effectiveMaxDate = maxDate ? new Date(maxDate + 'T00:00:00') : null;

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const parseDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString + 'T00:00:00');
      return isNaN(date.getTime()) ? null : date;
    } catch {
      return null;
    }
  };

  const isDateDisabled = (date: Date): boolean => {
    const dateToCheck = new Date(date);
    dateToCheck.setHours(0, 0, 0, 0);
    
    // Disable if before effective minimum date
    if (dateToCheck < effectiveMinDate) return true;
    
    // Disable if after maximum date
    if (effectiveMaxDate && dateToCheck > effectiveMaxDate) return true;
    
    return false;
  };

  const isDateSelected = (date: Date): boolean => {
    if (!value) return false;
    const selectedDate = parseDate(value);
    if (!selectedDate) return false;
    
    const dateToCheck = new Date(date);
    dateToCheck.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    
    return dateToCheck.getTime() === selectedDate.getTime();
  };

  const isToday = (date: Date): boolean => {
    const dateToCheck = new Date(date);
    dateToCheck.setHours(0, 0, 0, 0);
    return dateToCheck.getTime() === today.getTime();
  };

  const handleDateSelect = (date: Date) => {
    if (isDateDisabled(date)) return;
    
    const formattedDate = formatDateForInput(date);
    onChange(formattedDate);
    setIsOpen(false);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    const days: Date[] = [];
    
    // Add empty cells for days before the first day of the month
    const startDay = firstDay.getDay();
    for (let i = 0; i < startDay; i++) {
      days.push(new Date(year, month, -startDay + i + 1));
    }
    
    // Add all days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    // Add empty cells to complete the last week
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    return days;
  };

  const monthDays = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  const canNavigatePrev = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    const lastDayOfPrevMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0);
    lastDayOfPrevMonth.setHours(0, 0, 0, 0);
    return lastDayOfPrevMonth >= effectiveMinDate;
  };

  const handleTodaySelect = () => {
    if (!isDateDisabled(today)) {
      handleDateSelect(today);
    }
  };

  return (
    <div className={clsx('relative', className)} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Input Field */}
      <div className="relative">
        <input
          type="text"
          readOnly
          value={displayValue}
          placeholder={placeholder}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={clsx(
            'w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-orange-500 focus:border-orange-500 cursor-pointer',
            error && 'border-red-300 focus:ring-red-500 focus:border-red-500',
            disabled && 'bg-gray-50 cursor-not-allowed'
          )}
        />
        <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {/* Helper Text */}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}

      {/* Calendar Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => navigateMonth('prev')}
              disabled={!canNavigatePrev()}
              className={clsx(
                'p-2 rounded-md transition-colors',
                canNavigatePrev()
                  ? 'hover:bg-gray-100 text-gray-600'
                  : 'text-gray-300 cursor-not-allowed'
              )}
              aria-label="Previous month"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            
            <h3 className="text-lg font-semibold text-gray-900">
              {monthName}
            </h3>
            
            <button
              type="button"
              onClick={() => navigateMonth('next')}
              className="p-2 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
              aria-label="Next month"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {monthDays.map((date, index) => {
              const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
              const disabled = isDateDisabled(date);
              const selected = isDateSelected(date);
              const todayDate = isToday(date);

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDateSelect(date)}
                  disabled={disabled || !isCurrentMonth}
                  className={clsx(
                    'h-10 w-10 text-sm rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500',
                    {
                      // Current month dates
                      'text-gray-900': isCurrentMonth && !disabled,
                      'hover:bg-orange-50': isCurrentMonth && !disabled && !selected,
                      
                      // Selected date
                      'bg-orange-500 text-white font-semibold': selected && isCurrentMonth,
                      
                      // Today's date (if not selected)
                      'bg-blue-100 text-blue-800 font-medium': todayDate && !selected && isCurrentMonth && !disabled,
                      
                      // Disabled dates (past dates or excluded dates)
                      'text-gray-300 cursor-not-allowed opacity-30': disabled && isCurrentMonth,
                      'line-through': disabled && isCurrentMonth,
                      
                      // Other month dates
                      'text-gray-300 cursor-default': !isCurrentMonth,
                      
                      // Accessibility
                      'focus:ring-offset-2': !disabled
                    }
                  )}
                  aria-label={`${disabled ? 'Unavailable date: ' : 'Select date: '}${date.toLocaleDateString()}`}
                  aria-disabled={disabled || !isCurrentMonth}
                  title={disabled ? (excludeSameDay ? 'Same day booking not allowed' : 'Past dates are not available for booking') : undefined}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          {/* Footer with Today Button */}
          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
            <button
              type="button"
              onClick={handleTodaySelect}
              disabled={isDateDisabled(today)}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Select Today
            </button>
            <p className="text-xs text-gray-500">
              {excludeSameDay ? 'Must be at least next day' : 'Past dates are disabled'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};