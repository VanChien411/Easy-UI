import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import userManagerService from '../services/usermanagerService';
import '../styles/VerifyEmail.css';

const VerifyEmail = () => {
  const [verificationStatus, setVerificationStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyEmail = async () => {
      // Get userId and token from URL parameters
      const searchParams = new URLSearchParams(location.search);
      const userId = searchParams.get('userId');
      const token = searchParams.get('token');

      if (!userId || !token) {
        setVerificationStatus('error');
        setErrorMessage('Missing verification parameters. Please check your link.');
        return;
      }

      try {
        await userManagerService.confirmEmail(userId, token);
        setVerificationStatus('success');
      } catch (error) {
        console.error('Email verification failed:', error);
        setVerificationStatus('error');
        setErrorMessage(error.message || 'Verification failed. Please try again or contact support.');
      }
    };

    verifyEmail();
  }, [location.search]);

  const handleRedirect = () => {
    navigate('/profile/notifications');
  };

  return (
    <div className="verify-email-container">
      <div className="verify-email-card">
        <h1 className="verify-email-title">Email Verification</h1>
        
        {verificationStatus === 'loading' && (
          <div className="verify-email-loading">
            <div className="spinner"></div>
            <p>Verifying your email address...</p>
          </div>
        )}
        
        {verificationStatus === 'success' && (
          <div className="verify-email-success">
            <div className="verify-email-icon success-icon">✓</div>
            <h2>Email Verified Successfully!</h2>
            <p>Your email has been verified. You can now access all features of your account.</p>
            <button className="redirect-button" onClick={handleRedirect}>
              Go to Profile
            </button>
          </div>
        )}
        
        {verificationStatus === 'error' && (
          <div className="verify-email-error">
            <div className="verify-email-icon error-icon">✗</div>
            <h2>Verification Failed</h2>
            <p>{errorMessage}</p>
            <button className="redirect-button" onClick={handleRedirect}>
              Go to Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail; 