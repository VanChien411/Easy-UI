import React, { useEffect } from "react";

function Sidebar() {
  useEffect(() => {
    const menuBtn = document.querySelector(".menu-btn");
    const handleMenuClick = (e) => {
      document.body.classList.toggle("collapsed");
      e.currentTarget.classList.toggle("fa-chevron-right");
      e.currentTarget.classList.toggle("fa-chevron-left");
    };

    menuBtn.addEventListener("click", handleMenuClick);

    // Cleanup event listener on component unmount
    return () => {
      menuBtn.removeEventListener("click", handleMenuClick);
    };
  }, []);

  return (
    <aside>
      <button className="menu-btn fa fa-chevron-left"></button>
      <a href="/" className="logo-wrapper">
        <span className="fa-brands fa-uikit"></span>
        <span className="brand-name">Smart UI Studio</span>
      </a>
      <div className="separator"></div>
      <ul className="menu-items">
        <li>
          <a href="https://example.com">
            <span className="icon fa fa-house"></span>
            <span className="item-name">Home</span>
          </a>
          <span className="tooltip">Home</span>
        </li>
        <li>
          <a href="https://example.com">
            <span className="icon fa fa-layer-group"></span>
            <span className="item-name">Dashboard</span>
          </a>
          <span className="tooltip">Dashboard</span>
        </li>
        <li>
          <a href="https://example.com">
            <span className="icon fa fa-chart-line"></span>
            <span className="item-name">Analytics</span>
          </a>
          <span className="tooltip">Analytics</span>
        </li>
        <li>
          <a href="https://example.com">
            <span className="icon fa fa-chart-simple"></span>
            <span className="item-name">Leaderboard</span>
          </a>
          <span className="tooltip">Leaderboard</span>
        </li>
        <li>
          <a href="https://example.com">
            <span className="icon fa fa-user"></span>
            <span className="item-name">Account</span>
          </a>
          <span className="tooltip">Account</span>
        </li>
        <li>
          <a href="https://example.com">
            <span className="icon fa fa-gear"></span>
            <span className="item-name">Settings</span>
          </a>
          <span className="tooltip">Settings</span>
        </li>
        <li>
          <a href="https://example.com">
            <span className="icon fa fa-comment-dots"></span>
            <span className="item-name">Contact</span>
          </a>
          <span className="tooltip">Contact</span>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
