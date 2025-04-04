import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../../redux/slices/cartSlice";
import CartService from "../../services/CartService";
import "../../assets/styles/ShopCart.css";

const ShopCart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const items = await CartService.getCartItems(); // Now returns plain objects
      dispatch(setCart(items)); // Dispatch plain objects to Redux
    } catch (error) {
      console.error("Error fetching cart items:", error);
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

  const handleCheckout = () => {
    alert("Proceeding to checkout...");
  };

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
            Total Price: $
            {cartItems
              .reduce((sum, item) => sum + item.price * item.quantity, 0)
              .toFixed(2)}
          </p>
          <button className="checkout-btn" onClick={handleCheckout}>
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopCart;
