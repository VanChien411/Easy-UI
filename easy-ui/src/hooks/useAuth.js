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
  
  return {
    isAuthenticated,
    user: authState.user || null,
    userId: authState.user?.id || null,
  };
};

export default useAuth;
