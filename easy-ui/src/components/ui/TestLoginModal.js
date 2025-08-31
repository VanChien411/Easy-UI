import React from 'react';
import { useLoginModal } from '../../hooks/useLoginModal';
import { useApiWithAuth } from '../../hooks/useApiWithAuth';

function TestLoginModal() {
  const { openLoginModal } = useLoginModal();
  const { callApiWithAuth } = useApiWithAuth();

  const handleTestLoginModal = () => {
    openLoginModal();
  };

  const handleTestApiWithAuth = async () => {
    try {
      const result = await callApiWithAuth(
        async () => {
          // Simulate API call that requires authentication
          console.log('Calling protected API...');
          return { success: true, message: 'API call successful' };
        },
        true // requireAuth = true
      );
      console.log('API result:', result);
    } catch (error) {
      console.error('API error:', error);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Test Login Modal</h3>
      <button 
        onClick={handleTestLoginModal}
        style={{ 
          padding: '10px 20px', 
          margin: '10px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Open Login Modal
      </button>
      
      <button 
        onClick={handleTestApiWithAuth}
        style={{ 
          padding: '10px 20px', 
          margin: '10px', 
          backgroundColor: '#28a745', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Test API with Auth
      </button>
    </div>
  );
}

export default TestLoginModal;
