import React, { useState, useEffect } from 'react';
import './PurchasedProducts.css';
import { IoEyeOutline } from "react-icons/io5";
import { IoChevronBackOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Footer from '../../Layout/Footer';
import OrderService from '../../../services/OrderService';
import { toast } from 'react-toastify';
import OrderDetailModal from './OrderDetailModal';

const PurchasedProducts = () => {
  const navigate = useNavigate();
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode) ?? true;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchPurchasedProducts();
  }, []);

  const fetchPurchasedProducts = async () => {
    try {
      setLoading(true);
      const data = await OrderService.getPurchasedProducts();
      setOrders(data);
    } catch (error) {
      toast.error('Không thể tải danh sách đơn hàng: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Format date string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.paymentStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetail = async (orderId) => {
    try {
      setModalLoading(true);
      const orderDetail = await OrderService.getOrderById(orderId);
      setSelectedOrder(orderDetail);
    } catch (error) {
      toast.error('Không thể tải chi tiết đơn hàng: ' + error.message);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className={`purchased-products-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <div className="purchased-products">
        <div className="header">
          <button onClick={handleBack} className="back-button">
            <IoChevronBackOutline />
          </button>
          <h1>Đơn hàng của tôi</h1>
        </div>

        <div className="search-section">
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Tìm kiếm đơn hàng..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="Completed">Đã thanh toán</option>
              <option value="Pending">Chờ thanh toán</option>
              <option value="Cancelled">Đã hủy</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <div className="loading-spinner">Đang tải...</div>
          ) : filteredOrders.length > 0 ? (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Mã đơn hàng</th>
                  <th>Ngày mua</th>
                  <th>Sản phẩm</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.orderId}>
                    <td>{order.orderId}</td>
                    <td>{formatDate(order.purchaseDate)}</td>
                    <td>{order.productName}</td>
                    <td>{formatPrice(order.totalAmount)}</td>
                    <td>
                      <span className={`status-badge ${order.paymentStatus.toLowerCase()}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="view-detail-btn"
                        onClick={() => handleViewDetail(order.orderId)}
                      >
                        <IoEyeOutline />
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-orders">
              <p>Không tìm thấy đơn hàng nào</p>
            </div>
          )}
        </div>
      </div>
      {selectedOrder && (
        <OrderDetailModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
      <Footer />
    </div>
  );
};

export default PurchasedProducts; 