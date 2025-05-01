import { useSelector } from 'react-redux';

/**
 * Custom hook to access authentication state
 * @returns {Object} Authentication state including isAuthenticated and user
 */
export const useAuth = () => {
  // Get auth state from Redux store
  const authState = useSelector((state) => state.auth || {});
  
  // Check if user is authenticated
  const isAuthenticated = !!authState.isAuthenticated;
  
  // If there's no user in Redux store, try to get from local/session storage
  let user = authState.user;
  
  if (!user) {
    // Try to get from localStorage/sessionStorage as fallback
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      if (token) {
        // Try to parse JWT token
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        user = JSON.parse(window.atob(base64));
      }
    } catch (error) {
      console.error('Error parsing authentication token:', error);
    }
  }
  
  // Log auth status for debugging
  console.log('Auth state:', { isAuthenticated, user });
  
  return {
    isAuthenticated,
    user: user || null,
    userId: user?.id || 
           user?.nameid || 
           user?.sub || 
           user?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
  };
};

export default useAuth;
