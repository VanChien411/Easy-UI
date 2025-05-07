/**
 * Format a date using various predefined formats or a custom format
 * @param {Date|string} date - Date to format
 * @param {string} format - Format to use ('short', 'medium', 'long', 'full', or custom)
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, format = 'medium') => {
  if (!date) {
    return '';
  }

  const dateObj = date instanceof Date ? date : new Date(date);
  
  // Return empty string for invalid dates
  if (isNaN(dateObj.getTime())) {
    console.warn('Invalid date provided to formatDate:', date);
    return '';
  }

  // Predefined formats
  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString();
    
    case 'medium':
      return dateObj.toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    
    case 'long':
      return dateObj.toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    
    case 'full':
      return dateObj.toLocaleDateString(undefined, { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    
    case 'time':
      return dateObj.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
      });
    
    case 'datetime':
      return `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
      })}`;
    
    case 'relative':
      return getRelativeTimeString(dateObj);
    
    default:
      return dateObj.toLocaleDateString();
  }
};

/**
 * Get a relative time string (e.g., "2 hours ago", "yesterday")
 * @param {Date} date - Date to convert to relative time
 * @returns {string} - Relative time string
 */
export const getRelativeTimeString = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return 'yesterday';
  }
  
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};

/**
 * Format a date range between two dates
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @param {string} format - Format to use for each date
 * @returns {string} - Formatted date range
 */
export const formatDateRange = (startDate, endDate, format = 'medium') => {
  const start = formatDate(startDate, format);
  
  if (!endDate) {
    return `${start} - Present`;
  }
  
  const end = formatDate(endDate, format);
  return `${start} - ${end}`;
}; 