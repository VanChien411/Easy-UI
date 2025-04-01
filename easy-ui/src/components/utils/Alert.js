import React, { useState } from "react";
import "../../assets/styles/Alert.css";
import { v4 as uuidv4 } from "uuid"; // Import UUID for unique identifiers

let alertQueue = [];
let setAlertQueue;

function Alert() {
  const [alerts, setAlerts] = useState([]);
  setAlertQueue = (newAlerts) => {
    alertQueue = newAlerts; // Keep alertQueue in sync
    setAlerts(newAlerts);
  };

  return (
    <div className="alert-container">
      {alerts.map((alert) => (
        <div key={alert.id} className={`toast ${alert.type} active`}>
          <div className="toast-content">
            <i className={`fas ${alert.icon} check`}></i>
            <div className="message">
              <span className="text text-1">{alert.title}</span>
              <span className="text text-2">{alert.message}</span>
            </div>
          </div>
          <i
            className="fa-solid fa-xmark close"
            onClick={() => {
              const updatedAlerts = alertQueue.filter((a) => a.id !== alert.id); // Remove by ID
              setAlertQueue(updatedAlerts);
            }}
          ></i>
          <div
            className="progress active"
            onAnimationEnd={() => {
              const updatedAlerts = alertQueue.filter((a) => a.id !== alert.id); // Remove by ID
              setAlertQueue(updatedAlerts);
            }}
          ></div>
        </div>
      ))}
    </div>
  );
}

export function showAlert({ title, message, type = "success", icon }) {
  if (!icon) {
    icon =
      type === "warning"
        ? "fa-solid fa-triangle-exclamation"
        : type === "error"
        ? "fa-solid fa-circle-exclamation"
        : "fa-check";
  }
  alertQueue.push({ id: uuidv4(), title, message, type, icon }); // Use UUID for unique ID
  setAlertQueue([...alertQueue]);
}

export default Alert;
