import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom"; // Import useNavigate and Link
import { applyTheme, lightTheme, darkTheme } from "../../config/theme"; // Import themes
import CartService from "../../services/CartService"; // Import CartService
import { setCart } from "../../redux/slices/cartSlice";
import { logout } from '../../redux/slices/authSlice'; // Import logout action
import { fetchCategories } from "../../services/categoriesService"; // Import categoriesService
import "./Navbar.css"; // Import the CSS file

function Navbar() {
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Load theme from localStorage or default to true
    const savedTheme = localStorage.getItem("isDarkMode");
    return savedTheme ? JSON.parse(savedTheme) : true;
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const { items, totalQuantity } = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dropdownRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [showDevelopDropdown, setShowDevelopDropdown] = useState(false);
  const categoriesDropdownRef = useRef(null);
  const developDropdownRef = useRef(null);

  useEffect(() => {
    // Apply the theme on component mount
    applyTheme(isDarkMode ? darkTheme : lightTheme);
  }, [isDarkMode]);
  
  // Click outside handler for dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (developDropdownRef.current && !developDropdownRef.current.contains(event.target)) {
        setShowDevelopDropdown(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Fetch categories
  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    
    getCategories();
  }, []);

  useEffect(() => {
    // Fetch cart items from the API and update Redux store
    const fetchCartItems = async () => {
      try {
        const cartItems = await CartService.getCartItems();
        dispatch(setCart(cartItems)); // Update Redux store with fetched cart items
      } catch (error) {
        console.error("Failed to fetch cart items:", error);
      }
    };

    fetchCartItems();
  }, [dispatch]);

  useEffect(() => {
    console.log('Dropdown visibility:', showDropdown);
  }, [showDropdown]);
  
  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleThemeToggle = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    applyTheme(newTheme ? darkTheme : lightTheme);
    localStorage.setItem("isDarkMode", JSON.stringify(newTheme)); // Save theme to localStorage
  };

  const handleCartHover = () => {
    setIsCartOpen(true);
  };

  const handleCartLeave = () => {
    setIsCartOpen(false);
  };
  
  const handleLogout = () => {
    // Clear out auth state
    dispatch(logout());
    navigate('/LoginSignup/login');
  };

  // handleDevelopToggle handles opening/closing the Develop dropdown
  const handleDevelopToggle = (e) => {
    e.preventDefault();
    setShowDevelopDropdown(!showDevelopDropdown);
  };

  return (
    <header>
      <div className="header-wrapper">
        <nav className="navbar">
          {/* Logo Section */}
          <Link to="/" className="navbar-logo">
            Easy UI
          </Link>

          {/* Navigation Menu */}
          <div className="hidden md:flex navbar-menu">
            <div className="dropdown" ref={categoriesDropdownRef}>
              <button 
                className="dropdown-button navbar-menu-item"
                onClick={() => setShowCategoriesDropdown(!showCategoriesDropdown)}
              >
                Categories
                <i className="fa fa-chevron-down" style={{ fontSize: '12px', marginLeft: '4px' }}></i>
              </button>
              
              {/* Categories Dropdown */}
              {showCategoriesDropdown && categories.length > 0 && (
                <div className="categories-dropdown">
                  {categories.map((category, index) => (
                    <Link 
                      key={category.id || index} 
                      to={`/category/${category.id}`} 
                      className="category-item"
                      onClick={() => setShowCategoriesDropdown(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="dropdown">
              <button className="dropdown-button navbar-menu-item">
                Hire a Designer
                <i className="fa fa-chevron-down" style={{ fontSize: '12px', marginLeft: '4px' }}></i>
              </button>
            </div>

            {/* <Link to="/" className="navbar-menu-item">
              Find Jobs
            </Link> */}

            {/* Develop Dropdown */}
            <div className="nav-dropdown" ref={developDropdownRef}>
              <button 
                className="nav-dropdown-button" 
                onClick={handleDevelopToggle}
              >
                <i className="fa-brands fa-connectdevelop fa-spin fa-spin-reverse"></i>
                Develop
                <i className="fa fa-chevron-down ml-2"></i>
              </button>
              
              {showDevelopDropdown && (
                <div className="nav-dropdown-menu">
                  <div 
                    className="nav-dropdown-item" 
                    onClick={() => {
                      navigate("/AddUi");
                      setShowDevelopDropdown(false);
                    }}
                  >
                    <i className="fa fa-code mr-2"></i>
                    Add UI
                  </div>
                  <div 
                    className="nav-dropdown-item"
                    onClick={() => setShowDevelopDropdown(false)}
                  >
                    <i className="fa fa-terminal mr-2"></i>
                    CLI Tools
                  </div>
                  <div 
                    className="nav-dropdown-item"
                    onClick={() => setShowDevelopDropdown(false)}
                  >
                    <i className="fa fa-database mr-2"></i>
                    Database Tools
                  </div>
                </div>
              )}
            </div>

            <Link to="/blog" className="navbar-menu-item">
              Blog
            </Link>
          </div>

          {/* Auth & Account Section */}
          <div className="flex items-center gap-4">
            {/* Theme toggle */}
            <div onClick={handleThemeToggle} style={{ cursor: 'pointer' }} className="hidden md:block">
              <i
                className={`fa ${isDarkMode ? "fa-sun" : "fa-moon"} theme-toggle`}
                title={`${isDarkMode ? "Sáng" : "Tối"}`}
              ></i>
            </div>
            
            {/* Cart Icon */}
            <div className="cart-container" onClick={() => navigate("/Cart")} onMouseEnter={handleCartHover} onMouseLeave={handleCartLeave}>
           
                <span className="fa fa-shopping-cart cart-icon"></span>
                <span className="cart-count-test">{totalQuantity}</span>
                <div className="cart-dropdown" style={{ display: isCartOpen ? "block" : "none" }}>
                  {items.map((item) => (
                    <div key={item.uiComponentId} className="cart-item">
                      <span className="cart-item-name">{item.uiComponentName || "null"}</span>
                      <span className="cart-item-quantity">Qty: {item.quantity || "0"}</span>
                      <span className="cart-item-price">{item.price || "0"}$</span>
                    </div>
                  ))}
                  <div className="cart-summary">
    <div className="cart-summary-row">
      <span>Subtotal:</span>
      <span>${items.reduce((total, item) => total + (item.price * item.quantity || 0), 0).toFixed(2)}</span>
    </div>
    <button className="checkout-button">
      Checkout
    </button>
  </div>
                </div>
          
            </div>

            {!isAuthenticated ? (
              <>
                {/* Login button */}
                <Link to="/LoginSignup/login" style={{ backgroundColor: isDarkMode ? '#6c4f94' : '#333', color: '#fff' }} className="px-4 py-2 rounded-full text-sm font-medium">
                  Log in
                </Link>
              </>
            ) : (
              /* User profile section - shows when logged in */
              <div className="user-profile-container" ref={dropdownRef}>
                <div 
                  className="user-profile-trigger"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <div className="user-avatar-icon">
                    <i className="fas fa-user"></i>
                  </div>
                  <span className="user-name">{user?.name || 'User'}</span>
                </div>
                
                <div className={`user-dropdown ${showDropdown ? 'show' : ''}`}>
                  <div className="dropdown-item" onClick={() => navigate('/profile')}>
                    <i className="fas fa-user"></i>
                    <span>Thông tin cá nhân</span>
                  </div>
                  <div className="dropdown-item" onClick={() => navigate('/purchased-products')}>
                    <i className="fas fa-shopping-bag"></i>
                    <span>Sản phẩm đã mua</span>
                  </div>
                  <div className="dropdown-item" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Đăng xuất</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Mobile menu button - Only visible on small screens */}
            <i 
              className="fa fa-bars menu-icon md:hidden d-none" 
              onClick={handleMenuToggle}
              style={{ fontSize: '24px', display: 'none' }}
            ></i>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden fixed top-16 left-0 w-full bg-white border-b border-gray-200 p-4 shadow-lg z-50">
          <div className="flex flex-col gap-4">
            <Link to="/" className="navbar-menu-item">
              Category
            </Link>
            <Link to="/" className="navbar-menu-item">
              Hire a Designer
            </Link>
            {/* <Link to="/" className="navbar-menu-item">
              Find Jobs
            </Link> */}
            <Link to="/" className="navbar-menu-item">
              Blog
            </Link>
            <div className="flex justify-between items-center">
              <span>Theme</span>
              <i
                className={`fa ${isDarkMode ? "fa-sun" : "fa-moon"} theme-toggle`}
                onClick={handleThemeToggle}
              ></i>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
