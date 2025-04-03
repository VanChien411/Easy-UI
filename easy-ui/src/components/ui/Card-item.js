import React from "react";
import AddUi from "../ui/Develop/AddUi";

function CardItem({ name, html, css, js, isExpanded, onExpand }) {
  const iframeContent = `
    <style>${css}</style>
    ${html}
    <script>${js}</script>
  `;

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
            <AddUi html={html} css={css} js={js}></AddUi>
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
          {html && <button className="button-hashtag button-html">Html</button>}
          {js && (
            <button className="button-hashtag button-js">JavaScript</button>
          )}
          {css && <button className="button-hashtag button-css">Css</button>}
          <button className="button-hashtag buy">Buy Now</button>
        </div>
      </div>
    </>
  );
}

export default CardItem;
