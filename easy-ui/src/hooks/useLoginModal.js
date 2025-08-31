import { createContext, useContext, useState, useCallback } from 'react';

const LoginModalContext = createContext();

export const useLoginModal = () => {
  const context = useContext(LoginModalContext);
  if (!context) {
    throw new Error('useLoginModal must be used within a LoginModalProvider');
  }
  return context;
};

export const LoginModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const openLoginModal = useCallback((action = null) => {
    setPendingAction(action);
    setIsModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsModalOpen(false);
    setPendingAction(null);
  }, []);

  const handleLoginSuccess = useCallback(() => {
    // Nếu có pending action, thực hiện nó
    if (pendingAction && typeof pendingAction === 'function') {
      pendingAction();
    }
    closeLoginModal();
  }, [pendingAction, closeLoginModal]);

  return (
    <LoginModalContext.Provider
      value={{
        isModalOpen,
        openLoginModal,
        closeLoginModal,
        handleLoginSuccess,
        pendingAction
      }}
    >
      {children}
    </LoginModalContext.Provider>
  );
};
