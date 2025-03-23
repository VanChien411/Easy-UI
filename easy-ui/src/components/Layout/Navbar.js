import React, { useState, useEffect } from "react";
import userAvatar from "../../assets/images/avata3d.jpg"; // Import the image
import { applyTheme, lightTheme, darkTheme } from "../../config/theme"; // Import themes

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Load theme from localStorage or default to true
    const savedTheme = localStorage.getItem("isDarkMode");
    return savedTheme ? JSON.parse(savedTheme) : true;
  });

  useEffect(() => {
    // Apply the theme on component mount
    applyTheme(isDarkMode ? darkTheme : lightTheme);
  }, [isDarkMode]);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleThemeToggle = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    applyTheme(newTheme ? darkTheme : lightTheme);
    localStorage.setItem("isDarkMode", JSON.stringify(newTheme)); // Save theme to localStorage
  };

  return (
    <>
      <style>
        {`
          .navbar {
            display: flex;
            justify-content: center;
            align-items: center; /* Center vertically */
            padding: 4px 8px; /* Reduce padding to make the navbar smaller */
            margin: 0;
            height: 64%; /* Reduce height */
            flex-wrap: wrap; /* Allow wrapping for responsive design */
            z-index: 1;
          }
          .search-container {
              position: relative;
              width: 100%; /* Đặt chiều rộng là 100% để phần tử co dãn */
              max-width: 280px; /* Đặt chiều rộng tối đa */
              margin: 0px 24px;
              flex: 1;
              font-size: 11.2px;
              display: flex; /* Ensure children are aligned horizontally */
              align-items: center; /* Center align children vertically */
          }

          .search-input {
            width: 100%;
            padding: 4px 12px; /* Adjust padding */
            border: 1px solid #ccc;
            border-radius: 4px;
            height: 20px; /* Reduce height */
            transition: width 0.3s;
          }

          .search-input:focus {
            border: 2px solid #6c4f94; /* Màu tím nhạt */
          }

         .search-button {
          position: absolute;
          right: 4px; /* Di chuyển nút gần bên phải */
          top: 50%;
          transform: translateY(-50%);
          background: #201629;
          border: none;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          display: none; /* Ẩn nút ban đầu */
          height: 70%; /* Giảm chiều cao */
          transition: display 0.3s; /* Thêm transition cho việc thay đổi display */
        }

        .search-input:focus + .search-button {
          display: block; /* Hiển thị nút khi input được focus */
        }

          .navbar-menu-items {
            display: flex;
            gap: 8px; /* Reduce gap between menu items */
            list-style: none;
            padding: 0;
            margin: 0;
            height: 80%; /* Make menu items take full height */
            align-items: center; /* Center vertically */
            flex: 0; /* Do not allow menu items to grow */
            justify-content: center; /* Center menu items */
          }

          .navbar-menu-items li {
            position: relative;
            width: 32px; /* Initial width */
            overflow: hidden;
            transition: width 0.3s; /* Smooth transition for width */
          }

          .navbar-menu-items li:hover {
            width: auto; /* Expand width to fit text on hover */
          }

          .navbar-menu-items li a {
            display: flex;
            align-items: center;
            gap: 8px; /* Reduce gap between icon and text */
            padding: 4px; /* Reduce padding inside menu items */
            color: var(--text-color-follow);
            text-decoration: none;
          }

          .navbar-menu-items li a:hover {
            color: var(--text-color-follow-hover);
            background: var(--background-color-navbar);
            border-radius: 8px;
          }

          .navbar-menu-items li i {
            font-size: 0.96em; /* Reduce icon size */
            transition: 300ms;
            transition-delay: 150ms;
          }

          .navbar-menu-items li:hover i {
            transform: scale(0);
            transition-delay: 0s;
            width: 0; /* Remove width to allow text to display better */
          }

          .navbar-menu-items li .text {
            color: var(--text-color-follow);
            font-size: 0.8em; /* Reduce text size */
            z-index: 1;
            letter-spacing: 0.0192em;
            opacity: 0;
            padding-left: 0; /* Adjust padding */
            transition: opacity 0.3s, padding-left 0.3s;
            letter-spacing: -0.1px;
          }

          .navbar-menu-items li:hover .text {
            opacity: 1; /* Show text on hover */
            padding: 5.6px 12px 5.6px 5.6px; /* Add padding when hovered */
          }

          .user-info {
            display: flex;
            align-items: center;
            gap: 8px; /* Reduce gap between user avatar and name */
            flex: 1; /* Allow user info to grow */
            justify-content: flex-end; /* Align user info to the right */
            min-width: 160px; /* Minimum width for user info */
            cursor: pointer;
            z-index: 2; /* Ensure user-info is above other content */
            margin-right: 10px; /* Add margin to separate from menu items */
          }

          .user-avatar:hover {
            background-color: rgba(101, 101, 237, 0.09); /* Add background color on hover */
            border-radius: 8px; /* Add border radius on hover */
            transform: scale(1.05); /* Slightly scale up on hover */
          }

          .user-avatar {
            width: 27px; /* Reduce avatar size */
            height: 27px; /* Reduce avatar size */
            border-radius: 50%;
            transition: background-color 0.3s, transform 0.3s; /* Add transition for hover effect */
          }

          .user-name {
            color: var(--text-color);
            font-size: 12.8px; /* Tăng kích thước font để dễ nhìn */
            font-weight: 500; /* Thêm đậm cho các mục */
          }

          .menu-icon {
            display: none; /* Hide menu icon by default */
            font-size: 1.2em;
            cursor: pointer;
            margin-left: 8px; /* Add margin to separate from search input */
          }
          .theme-toggle-container {
            width: 20px; /* Initial width */
            height: 100%; /* Initial height */
          }
          .theme-toggle {
              font-size: 1.2em;
              cursor: pointer;
              transition: 300ms;
              width: 100%; /* Initial width */

              }

          .theme-toggle:hover {
              // background: var(--text-color); /* Màu nền từ biến --text-color */
              box-shadow: 0 0 15px 2px var(--text-color); /* Bóng từ trong ra ngoài */
      
              border-radius: 50%; /* Bo tròn góc */
              transition: box-shadow 0.3s ease, background 0.3s ease; /* Thêm hiệu ứng chuyển đổi */
              }
          .fa-sun.theme-toggle {
              color: #ffcc00; /* Bright yellow for sun icon */
          }

          .fa-moon.theme-toggle {
              color: #4a4a4a; /* Dark gray for moon icon */
          }
         
          @media screen and (max-width: 868px) {
            .search-container {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: space-between; /* Ensure children are spaced evenly */
            }
           
            .navbar-menu-items , .user-info{
              flex: 100%; /* Make each section take full width */
              justify-content: center; /* Center align each section */
              padding: 8px; /* Add margin between sections */   
              top: 48px; /* Position below the navbar */
              height: auto; /* Allow height to grow */
          
              z-index: 3; /* Ensure menu items are above other content */
           
            }

            .navbar-menu-items {
              justify-content: center; /* Distribute menu items evenly */
              display: ${
                menuOpen ? "flex" : "none"
              }; /* Toggle visibility based on menuOpen state */
            }
           
            .user-info {
              display: ${
                menuOpen ? "flex" : "none"
              }; /* Toggle visibility based on menuOpen state */
            }
            article {
               filter:  ${
                 menuOpen ? "blur(2px)" : "none"
               }; /* Add blur effect to content */
            }
          
            .menu-icon {
              display: block; /* Show menu icon on small screens */
            }
            
          }
        `}
      </style>
      <nav className="navbar">
        <div className="search-container">
          <input type="text" className="search-input" placeholder="Search..." />
          <button className="search-button">Search</button>
        </div>
        <i className="fa fa-bars menu-icon" onClick={handleMenuToggle}></i>

        <ul className="navbar-menu-items">
          <li>
            <a href="https://example.com">
              <i className="fa fa-home"></i>
              <span className="text">Home</span>
            </a>
          </li>
          <li>
            <a href="https://example.com">
              <i className="fa fa-user"></i>
              <span className="text">Profile</span>
            </a>
          </li>
          <li>
            <a href="https://example.com">
              <i className="fa fa-desktop"></i>
              <span className="text">Dashboard</span>
            </a>
          </li>
          <li>
            <a href="https://example.com">
              <i className="fa fa-pencil-alt"></i>
              <span className="text">Edit</span>
            </a>
          </li>
          <li>
            <a href="https://example.com">
              <i className="fa fa-phone"></i>
              <span className="text">Contact</span>
            </a>
          </li>
          <span className="theme-toggle-container">
            <i
              className={`fa ${isDarkMode ? "fa-sun" : "fa-moon"} theme-toggle`}
              title={`${isDarkMode ? "Sáng" : "Tối"}`}
              onClick={handleThemeToggle}
            ></i>
          </span>
        </ul>
        <div className="user-info">
          <img src={userAvatar} alt="User Avatar" className="user-avatar" />
          <span className="user-name">John Doe</span>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
