import React from 'react';
import './OrderConfirmModal.css';

const OrderConfirmModal = ({ isOpen, onClose, onConfirm, cartItems, totalAmount, isProcessing }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Xác nhận đơn hàng</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="order-items">
            <h3>Chi tiết đơn hàng</h3>
            {cartItems.map((item) => (
              <div key={item.id} className="order-item">
                <div className="item-info">
                  <img src={item.imageUrl} alt={item.uiComponentName} />
                  <div className="item-details">
                    <h4>{item.uiComponentName}</h4>
                    <p>Số lượng: {item.quantity}</p>
                  </div>
                </div>
                <div className="item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="order-summary">
            <div className="summary-row">
              <span>Tổng tiền hàng:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Phương thức thanh toán:</span>
              <span>MoMo</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose} disabled={isProcessing}>
            Hủy
          </button>
          <button 
            className="confirm-btn" 
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <><i className="fa fa-spinner fa-spin"></i> Đang xử lý...</>
            ) : (
              'Thanh toán với MoMo'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmModal; 