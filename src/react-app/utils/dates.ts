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

export const validateEndDate = (endDate: string, startDate?: string): boolean => {
  if (!endDate || !startDate) return true;
  return new Date(endDate) >= new Date(startDate);
};
