import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
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

  useEffect(() => {
    // Remove active class from all menu items
    document.querySelectorAll(".menu-items a[data-route]").forEach((item) => {
      item.classList.remove("selected");
    });

    // Find and activate the current route's menu item
    const currentPath = location.pathname.toLowerCase(); // Convert to lowercase for case-insensitive comparison
    const menuItems = document.querySelectorAll(".menu-items a[data-route]");

    menuItems.forEach((item) => {
      const href = item.getAttribute("data-route");
      if (href && currentPath === href.toLowerCase()) {
        item.classList.add("selected");
        // If the item is in a dropdown, make sure the dropdown is expanded
        const dropdown = item.closest(".dropdown");
        if (dropdown) {
          dropdown.classList.add("active");
        }
      }
    });
  }, [location.pathname]);

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
    if (path) navigate(path);
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
          <span
            className="brand-name"
            onClick={(e) => handleMenuItemClick(e, "/")}
          >
            Smart UI Studio
          </span>
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
              <a
                href="#"
                onClick={(e) => handleMenuItemClick(e, ROUTES.BUTTONS)}
                data-route={ROUTES.BUTTONS}
              >
                <span className="icon fa fa-square"></span>
                <span className="item-name">Buttons</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => handleMenuItemClick(e, ROUTES.CARDS)}
                data-route={ROUTES.CARDS}
              >
                <span className="icon fa fa-clone"></span>
                <span className="item-name">Cards</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => handleMenuItemClick(e, ROUTES.FORMS)}
                data-route={ROUTES.FORMS}
              >
                <span className="icon fa fa-edit"></span>
                <span className="item-name">Forms & Inputs</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => handleMenuItemClick(e, ROUTES.MODALS)}
                data-route={ROUTES.MODALS}
              >
                <span className="icon fa fa-window-maximize"></span>
                <span className="item-name">Modals & Dialogs</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => handleMenuItemClick(e, ROUTES.TABLES)}
                data-route={ROUTES.TABLES}
              >
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
              <a
                href="#"
                onClick={(e) => handleMenuItemClick(e, ROUTES.COLORS)}
                data-route={ROUTES.COLORS}
              >
                <span className="icon fa fa-palette"></span>
                <span className="item-name">Colors & Themes</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => handleMenuItemClick(e, ROUTES.BORDERS)}
                data-route={ROUTES.BORDERS}
              >
                <span className="icon fa fa-border-style"></span>
                <span className="item-name">Borders & Shadows</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => handleMenuItemClick(e, ROUTES.TYPOGRAPHY)}
                data-route={ROUTES.TYPOGRAPHY}
              >
                <span className="icon fa fa-font"></span>
                <span className="item-name">Typography</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => handleMenuItemClick(e, ROUTES.ICONS)}
                data-route={ROUTES.ICONS}
              >
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
              <a
                href="#"
                onClick={(e) => handleMenuItemClick(e, ROUTES.GRID)}
                data-route={ROUTES.GRID}
              >
                <span className="icon fa fa-th"></span>
                <span className="item-name">Grid System</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => handleMenuItemClick(e, ROUTES.FLEXBOX)}
                data-route={ROUTES.FLEXBOX}
              >
                <span className="icon fa fa-arrows-alt"></span>
                <span className="item-name">Flexbox Helpers</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => handleMenuItemClick(e, ROUTES.SPACING)}
                data-route={ROUTES.SPACING}
              >
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
              <a
                href="#"
                onClick={(e) => handleMenuItemClick(e, ROUTES.LOGIN)}
                data-route={ROUTES.LOGIN}
              >
                <span className="icon fa fa-sign-in-alt"></span>
                <span className="item-name">Login Forms</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => handleMenuItemClick(e, ROUTES.DASHBOARDS)}
                data-route={ROUTES.DASHBOARDS}
              >
                <span className="icon fa fa-tachometer-alt"></span>
                <span className="item-name">Dashboards</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => handleMenuItemClick(e, ROUTES.LANDING)}
                data-route={ROUTES.LANDING}
              >
                <span className="icon fa fa-rocket"></span>
                <span className="item-name">Landing Pages</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => handleMenuItemClick(e, ROUTES.ECOMMERCE)}
                data-route={ROUTES.ECOMMERCE}
              >
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
