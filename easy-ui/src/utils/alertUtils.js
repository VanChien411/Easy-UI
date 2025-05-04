/**
 * Utility functions for displaying alerts to the user
 * Uses a default implementation that can be replaced with a real toast library like react-toastify
 */

/**
 * Show a success alert/toast
 * @param {string} message - The success message to display
 * @param {number} duration - Duration in milliseconds
 */
export const showSuccessAlert = (message, duration = 3000) => {
  // This is a simple implementation that can be replaced with a real toast library
  console.log(`Success: ${message}`);
  
  // If you use a toast library like react-toastify, you would call it here
  if (window.toast && typeof window.toast.success === 'function') {
    window.toast.success(message, { duration });
  } else {
    alert(`Success: ${message}`);
  }
};

/**
 * Show an error alert/toast
 * @param {string} message - The error message to display
 * @param {number} duration - Duration in milliseconds
 */
export const showErrorAlert = (message, duration = 5000) => {
  // Log the error to console for debugging
  console.error(`Error: ${message}`);
  
  // If you use a toast library like react-toastify, you would call it here
  if (window.toast && typeof window.toast.error === 'function') {
    window.toast.error(message, { duration });
  } else {
    alert(`Error: ${message}`);
  }
};

/**
 * Show an info alert/toast
 * @param {string} message - The info message to display
 * @param {number} duration - Duration in milliseconds
 */
export const showInfoAlert = (message, duration = 3000) => {
  console.log(`Info: ${message}`);
  
  if (window.toast && typeof window.toast.info === 'function') {
    window.toast.info(message, { duration });
  } else {
    alert(`Info: ${message}`);
  }
};

/**
 * Show a warning alert/toast
 * @param {string} message - The warning message to display
 * @param {number} duration - Duration in milliseconds
 */
export const showWarningAlert = (message, duration = 4000) => {
  console.warn(`Warning: ${message}`);
  
  if (window.toast && typeof window.toast.warning === 'function') {
    window.toast.warning(message, { duration });
  } else {
    alert(`Warning: ${message}`);
  }
}; 