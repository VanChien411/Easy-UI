import React from "react";

function CardItem() {
  return (
    <>
      <style>
        {`
          .card {
            border: 1px solid var(--card-border-color);
            padding: 10px; /* 20% smaller */
            max-width: 400px; /* 20% smaller */
            min-width: 200px; /* 20% smaller */
            transition: transform 0.3s, box-shadow 0.3s;
            cursor: pointer;
            border-radius: 9.6px; /* 20% smaller */  
            background-color: var(--background-color-rgba);
          }
          
          .card:hover {
            box-shadow: 0 0 15px var(--card-border-color); /* Tăng độ mạnh của bóng */
          }

          .row {
            display: flex;
            flex-direction: row;
         
          }

          .left-column {
            flex: 1;
            padding-right: 6.4px; /* 20% smaller */
          }

          .right-column {
            flex: 1;
          }

          .image {
            width: 100%; /* 20% smaller */
          }

          .button-container {
            text-align: center;
            display: flex;
            flex-wrap: wrap;
            align-content: center;
            gap: 6.4px; /* 20% smaller */
          }

          .button-hashtag {
            padding: 3px 10px; /* 20% smaller */
            cursor: pointer;
            border-radius: 9.6px; /* 20% smaller */
            transition: background-color 0.3s;
            border: none;
          }

          .button-html {
            background-color: var(--button-html-color);
            color: white;
        
          }

          .button-js {
            background-color: var(--button-js-color);
            color: black;
          }

          .button-css {
            background-color: var(--button-css-color);
            color: white;
          }

          .divider {
            margin: 10px 0; /* 20% smaller */
          }
        `}
      </style>
      <div className="card">
        <div className="row">
          <div className="left-column">
            <p>Product description </p>
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
          <button className="button-hashtag button-html">Html</button>
          <button className="button-hashtag button-js">JavaScript</button>
          <button className="button-hashtag button-css">Css</button>
          <button className="button-hashtag">Buy Now</button>
        </div>
      </div>
    </>
  );
}

export default CardItem;
