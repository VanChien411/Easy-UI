import React, { useEffect, useRef } from "react";

function Sidebar() {
  const handleMenuClickRef = useRef(null);

  useEffect(() => {
    const menuBtn = document.querySelector(".menu-btn");

    const handleMenuClick = (e) => {
      document.body.classList.toggle("collapsed");
      e.currentTarget.classList.toggle("fa-chevron-right");
      e.currentTarget.classList.toggle("fa-chevron-left");

      // Hide all dropdowns by removing 'active' class
      document.querySelectorAll(".dropdown").forEach((dropdown) => {
        dropdown.classList.remove("active");
      });
    };

    // Lưu tham chiếu tới handleMenuClick vào ref
    handleMenuClickRef.current = handleMenuClick;

    // Handle window resize
    const handleResize = () => {
      if (window.innerWidth <= 668) {
        if (!document.body.classList.contains("collapsed")) {
          if (menuBtn) {
            handleMenuClickRef.current({ currentTarget: menuBtn });
          }
        }
      } else {
        if (document.body.classList.contains("collapsed")) {
          if (menuBtn) {
            handleMenuClickRef.current({ currentTarget: menuBtn });
          }
        }
      }
    };

    menuBtn.addEventListener("click", handleMenuClick);
    window.addEventListener("resize", handleResize);

    // Initial check
    handleResize();

    // Cleanup event listeners on component unmount
    return () => {
      menuBtn.removeEventListener("click", handleMenuClick);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleDropdownClick = (e) => {
    e.preventDefault();
    const dropdown = e.currentTarget.parentElement;
    dropdown.classList.toggle("active");

    // Gọi handleMenuClick trong handleDropdownClick
    if (document.body.classList.contains("collapsed")) {
      const menuBtn = document.querySelector(".menu-btn");
      if (handleMenuClickRef.current) {
        handleMenuClickRef.current({ currentTarget: menuBtn });
      }
    }
  };
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
        <li className="dropdown">
          <a href="#" onClick={handleDropdownClick}>
            <span className="icon fa fa-chart-line"></span>
            <span className="item-name">Analytics</span>
            <span className="dropdown-icon fa fa-chevron-down"></span>
          </a>
          <ul className="dropdown-menu menu-items">
            <li>
              <a href="https://example.com">
                <span className="icon fa fa-chart-pie"></span>
                <span className="item-name">Sub-item 1</span>
              </a>
            </li>
            <li>
              <a href="https://example.com">
                <span className="icon fa fa-chart-bar"></span>
                <span className="item-name">Sub-item 2</span>
              </a>
            </li>
          </ul>
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
