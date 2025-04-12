import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PaymentService from '../../services/PaymentService';
import CartService from '../../services/CartService';
import { setCart } from '../../redux/slices/cartSlice';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [status, setStatus] = useState('processing');
  const [checkCount, setCheckCount] = useState(0);
  const MAX_CHECKS = 10; // Số lần check tối đa

  const clearCartAfterSuccess = async () => {
    try {
      console.log('Starting to clear cart...');
      await CartService.clearCart();
      console.log('Cart cleared successfully');
      
      // Cập nhật Redux store để xóa giỏ hàng
      dispatch(setCart([]));
    } catch (error) {
      console.error('Error clearing cart:', error);
      // Vẫn tiếp tục hiển thị thành công ngay cả khi xóa giỏ hàng thất bại
    }
  };

  const processCallback = async () => {
    try {
      // Lấy tất cả các tham số từ URL
      const params = Object.fromEntries(searchParams.entries());
      const orderInfo = params.orderInfo;
      const resultCode = params.resultCode;

      if (!orderInfo) {
        throw new Error('Missing orderInfo in callback parameters');
      }

      // Trích xuất orderId từ orderInfo
      const orderIdMatch = orderInfo.match(/Payment for order (.*)/);
      if (!orderIdMatch || !orderIdMatch[1]) {
        throw new Error('Invalid orderInfo format');
      }

      const orderId = orderIdMatch[1];
      console.log('Extracted orderId:', orderId);

      // Nếu thanh toán thành công (resultCode = 0)
      if (resultCode === '0') {
        // Gửi callback data đến API để xử lý
        const callbackResult = await PaymentService.processMomoCallback(params);
        console.log('Callback processing result:', callbackResult);

        // Kiểm tra trạng thái thanh toán
        await checkPaymentStatus(orderId);
      } else {
        setStatus('failed');
        console.error('Payment failed with resultCode:', resultCode);
      }
    } catch (err) {
      console.error('Payment callback processing error:', err);
      setStatus('error');
    }
  };

  const checkPaymentStatus = async (orderId) => {
    try {
      const { status: paymentStatus } = await PaymentService.getPaymentStatus(orderId);
      console.log('Payment status:', paymentStatus);

      switch (paymentStatus) {
        case 'Completed':
          // Đảm bảo xóa giỏ hàng trước khi set status
          await clearCartAfterSuccess();
          setStatus('success');
          return true;
        case 'Pending':
          if (checkCount < MAX_CHECKS) {
            setStatus('processing');
            setCheckCount(prev => prev + 1);
            // Thử lại sau 3 giây
            setTimeout(() => checkPaymentStatus(orderId), 3000);
          } else {
            setStatus('pending');
          }
          return false;
        case 'Failed':
          setStatus('failed');
          return false;
        default:
          setStatus('error');
          return false;
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      setStatus('error');
      return false;
    }
  };

  useEffect(() => {
    processCallback();
  }, []);

  const renderStatus = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="payment-status processing">
            <i className="fa fa-spinner fa-spin"></i>
            <h2>Đang xác nhận thanh toán...</h2>
            <p>Vui lòng đợi trong giây lát...</p>
          </div>
        );
      case 'pending':
        return (
          <div className="payment-status pending">
            <i className="fa fa-clock"></i>
            <h2>Giao dịch đang chờ xử lý</h2>
            <p>Vui lòng kiểm tra lại sau vài phút</p>
            <button onClick={() => navigate('/orders')}>Xem đơn hàng</button>
          </div>
        );
      case 'success':
        return (
          <div className="payment-status success">
            <i className="fa fa-check-circle"></i>
            <h2>Thanh toán thành công!</h2>
            <p>Giỏ hàng đã được xóa</p>
            <button onClick={() => navigate('/')}>Tiếp tục mua hàng</button>
          </div>
        );
      case 'failed':
        return (
          <div className="payment-status failed">
            <i className="fa fa-times-circle"></i>
            <h2>Thanh toán thất bại</h2>
            <button onClick={() => navigate('/cart')}>Thử lại</button>
          </div>
        );
      default:
        return (
          <div className="payment-status error">
            <i className="fa fa-exclamation-circle"></i>
            <h2>Đã có lỗi xảy ra</h2>
            <button onClick={() => navigate('/cart')}>Trở lại giỏ hàng</button>
          </div>
        );
    }
  };

  return (
    <div className="payment-callback">{renderStatus()}</div>
  );
};

export default PaymentCallback; 