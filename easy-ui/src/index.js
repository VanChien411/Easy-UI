import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const observerErrorHandler = (event) => {
  if (event.message.includes("ResizeObserver")) {
    event.stopImmediatePropagation();
  }
};
window.addEventListener("error", observerErrorHandler, true);
window.addEventListener("unhandledrejection", observerErrorHandler);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
