export const formatDateToLocale = (dateString: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(navigator.language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  } catch {
    // Fallback to original string if parsing fails
    return dateString;
  }
};

export const formatTimeToLocale = (timeString: string): string => {
  if (!timeString) return '';
  try {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    return new Intl.DateTimeFormat(navigator.language, {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  } catch {
    return timeString;
  }
};

export const validateEndDate = (endDate: string, startDate?: string): boolean => {
  if (!endDate || !startDate) return true;
  return new Date(endDate) >= new Date(startDate);
};
