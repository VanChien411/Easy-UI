import React, { useState } from 'react';
import './PurchasedProducts.css';

const PurchasedProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  return (
    <div className="purchased-products">
      <h1>Đơn hàng đã mua</h1>
      
      <div className="search-section">
        <input
          type="text"
          placeholder="Nhập mã đơn hàng"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">Mã đơn hàng</option>
          <option value="date">Ngày mua</option>
          <option value="status">Trạng thái</option>
        </select>
        <button className="search-btn">Tìm đơn hàng</button>
      </div>

      <div className="notice-section">
        <h3>Xin lưu ý:</h3>
        <ul>
          <li>Bấm vào MÃ ĐƠN HÀNG để xem chi tiết sản phẩm đã mua!</li>
          <li>Tạp Hóa MMO là sàn thương mại điện tử, vì vậy tính năng và chất lượng sản phẩm không thể nào rõ bằng người bán hàng, nếu có bất cứ thắc mắc gì về mặt hàng, xin liên hệ chủ shop để được giải quyết hoặc bảo hành.</li>
          <li>Trong trường hợp chủ shop không giải quyết hoặc giải quyết không thỏa đáng, hãy bấm vào "Khiếu nại đơn hàng", để bên mình có thể giữ tiền đơn hàng đó (lâu hơn 3 ngày) trong lúc bạn đợi phản hồi từ người bán. Bạn hoàn toàn có thể Hủy khiếu nại sau đó.</li>
          <li>Bên mình chỉ giữ tiền 3 ngày, trong trường hợp đơn hàng không có khiếu nại gì, tiền sẽ được chuyển cho người bán, vì vậy xin hãy KIỂM TRA KỸ SẢN PHẨM sau khi mua.</li>
        </ul>
      </div>

      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>Thao tác</th>
              <th>Mã đơn hàng</th>
              <th>Ngày mua</th>
              <th>Gian hàng</th>
              <th>Mặt hàng</th>
              <th>Người bán</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Giảm</th>
              <th>Tổng tiền</th>
              <th>Hoàn tiền</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {/* Render order items here */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchasedProducts; 