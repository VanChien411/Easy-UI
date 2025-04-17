import React from 'react';
import './PurchasedProducts.css';
import { IoEyeOutline } from "react-icons/io5";
import { IoChevronBackOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PurchasedProducts = () => {
  const navigate = useNavigate();
  const isDarkMode = useSelector((state) => state.theme?.isDarkMode) ?? true;

  const handleBack = () => {
    navigate(-1);
  };

  // Dữ liệu mẫu
  const orders = [
    {
      orderId: "ORD-12345",
      date: "15/04/2023",
      product: "iPhone 14 Pro Max 256GB",
      total: "26.990.000",
      status: "Đã giao hàng"
    },
    {
      orderId: "ORD-12346",
      date: "10/04/2023",
      product: "Samsung Galaxy S23 Ultra",
      total: "23.990.000",
      status: "Đã giao hàng"
    },
    {
      orderId: "ORD-12347",
      date: "05/04/2023",
      product: "MacBook Pro M2 14-inch",
      total: "49.990.000",
      status: "Đã giao hàng"
    },
    {
      orderId: "ORD-12348",
      date: "01/04/2023",
      product: "Sony WH-1000XM5 Headphones",
      total: "7.990.000",
      status: "Đã giao hàng"
    },
    {
      orderId: "ORD-12349",
      date: "28/03/2023",
      product: "iPad Air 5 64GB WiFi",
      total: "14.990.000",
      status: "Đã giao hàng"
    }
  ];

  return (
    <div className={`purchased-products ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <div className="header">
        <button onClick={handleBack} className="back-button">
          <IoChevronBackOutline />
        </button>
        <h1>Đơn hàng của tôi</h1>
      </div>

      <div className="search-section">
        <div className="search-bar">
          <input type="text" placeholder="Tìm kiếm đơn hàng..." />
          <select>
            <option>Tất cả</option>
          </select>
        </div>
      </div>

      <div className="table-container">
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
            {orders.map((order) => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{order.date}</td>
                <td>{order.product}</td>
                <td>{order.total} ₫</td>
                <td>
                  <span className="status-delivered">{order.status}</span>
                </td>
                <td>
                  <button className="view-detail-btn">
                    <IoEyeOutline />
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchasedProducts; 