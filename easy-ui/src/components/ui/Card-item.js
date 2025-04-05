import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "../../redux/slices/cartSlice";
import AddUi from "../ui/Develop/AddUi";
import { showAlert } from "../utils/Alert";
import CartService from "../../services/CartService"; // Import CartService

function CardItem({
  name,
  html,
  css,
  js,
  uiComponentId,
  isExpanded,
  onExpand,
}) {
  const dispatch = useDispatch();
  const [isBuying, setIsBuying] = useState(false); // State to track loading

  const iframeContent = `
    <style>${css}</style>
    ${html}
    <script>${js}</script>
  `;

  const handleBuyNow = async () => {
    setIsBuying(true); // Show spinner
    try {
      // Send API request to add the item to the cart
      await CartService.addToCart({ uiComponentId, quantity: 1 });

      // Dispatch Redux action to update the cart state
      dispatch(addItem({ uiComponentId, name, quantity: 1 }));

      // Show success alert
      showAlert({
        title: "Success",
        message: "cart successfully!",
        type: "success",
      });
    } catch (error) {
      // Show error alert if the API call fails
      showAlert({
        title: "Error",
        message: error.message || "Failed to add item to cart!",
        type: "error",
      });
    } finally {
      setIsBuying(false); // Hide spinner
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
            {html && (
              <button className="button-hashtag button-html">Html</button>
            )}
            {js && (
              <button className="button-hashtag button-js">JavaScript</button>
            )}
            {css && <button className="button-hashtag button-css">Css</button>}
          </div>
          <div className="button-buy">
            <button
              className="button-hashtag buy"
              onClick={handleBuyNow}
              disabled={isBuying}
            >
              {isBuying ? <i className="fa fa-spinner fa-spin"></i> : "Buy"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CardItem;
