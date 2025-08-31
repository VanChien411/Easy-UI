import { useCallback } from 'react';
import { useAuth } from './useAuth';
import { useLoginModal } from './useLoginModal';

/**
 * Custom hook để xử lý các action cần authentication
 * Tự động mở login modal nếu user chưa đăng nhập
 */
export const useAuthAction = () => {
  const { isAuthenticated } = useAuth();
  const { openLoginModal } = useLoginModal();

  const executeAuthAction = useCallback(async (action, requireAuth = true) => {
    // Nếu action không cần auth hoặc user đã đăng nhập, thực hiện ngay
    if (!requireAuth || isAuthenticated) {
      return await action();
    }

    // Nếu cần auth nhưng user chưa đăng nhập, mở login modal
    return new Promise((resolve, reject) => {
      openLoginModal(async () => {
        try {
          // Sau khi login thành công, thực hiện action
          const result = await action();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });
  }, [isAuthenticated, openLoginModal]);

  return { executeAuthAction };
};
