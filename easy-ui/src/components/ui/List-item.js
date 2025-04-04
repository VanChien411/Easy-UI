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
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); /* Cân đối các phần tử */
          }
       
          .sort-button {
            margin-bottom: 10px;
          }
          .card {
            border: 1px solid var(--card-border-color);
            padding: 10px; /* 20% smaller */
            max-width: 100%; /* 20% smaller */
            min-width: 200px; /* 20% smaller */
            transition: transform 0.3s, box-shadow 0.3s;
            cursor: pointer;
            border-radius: 9.6px; /* 20% smaller */  
            background-color: var(--background-color-rgba);
            min-height: 50px;
            max-height: 100%;
            position: relative; /* Ensure the icon is positioned relative to the card */
          }
          
          .card:hover {
            box-shadow: 0 0 15px var(--card-border-color); /* Tăng độ mạnh của bóng */
          }

          .card.expanded {
            grid-column: span 3;
            grid-row: span 2;
            max-width: 90vw; /* Prevent overflow by limiting width */
            max-height: 90vh; /* Prevent overflow by limiting height */
            overflow: hidden; /* Add scrollbars if content overflows */
          }

          @media (max-width: 768px) {
            .card.expanded {
              grid-column: span 1; /* Adjust for smaller screens */
              grid-row: span 2;
              max-width: 100%; /* Use full width on smaller screens */
              max-height: 80vh; /* Adjust height for smaller screens */
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
            z-index: 2; /* Ensure it appears above other elements */
          }

          .icon-expand:hover {
            background-color: rgba(200, 200, 200, 0.8);
          }

        `}
      </style>
      <div className="container">
        {items.map((item, index) => (
          <CardItem
            key={index}
            {...item}
            name={item.name}
            uiComponentId={item.id} // Pass the UI component ID
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
