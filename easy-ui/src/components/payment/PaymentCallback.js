import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PaymentService from '../../services/PaymentService';
import OrderService from '../../services/OrderService';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const orderId = searchParams.get('orderId');
        if (!orderId) {
          setStatus('error');
          return;
        }

        // Check payment status
        const paymentStatus = await PaymentService.getPaymentStatus(orderId);
        
        // Get order details
        const order = await OrderService.getOrderById(orderId);
        
        if (paymentStatus.status === 'success' && order.paymentStatus === 'paid') {
          setStatus('success');
        } else {
          setStatus('failed');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('error');
      }
    };

    verifyPayment();
  }, [searchParams]);

  const renderStatus = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="payment-status processing">
            <i className="fa fa-spinner fa-spin"></i>
            <h2>Verifying Payment...</h2>
            <p>Please wait while we verify your payment</p>
          </div>
        );
      case 'success':
        return (
          <div className="payment-status success">
            <i className="fa fa-check-circle"></i>
            <h2>Payment Successful!</h2>
            <p>Thank you for your purchase</p>
            <button onClick={() => navigate('/')}>Continue Shopping</button>
          </div>
        );
      case 'failed':
        return (
          <div className="payment-status failed">
            <i className="fa fa-times-circle"></i>
            <h2>Payment Failed</h2>
            <p>Something went wrong with your payment</p>
            <button onClick={() => navigate('/cart')}>Try Again</button>
          </div>
        );
      default:
        return (
          <div className="payment-status error">
            <i className="fa fa-exclamation-circle"></i>
            <h2>Error</h2>
            <p>An unexpected error occurred</p>
            <button onClick={() => navigate('/cart')}>Return to Cart</button>
          </div>
        );
    }
  };

  return (
    <div className="payment-callback">
      {renderStatus()}
    </div>
  );
};

export default PaymentCallback; 