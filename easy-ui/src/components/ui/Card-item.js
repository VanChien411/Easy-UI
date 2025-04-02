import React from "react";

function CardItem({ name, html, css, js }) {
  console.log(html);
  console.log(css);
  return (
    <>
      <style>{css}</style>
      <div className="card">
        <div className="row">
          <div className="left-column">
            <p dangerouslySetInnerHTML={{ __html: html }}></p>
          </div>
          <div className="right-column">
            <img
              src="/assets/images/avata3d.jpg"
              alt="Product"
              className="image"
            />
          </div>
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
      <script>{js}</script>
    </>
  );
}

export default CardItem;
