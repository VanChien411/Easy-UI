import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { addItem } from "../../../redux/slices/cartSlice";
import AddUi from "../Develop/AddUi";
import { showAlert } from "../../utils/Alert";
import CartService from "../../../services/CartService";
import { isFreeProduct } from "../../../services/uiComponentsService";

function CardItem({
  item,
  isExpanded,
  onExpand,
}) {
  const cardRef = useRef(null);
  const { name, html, css, js, id: uiComponentId, price } = item || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isBuying, setIsBuying] = useState(false);
  
  // Handle click outside to close expanded card
  useEffect(() => {
    function handleClickOutside(event) {
      if (isExpanded && cardRef.current && !cardRef.current.contains(event.target)) {
        onExpand();
      }
    }

    // Add event listener when card is expanded
    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isExpanded, onExpand]);
  
  const isFree = !price || price === 0;

  const iframeContent = `
    <style>
      body {
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 200px;
        background-color: white;
        color: black;
      }
      ${css}
    </style>
    ${html}
    <script>${js}</script>
  `;

  const handleAction = async () => {
    if (isFree) {
      navigate(`/product/${uiComponentId}`);
      return;
    }

    setIsBuying(true);
    try {
      await CartService.addToCart({ uiComponentId, quantity: 1 });
      dispatch(addItem({ 
        uiComponentId, 
        name, 
        price: price || 0,
        quantity: 1 
      }));
      showAlert({
        title: "Success",
        message: "Added to cart successfully!",
        type: "success",
      });
    } catch (error) {
      showAlert({
        title: "Error",
        message: error.message || "Failed to add item to cart!",
        type: "error",
      });
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <>
      <div ref={cardRef} className={`card ${isExpanded ? "expanded" : ""}`}>
        {/* Preview Area */}
        <div className="row">
          {isExpanded ? (
            <AddUi
              html={html}
              css={css}
              js={js}
              name={name}
              isEdit={false}
            />
          ) : (
            <div className="card-preview">
              <iframe
                srcDoc={iframeContent}
                title="Preview"
                sandbox="allow-scripts allow-same-origin"
                style={{ border: "none", width: "100%", height: "220px" }}
              />
              <div className="icon-expand" onClick={onExpand}>
                <i className="fa-solid fa-up-right-and-down-left-from-center" />
              </div>
            </div>
          )}
        </div>

        {/* Footer with buttons */}
        <div className="button-container">
          <div className="button-hashtags">
            {html && <button className="button-hashtag button-html">Html</button>}
            {js && <button className="button-hashtag button-js">JS</button>}
            {css && <button className="button-hashtag button-css">CSS</button>}
          </div>
          <div className="button-buy">
            <button
              className={`button-hashtag ${isFree ? 'view-detail' : 'buy'}`}
              onClick={handleAction}
              disabled={isBuying}
            >
              {isBuying ? (
                <i className="fa fa-spinner fa-spin"></i>
              ) : isFree ? (
                <>
                  <i className="fas fa-eye"></i> View
                </>
              ) : (
                <>
                  <i className="fas fa-shopping-cart"></i> Buy
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Price Tag */}
        <div className="price-tag">
          {isFree ? (
            <span className="free-label">Free</span>
          ) : (
            <span className="price-label">${Number(price).toFixed(2)}</span>
          )}
        </div>
      </div>
    </>
  );
}

export default CardItem;
