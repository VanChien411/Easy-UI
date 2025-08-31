import { useCallback } from 'react';
import { useAuth } from './useAuth';
import { useLoginModal } from './useLoginModal';

/**
 * Custom hook để xử lý API calls với authentication
 * Tự động mở login modal nếu user chưa đăng nhập
 */
export const useApiWithAuth = () => {
  const { isAuthenticated } = useAuth();
  const { openLoginModal } = useLoginModal();

  const callApiWithAuth = useCallback(async (apiCall, requireAuth = true) => {
    // Nếu API không cần auth hoặc user đã đăng nhập, gọi API bình thường
    if (!requireAuth || isAuthenticated) {
      return await apiCall();
    }

    // Nếu cần auth nhưng user chưa đăng nhập, mở login modal
    return new Promise((resolve, reject) => {
      openLoginModal(async () => {
        try {
          // Sau khi login thành công, gọi lại API
          const result = await apiCall();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });
  }, [isAuthenticated, openLoginModal]);

  return { callApiWithAuth };
};
