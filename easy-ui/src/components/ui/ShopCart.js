import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCart } from "../../redux/slices/cartSlice";
import CartService from "../../services/CartService";
import OrderService from "../../services/OrderService";
import PaymentService from "../../services/PaymentService";
import OrderConfirmModal from "./OrderConfirmModal";
import "../../assets/styles/ShopCart.css";
import SkeletonShopCart from "../utils/Skeleton/SkeletonShopCart";

const ShopCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setIsLoading(true);
      const items = await CartService.getCartItems();
      dispatch(setCart(items));
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (id, delta) => {
    const item = cartItems.find((item) => item.id === id);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + delta);
    try {
      await CartService.updateCartItem(id, { quantity: newQuantity });
      fetchCartItems(); // Refresh the cart after update
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  };

  const removeItem = async (id) => {
    try {
      await CartService.removeCartItem(id);
      fetchCartItems(); // Refresh the cart after removal
    } catch (error) {
      console.error("Error removing cart item:", error);
    }
  };

  const handleCheckoutClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmOrder = async () => {
    try {
      setIsProcessing(true);
      
      // 1. Create order
      const order = await OrderService.createOrder("MOMO");
      
      // 2. Create Momo payment
      const paymentResponse = await PaymentService.createMomoPayment(order.id);
      
      // 3. Redirect to Momo payment page
      if (paymentResponse.paymentUrl) {
        window.location.href = paymentResponse.paymentUrl;
      } else {
        throw new Error("Không nhận được URL thanh toán từ MoMo");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Có lỗi xảy ra trong quá trình thanh toán: " + (error.message || "Không thể kết nối đến server"));
    } finally {
      setIsProcessing(false);
      setShowConfirmModal(false);
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (isLoading) {
    return <SkeletonShopCart />;
  }

  return (
    <div className="shop-cart">
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-cart-item">
              <img src={item.imageUrl} alt={item.uiComponentName} />
              <div className="item-details">
                <b>{item.uiComponentName}</b>
                <div>Price: ${item.price}</div>
              </div>
              <div className="quantity-controls">
                <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)}>+</button>
              </div>
              <button
                className="remove-btn"
                onClick={() => removeItem(item.id)}
                title="Remove"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          ))}
        </div>
        <div className="order-summary">
          <h2>Order Summary</h2>
          <p>Total Items: {totalQuantity}</p>
          <p>
            Total Price: ${totalAmount.toFixed(2)}
          </p>
          <button 
            className="checkout-btn" 
            onClick={handleCheckoutClick}
            disabled={cartItems.length === 0}
          >
            Thanh toán với MoMo
          </button>
        </div>
      </div>

      <OrderConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmOrder}
        cartItems={cartItems}
        totalAmount={totalAmount}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default ShopCart;
