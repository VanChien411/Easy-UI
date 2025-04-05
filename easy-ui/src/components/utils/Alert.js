import React, { useState } from "react";
import styles from "../../assets/styles/Alert.module.css"; // Import as styles for CSS Modules
import { v4 as uuidv4 } from "uuid"; // Import UUID for unique identifiers

let alertQueue = [];
let setAlertQueue = () => {}; // Initialize as a no-op function to avoid runtime errors

function Alert() {
  const [alerts, setAlerts] = useState([]);
  setAlertQueue = (newAlerts) => {
    alertQueue = newAlerts; // Keep alertQueue in sync
    setAlerts(newAlerts);
  };

  return (
    <div className={styles["alert-container"]}>
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`${styles.toast} ${styles[alert.type]} ${styles.active}`}
        >
          <div className={styles["toast-content"]}>
            <i className={`fas ${alert.icon} ${styles.check}`}></i>
            <div className={styles.message}>
              <span className={`${styles.text} ${styles["text-1"]}`}>
                {alert.title}
              </span>
              <span className={`${styles.text} ${styles["text-2"]}`}>
                {alert.message}
              </span>
            </div>
          </div>
          <i
            className={`fa-solid fa-xmark ${styles.close}`}
            onClick={() => {
              const updatedAlerts = alertQueue.filter((a) => a.id !== alert.id); // Remove by ID
              setAlertQueue(updatedAlerts);
            }}
          ></i>
          <div
            className={`${styles.progress} ${styles.active}`}
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
  setAlertQueue([...alertQueue]); // Ensure setAlertQueue is always callable
}

export default Alert;
