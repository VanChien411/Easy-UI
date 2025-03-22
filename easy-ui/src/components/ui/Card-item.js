import React from "react";

function CardItem() {
  return (
    <>
      <style>
        {`
          .card {
            border: 1px solid var(--text-color);
            padding: 16px;
            width: 100%;
            max-width: 250px;
            transition: transform 0.3s;
            cursor: pointer;
            border-radius: 12px;
            display: flex;
            flex-direction: column;
          }

          .card:hover {
            transform: scale(1.01);
          }

          .row {
            display: flex;
            flex-direction: row;
            margin-bottom: 16px;
          }

         

          .left-column {
            flex: 1;
            padding-right: 8px;
          }

          .right-column {
            flex: 1;
          }

          .image {
            width: 100%;
          }

          .button-container {
            text-align: center;
            display: flex;
            flex-wrap: wrap;
            align-content: center;
            gap: 8px;
          }

          .button {
            padding: 8px 16px;
            cursor: pointer;
            border-radius: 12px;
            transition: background-color 0.3s;
          }

          .button:hover {
            background-color: #ddd;
          }

          .divider {
            margin: 16px 0;
          }
        `}
      </style>
      <div className="card">
        <div className="row">
          <div className="left-column">
            <h2>Product Title</h2>
            <p>Product description goes here.</p>
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
          <button className="button">Buy Now</button>
          <button className="button">Buy Now</button>
          <button className="button">Buy Now</button>
          <button className="button">Buy Now</button>
        </div>
      </div>
    </>
  );
}

export default CardItem;
