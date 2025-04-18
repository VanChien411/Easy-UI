import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoClose } from "react-icons/io5";
import './OrderDetailModal.css';

const OrderDetailModal = ({ order, onClose }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Chi tiết đơn hàng</h2>
          <button className="close-button" onClick={onClose}>
            <IoClose />
          </button>
        </div>

        <div className="modal-body">
          <div className="order-info-grid">
            <div className="info-group">
              <label>Mã đơn hàng:</label>
              <span>{order.id}</span>
            </div>
            <div className="info-group">
              <label>Ngày đặt:</label>
              <span>{formatDate(order.createdAt)}</span>
            </div>
            <div className="info-group">
              <label>Trạng thái:</label>
              <span className={`status-badge ${order.paymentStatus.toLowerCase()}`}>
                {order.paymentStatus}
              </span>
            </div>
            <div className="info-group">
              <label>Phương thức thanh toán:</label>
              <span>{order.paymentMethod}</span>
            </div>
          </div>

          <div className="order-items">
            <h3>Sản phẩm đã mua</h3>
            {order.items.map((item, index) => (
              <div key={index} className="order-item">
                <div className="item-info">
                  <h4>{item.uiComponentName}</h4>
                  <p className="item-price">{formatPrice(item.price)}</p>
                  <p className="item-quantity">Số lượng: {item.quantity}</p>
                </div>
                <button 
                  className="view-product-btn"
                  onClick={() => {
                    navigate(`/product/${item.uiComponentId}`);
                    onClose();
                  }}
                >
                  Xem sản phẩm
                </button>
              </div>
            ))}
          </div>

          <div className="order-summary">
            <div className="summary-row">
              <span>Tổng tiền hàng:</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
            <div className="summary-row total">
              <span>Tổng thanh toán:</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal; 