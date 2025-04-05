import React, { useState } from "react";
import CardItem from "./Card-item";

function ListItem({ items }) {
  const [expandedCard, setExpandedCard] = useState(null);

  const handleExpand = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <div>
      <style>
        {`
          .container {
            display: grid;
            flex-wrap: wrap;
            flex-direction: row;
            justify-content: center;
            gap: 10px;
            padding: 10px;
            align-content: stretch;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            position: relative;
          }
       
          .sort-button {
            margin-bottom: 10px;
          }
          .card {
            border: 1px solid var(--card-border-color);
            padding: 10px;
            max-width: 100%;
            min-width: 200px;
            transition: all 0.3s ease;
            cursor: pointer;
            border-radius: 9.6px;
            background-color: var(--background-color-rgba);
            min-height: 50px;
            max-height: 100%;
            position: relative;
            transform-origin: center;
          }
          
          .card:hover {
            box-shadow: 0 0 15px var(--card-border-color);
          }

          .card.expanded {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9); /* Shrink instead of enlarging */
            z-index: 1000;
            width: auto;
            min-width: 70vw; /* Adjusted to fit smaller size */
            max-width: 60vw;
            height: auto;
            min-height: 40vh; /* Adjusted to fit smaller size */
            max-height: calc(100vh - 40px); /* Prevent overflow by limiting height */
            background-color: var(--background-color-rgba);
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
            padding: 20px;
            display: flex;
            flex-direction: column;
            overflow: auto; /* Add scroll if content exceeds max height */
          }
         
          .card.expanded .left-column,
          .card.expanded .right-column {
            flex: 1;
            display: flex;
            flex-direction: column;
          }

          .card.expanded .image {
            width: 100%;
            height: auto;
            max-height: 60vh;
            object-fit: contain;
          }

          .card.expanded::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: -1;
          }


          .icon-expand {
            position: absolute;
            top: 10px;
            right: 10px;
            cursor: pointer;
            font-size: 16px;
            background-color: var(--background-color);
            border-radius: 50%;
            padding: 5px;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
            z-index: 2;
          }

          .icon-expand:hover {
            background-color: rgba(200, 200, 200, 0.8);
          }

       @media (min-width: 568px) {
 .card.expanded .add-ui-container {
              display: grid;
      grid-template-columns: repeat(auto-fill, minmax(500px, 1fr)); /* Cân đối các phần tử */
          }
        }
          @media (max-width: 768px) {
            .card.expanded {
              min-width: 85vw;
              max-width: 95vw;
              min-height: 60vh;
              max-height: 90vh;
              transform: translate(-50%, -50%) scale(1);
            }
          }
               .add-ui-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* Cân đối các phần tử */
    }
          .row {
            display: flex;
            flex-direction: row;
         
          }

          .left-column {
            flex: 1;
            padding-right: 6.4px; /* 20% smaller */
            overflow: "hidden"
            
          }

          .right-column {
            flex: 1;
            cursor: pointer;
          }

          .image {
            width: 100%; /* 20% smaller */
            object-fit: cover; /* Cắt ảnh để vừa với thẻ cha */
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
            .button-hashtag:hover {
            box-shadow: 0 0 10px 2px var(--card-border-color); /* Bóng từ trong ra ngoài */
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
          .button-hashtag.buy{
            background-color:rgb(18, 193, 26);
            color: white;
          }
          .divider {
            margin: 10px 0; /* 20% smaller */
          }

        `}
      </style>
      <div className="container">
        {items.map((item, index) => (
          <CardItem
            key={index}
            {...item}
            name={item.name}
            uiComponentId={item.id}
            html={item.html}
            css={item.css}
            js={item.js}
            isExpanded={expandedCard === index}
            onExpand={() => handleExpand(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default ListItem;
