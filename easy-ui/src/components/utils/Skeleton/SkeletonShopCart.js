import React from "react";
import "./SkeletonShopCart.css";

const SkeletonShopCart = () => {
  return (
    <div className="skeleton-shop-cart">
      <div className="skeleton-cart-content">
        <div className="skeleton-cart-items">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="skeleton-cart-item">
              <div className="skeleton-image"></div>
              <div className="skeleton-item-details">
                <div className="skeleton-title"></div>
                <div className="skeleton-price"></div>
              </div>
              <div className="skeleton-quantity-controls">
                <div className="skeleton-button"></div>
                <div className="skeleton-quantity"></div>
                <div className="skeleton-button"></div>
              </div>
              <div className="skeleton-remove-btn"></div>
            </div>
          ))}
        </div>
        <div className="skeleton-order-summary">
          <div className="skeleton-summary-title"></div>
          <div className="skeleton-total-items"></div>
          <div className="skeleton-total-price"></div>
          <div className="skeleton-checkout-btn"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonShopCart;
