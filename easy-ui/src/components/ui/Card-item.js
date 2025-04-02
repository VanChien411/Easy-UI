import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function CardItem({ name, html, css, js }) {
  return (
    <div className="card">
      <div className="card-header">
        <h3>{name}</h3>
      </div>
      <div className="card-content">
        {html && (
          <div className="code-section">
            <h4>HTML</h4>
            <SyntaxHighlighter language="html" style={materialDark}>
              {html}
            </SyntaxHighlighter>
          </div>
        )}
        {css && (
          <div className="code-section">
            <h4>CSS</h4>
            <SyntaxHighlighter language="css" style={materialDark}>
              {css}
            </SyntaxHighlighter>
          </div>
        )}
        {js && (
          <div className="code-section">
            <h4>JavaScript</h4>
            <SyntaxHighlighter language="javascript" style={materialDark}>
              {js}
            </SyntaxHighlighter>
          </div>
        )}
      </div>
      <div className="card-footer">
        <button className="button-hashtag buy">Buy Now</button>
      </div>
    </div>
  );
}

export default CardItem;
