import React from "react";

const Spinner = ({ size = 20 }) => {
  return (
    <svg
      fill="hsl(228, 97%, 42%)"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      className="spinner"
      style={{ width: size, height: size }}
    >
      <defs>
        <linearGradient id="RadialGradient8932">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      <style>
        {`@keyframes spin8932 {
          to {
            transform: rotate(360deg);
          }
        }
        #circle8932 {
          transform-origin: 50% 50%;
          stroke: url(#RadialGradient8932);
          fill: none;
          animation: spin8932 .5s infinite linear;
        }`}
      </style>
      <circle cx="10" cy="10" r="8" id="circle8932" strokeWidth="2" />
    </svg>
  );
};

export default Spinner;
