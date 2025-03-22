import React from "react";
import userAvatar from "../../assets/images/avata3d.jpg"; // Import the image

function Navbar() {
  return (
    <>
      <style>
        {`
          .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center; /* Center vertically */
            padding: 5px 10px; /* Reduce padding to make the navbar smaller */
            margin: 0;
            height: 80%; /* Reduce height */
            flex-wrap: wrap; /* Allow wrapping for responsive design */
          }
          .search-container {
              position: relative;
              width: 100%; /* Đặt chiều rộng là 100% để phần tử co dãn */
              max-width: 350px; /* Đặt chiều rộng tối đa */
              margin: 0px 30px;
              flex: 1;
              font-size: 14px;
          }

          .search-input {
            width: 95%;
            padding: 5px 15px; /* Adjust padding */
            border: 1px solid #ccc;
            border-radius: 5px;
            height: 25px; /* Reduce height */
            transition: width 0.3s;
             
          }

          .search-input:focus {
            border: 2px solid #6c4f94; /* Màu tím nhạt */

          }

          .search-button {
            position: absolute;
            right: 0; /* Move button closer to the right */
            top: 50%;
            transform: translateY(-50%);
            background: #201629;
            border: none;
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s;
            height: 75%; /* Reduce height */
          }

          .search-input:focus + .search-button {
            opacity: 1; /* Show button when input is focused */
          }

          .navbar-menu-items {
            display: flex;
            gap: 10px; /* Reduce gap between menu items */
            list-style: none;
            padding: 0;
            margin: 0;
            height: 100%; /* Make menu items take full height */
            align-items: center; /* Center vertically */
            flex: 1; /* Allow menu items to grow */
            justify-content: center; /* Center menu items */
            min-width: 200px; /* Minimum width for menu items */
          }

          .navbar-menu-items li {
            position: relative;
            width: 40px; /* Initial width */
            overflow: hidden;
            transition: width 0.3s; /* Smooth transition for width */
          }

          .navbar-menu-items li:hover {
            width: auto; /* Expand width to fit text on hover */
          }

          .navbar-menu-items li a {
            display: flex;
            align-items: center;
            gap: 10px; /* Reduce gap between icon and text */
            padding: 5px; /* Reduce padding inside menu items */
            color: var(--text-color);
            text-decoration: none;
          }

          .navbar-menu-items li a:hover {
            color: var(--text-color);
            background: rgba(101, 101, 237, 0.09);
            border-radius: 10px;
          }

          .navbar-menu-items li i {
            font-size: 1.2em; /* Reduce icon size */
            transition: 300ms;
            transition-delay: 150ms;
          }

          .navbar-menu-items li:hover i {
            transform: scale(0);
            transition-delay: 0s;
            width: 0; /* Remove width to allow text to display better */
          }

          .navbar-menu-items li .text {
            color: var(--text-color);
            font-size: 1em; /* Reduce text size */
            z-index: 1;
            letter-spacing: 0.024em;
            opacity: 0;
            padding-left: 0; /* Adjust padding */
            transition: opacity 0.3s, padding-left 0.3s;
            letter-spacing: -0.125px;
          }

          .navbar-menu-items li:hover .text {
            opacity: 1; /* Show text on hover */
            padding: 7px; /* Add padding when hovered */
          }

          .user-info {
            display: flex;
            align-items: center;
            gap: 10px; /* Reduce gap between user avatar and name */
            flex: 1; /* Allow user info to grow */
            justify-content: flex-end; /* Align user info to the right */
            min-width: 200px; /* Minimum width for user info */
            cursor: pointer;
           
          }

          .user-avatar:hover {
            background-color: rgba(101, 101, 237, 0.09); /* Add background color on hover */
            border-radius: 10px; /* Add border radius on hover */
            transform: scale(1.05); /* Slightly scale up on hover */
          }

          .user-avatar {
            width: 30px; /* Reduce avatar size */
            height: 30px; /* Reduce avatar size */
            border-radius: 50%;
             transition: background-color 0.3s, transform 0.3s; /* Add transition for hover effect */
          }

          .user-name {
            color: var(--text-color);
            font-size: 16px; /* Tăng kích thước font để dễ nhìn */
            font-weight: 500; /* Thêm đậm cho các mục */
          }

          @media screen and (max-width: 768px) {
            .search-container, .navbar-menu-items, .user-info {
              flex: 100%; /* Make each section take full width */
              justify-content: center; /* Center align each section */
              margin-bottom: 10px; /* Add margin between sections */
            }

            .navbar-menu-items {
              justify-content: space-around; /* Distribute menu items evenly */
            }
          }
        `}
      </style>
      <nav className="navbar">
        <div className="search-container">
          <input type="text" className="search-input" placeholder="Search..." />
          <button className="search-button">Search</button>
        </div>
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
