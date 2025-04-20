import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { addItem } from "../../../redux/slices/cartSlice";
import AddUi from "../Develop/AddUi";
import { showAlert } from "../../utils/Alert";
import CartService from "../../../services/CartService";
import { isFreeProduct } from "../../../services/uiComponentsService";

function CardItem({
  name,
  html,
  css,
  js,
  uiComponentId,
  price,
  isExpanded,
  onExpand,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isBuying, setIsBuying] = useState(false);
  
  console.log('Product data:', { name, price, uiComponentId });
  
  const isFree = !price || price === 0;

  const iframeContent = `
    <style>${css}</style>
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
      <div className={`card ${isExpanded ? "expanded" : ""}`}>
        {/* Icon for expand/collapse */}
        <div className="icon-expand" onClick={onExpand}>
          <i
            className={
              isExpanded
                ? "fa-solid fa-down-left-and-up-right-to-center"
                : "fa-solid fa-up-right-and-down-left-from-center"
            }
          ></i>
        </div>
        <div className="row">
          {isExpanded ? (
            <AddUi
              html={html}
              css={css}
              js={js}
              name={name}
              isEdit={false}
            ></AddUi>
          ) : (
            <>
              <iframe
                srcDoc={iframeContent}
                title="Preview"
                sandbox="allow-scripts allow-same-origin"
                style={{ border: "none", width: "100%", height: "100%" }}
              ></iframe>
            </>
          )}
        </div>
        <hr className="divider" />
        <div className="button-container">
          <div className="button-hashtags">
            {html && <button className="button-hashtag button-html">Html</button>}
            {js && <button className="button-hashtag button-js">JavaScript</button>}
            {css && <button className="button-hashtag button-css">Css</button>}
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
