import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this import

function Sidebar() {
  const navigate = useNavigate(); // Initialize useNavigate
  const handleMenuClickRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const menuBtn = document.querySelector(".menu-btn");

    const handleMenuClick = (e) => {
      document.body.classList.toggle("collapsed");
      document.querySelectorAll(".dropdown").forEach((dropdown) => {
        dropdown.classList.remove("active");
      });
    };

    handleMenuClickRef.current = handleMenuClick;

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

    handleResize();

    return () => {
      menuBtn.removeEventListener("click", handleMenuClick);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleDropdownClick = (e) => {
    e.preventDefault();
    const dropdown = e.currentTarget.parentElement;
    dropdown.classList.toggle("active");
    if (document.body.classList.contains("collapsed")) {
      handleMenuClickRef.current();
    }
  };

  const handleMenuItemClick = (e, path) => {
    e.preventDefault();
    document.querySelectorAll(".menu-items a").forEach((item) => {
      item.classList.remove("selected");
    });
    e.currentTarget.classList.add("selected");
    if (path) navigate(path); // Navigate to the specified path
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <aside>
      <div className="logo-container">
        <a href="#" className="logo-wrapper">
          <span
            className="fa-brands fa-uikit"
            onClick={() => handleMenuClickRef.current()}
          ></span>
          <span className="brand-name">Smart UI Studio</span>
        </a>
        <i
          className="fa-solid fa-xmark close-sidebar"
          onClick={() => handleMenuClickRef.current()}
        ></i>
      </div>
      <div className="separator"></div>
      {/* <div className="search-bar">
        <input
          type="text"
          placeholder="Search components..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <span className="fa fa-search"></span>
      </div> */}
      <ul className="menu-items">
        <li className="dropdown">
          <a href="#" onClick={handleDropdownClick}>
            <span className="icon fa fa-cube"></span>
            <span className="item-name">Components</span>
            <span className="dropdown-icon fa fa-chevron-down"></span>
          </a>
          <ul className="dropdown-menu menu-items">
            <li>
              <a href="#" onClick={(e) => handleMenuItemClick(e, "/Buttons")}>
                <span className="icon fa fa-square"></span>
                <span className="item-name">Buttons</span>
              </a>
            </li>
            <li>
              <a href="#" onClick={handleMenuItemClick}>
                <span className="icon fa fa-clone"></span>
                <span className="item-name">Cards</span>
              </a>
            </li>
            <li>
              <a href="#" onClick={handleMenuItemClick}>
                <span className="icon fa fa-edit"></span>
                <span className="item-name">Forms & Inputs</span>
              </a>
            </li>
            <li>
              <a href="#" onClick={handleMenuItemClick}>
                <span className="icon fa fa-window-maximize"></span>
                <span className="item-name">Modals & Dialogs</span>
              </a>
            </li>
            <li>
              <a href="#" onClick={handleMenuItemClick}>
                <span className="icon fa fa-table"></span>
                <span className="item-name">Tables</span>
              </a>
            </li>
          </ul>
        </li>
        <li className="dropdown">
          <a href="#" onClick={handleDropdownClick}>
            <span className="icon fa fa-paint-brush"></span>
            <span className="item-name">Styles</span>
            <span className="dropdown-icon fa fa-chevron-down"></span>
          </a>
          <ul className="dropdown-menu menu-items">
            <li>
              <a href="#" onClick={handleMenuItemClick}>
                <span className="icon fa fa-palette"></span>
                <span className="item-name">Colors & Themes</span>
              </a>
            </li>
            <li>
              <a href="#" onClick={handleMenuItemClick}>
                <span className="icon fa fa-border-style"></span>
                <span className="item-name">Borders & Shadows</span>
              </a>
            </li>
            <li>
              <a href="#" onClick={handleMenuItemClick}>
                <span className="icon fa fa-font"></span>
                <span className="item-name">Typography</span>
              </a>
            </li>
            <li>
              <a href="#" onClick={handleMenuItemClick}>
                <span className="icon fa fa-icons"></span>
                <span className="item-name">Icons</span>
              </a>
            </li>
          </ul>
        </li>
        <li className="dropdown">
          <a href="#" onClick={handleDropdownClick}>
            <span className="icon fa fa-tools"></span>
            <span className="item-name">Utilities</span>
            <span className="dropdown-icon fa fa-chevron-down"></span>
          </a>
          <ul className="dropdown-menu menu-items">
            <li>
              <a href="#" onClick={handleMenuItemClick}>
                <span className="icon fa fa-th"></span>
                <span className="item-name">Grid System</span>
              </a>
            </li>
            <li>
              <a href="#" onClick={handleMenuItemClick}>
                <span className="icon fa fa-arrows-alt"></span>
                <span className="item-name">Flexbox Helpers</span>
              </a>
            </li>
            <li>
              <a href="#" onClick={handleMenuItemClick}>
                <span className="icon fa fa-expand"></span>
                <span className="item-name">Spacing & Sizing</span>
              </a>
            </li>
          </ul>
        </li>
        <li className="dropdown">
          <a href="#" onClick={handleDropdownClick}>
            <span className="icon fa fa-link"></span>
            <span className="item-name">Templates</span>
            <span className="dropdown-icon fa fa-chevron-down"></span>
          </a>
          <ul className="dropdown-menu menu-items">
            <li>
              <a href="#" onClick={handleMenuItemClick}>
                <span className="icon fa fa-sign-in-alt"></span>
                <span className="item-name">Login Forms</span>
              </a>
            </li>
            <li>
              <a href="#" onClick={handleMenuItemClick}>
                <span className="icon fa fa-tachometer-alt"></span>
                <span className="item-name">Dashboards</span>
              </a>
            </li>
            <li>
              <a href="#" onClick={handleMenuItemClick}>
                <span className="icon fa fa-rocket"></span>
                <span className="item-name">Landing Pages</span>
              </a>
            </li>
            <li>
              <a href="#" onClick={handleMenuItemClick}>
                <span className="icon fa fa-shopping-cart"></span>
                <span className="item-name">E-commerce UI</span>
              </a>
            </li>
          </ul>
        </li>
        <li className="dropdown">
          <a href="#" onClick={handleDropdownClick}>
            <span className="icon fa fa-chart-bar"></span>
            <span className="item-name">Analytics</span>
            <span className="dropdown-icon fa fa-chevron-down"></span>
          </a>
          <ul className="dropdown-menu menu-items">
            <li>
              <a href="#" onClick={handleMenuItemClick}>
                <span className="icon fa fa-star"></span>
                <span className="item-name">Popular Components</span>
              </a>
            </li>
            <li>
              <a href="#" onClick={handleMenuItemClick}>
                <span className="icon fa fa-download"></span>
                <span className="item-name">User Downloads</span>
              </a>
            </li>
            <li>
              <a href="#" onClick={handleMenuItemClick}>
                <span className="icon fa fa-comment"></span>
                <span className="item-name">Feedback & Ratings</span>
              </a>
            </li>
          </ul>
        </li>
        <li className="dropdown">
          <a href="#" onClick={handleDropdownClick}>
            <span className="fa-brands fa-connectdevelop fa-spin fa-spin-reverse"></span>
            <span className="item-name">Develop</span>
            <span className="dropdown-icon fa fa-chevron-down"></span>
          </a>
          <ul className="dropdown-menu menu-items">
            <li>
              <a href="#" onClick={(e) => handleMenuItemClick(e, "/AddUi")}>
                <span className="icon fa fa-code"></span>
                <span className="item-name">Add UI</span>
              </a>
            </li>
            <li>
              <a href="#" onClick={handleMenuItemClick}>
                <span className="icon fa fa-terminal"></span>
                <span className="item-name">CLI Tools</span>
              </a>
            </li>
            <li>
              <a href="#" onClick={handleMenuItemClick}>
                <span className="icon fa fa-database"></span>
                <span className="item-name">Database Tools</span>
              </a>
            </li>
          </ul>
        </li>
        <li className="dropdown">
          <a href="#" onClick={handleDropdownClick}>
            <span className="icon fa fa-cog"></span>
            <span className="item-name">Settings</span>
            <span className="dropdown-icon fa fa-chevron-down"></span>
          </a>
          <ul className="dropdown-menu menu-items">
            <li>
              <a href="#" onClick={handleMenuItemClick}>
                <span className="icon fa fa-user"></span>
                <span className="item-name">Profile</span>
              </a>
            </li>
            <li>
              <a href="#" onClick={handleMenuItemClick}>
                <span className="icon fa fa-credit-card"></span>
                <span className="item-name">Subscription Plans</span>
              </a>
            </li>
            <li>
              <a href="#" onClick={handleMenuItemClick}>
                <span className="icon fa fa-key"></span>
                <span className="item-name">API Access</span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
