# Date Picker Component Documentation

## Overview

The DatePicker component is a robust, timezone-aware date selection system designed for the Globe Trotter travel booking platform. It prevents users from selecting invalid dates while maintaining excellent user experience across all booking types.

## Features

### ✅ **Date Validation & Restriction**
- **Past Date Prevention**: All dates before today are automatically disabled
- **Real-time Updates**: Automatically refreshes available dates at midnight
- **Timezone Handling**: Uses user's local timezone for accurate date detection
- **Range Validation**: Supports min/max date restrictions for dependent date fields

### ✅ **Visual Design**
- **Disabled Date Styling**: Past dates shown with opacity 0.3, gray color, and strikethrough
- **Clear Visual Hierarchy**: Distinct styling for available, selected, disabled, and today's date
- **Accessibility Compliant**: Proper ARIA labels and keyboard navigation support
- **Smooth Transitions**: Animated calendar open/close with hover states

### ✅ **User Experience**
- **Helpful Error Messages**: "Past dates are not available for booking"
- **Today Button**: Quick selection for current date
- **Month Navigation**: Easy browsing with disabled past months
- **Click Outside to Close**: Intuitive interaction patterns

## Usage Examples

### Basic Date Selection
```tsx
<DatePicker
  label="Travel Date"
  value={selectedDate}
  onChange={setSelectedDate}
  placeholder="Select your travel date"
/>
```

### Hotel Check-in/Check-out (Dependent Dates)
```tsx
<DatePicker
  label="Check-in"
  value={checkIn}
  onChange={setCheckIn}
/>

<DatePicker
  label="Check-out"
  value={checkOut}
  onChange={setCheckOut}
  minDate={checkIn} // Ensures check-out is after check-in
/>
```

### Flight Return Date
```tsx
<DatePicker
  label="Return Date"
  value={returnDate}
  onChange={setReturnDate}
  minDate={departureDate}
  helperText="Return date must be after departure"
/>
```

## Props Interface

```tsx
interface DatePickerProps {
  label?: string;           // Field label
  value?: string;           // Current selected date (YYYY-MM-DD format)
  onChange: (date: string) => void; // Date change handler
  error?: string;           // Error message to display
  placeholder?: string;     // Placeholder text
  minDate?: string;         // Minimum selectable date
  maxDate?: string;         // Maximum selectable date
  disabled?: boolean;       // Disable the entire picker
  className?: string;       // Additional CSS classes
  required?: boolean;       // Show required indicator
  helperText?: string;      // Helper text below input
}
```

## Technical Implementation

### **Date Detection & Validation**
```javascript
// Get today's date in user's timezone
const today = new Date();
today.setHours(0, 0, 0, 0);

// Real-time midnight update
useEffect(() => {
  const timeUntilMidnight = /* calculation */;
  const timer = setTimeout(() => {
    setCurrentMonth(new Date()); // Refresh at midnight
  }, timeUntilMidnight);
  return () => clearTimeout(timer);
}, []);
```

### **Date Validation Logic**
```javascript
const isDateDisabled = (date: Date): boolean => {
  // Disable past dates
  if (date < effectiveMinDate) return true;
  
  // Disable future dates beyond max
  if (effectiveMaxDate && date > effectiveMaxDate) return true;
  
  return false;
};
```

### **Timezone Handling Approach**

1. **Client-Side Detection**: Uses JavaScript's `Date` object to detect user's local timezone
2. **Consistent Formatting**: All dates stored in ISO format (YYYY-MM-DD)
3. **Real-time Updates**: Component automatically updates at midnight transitions
4. **Server Compatibility**: Date format compatible with backend APIs

## Edge Cases Handled

### ✅ **Midnight Transitions**
- Component automatically refreshes available dates at midnight
- Timer-based update system prevents stale date restrictions

### ✅ **Daylight Saving Time**
- Uses native JavaScript Date handling for DST transitions
- Consistent behavior across timezone changes

### ✅ **Server-Client Time Discrepancies**
- Client-side validation prevents most booking errors
- Server-side validation provides final safety net

### ✅ **Accessibility**
- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard support for date selection
- **Focus Management**: Clear focus indicators and logical tab order
- **Error Announcements**: Screen reader compatible error messages

## Integration with Booking Services

### **Flights**
- Departure date: Today or future
- Return date: Must be after departure date

### **Hotels**
- Check-in: Today or future
- Check-out: Must be after check-in date

### **Trains**
- Journey date: Today or future
- Single date selection

### **Cabs**
- Pickup date: Today or future
- Time-based bookings supported

## Error Prevention

1. **Visual Feedback**: Disabled dates are clearly marked and non-interactive
2. **Validation Messages**: Clear error messages for invalid selections
3. **Dependent Date Logic**: Automatic adjustment of min/max dates based on related fields
4. **Real-time Validation**: Immediate feedback on date selection

## Performance Considerations

- **Efficient Rendering**: Only renders visible month dates
- **Minimal Re-renders**: Optimized state management
- **Memory Management**: Proper cleanup of timers and event listeners
- **Lazy Loading**: Calendar only renders when opened

This implementation ensures zero booking errors related to past date selection while providing an intuitive, accessible date selection experience across all travel services.