import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom"; // Import useNavigate and useSearchParams
import { useDispatch } from "react-redux"; // Import useDispatch
import { login as loginAction } from "../../../redux/slices/authSlice"; // Import login action
import { register, login } from "../../../services/userService"; // Ensure this path is correct
import Spinner from "../../utils/Spinner"; // Import the Spinner component
import Alert, { showAlert, showSuccessAlert, showErrorAlert } from "../../utils/Alert";
import "../../../assets/styles/LoginSignup.css";
import { jwtDecode } from "jwt-decode"; // Changed import statement


// Add this type declaration at the top
// declare global {
//   interface Window {
//     google: any;
//   }
// }

function LoginSignup() {
  const { action } = useParams();
  const navigate = useNavigate(); // Initialize navigate
  const dispatch = useDispatch(); // Initialize dispatch for Redux actions
  const containerRef = useRef(null);
  const registerBtnRef = useRef(null);
  const loginBtnRef = useRef(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    userName: "",
    phoneNumber: "",
    avatar: ""
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordTyped, setIsPasswordTyped] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const container = containerRef.current;
    if (action === "signup") {
      container.classList.add("active");
    } else if (action === "login") {
      container.classList.remove("active");
    }
  }, [action]);

  useEffect(() => {
    const container = containerRef.current;
    const registerBtn = registerBtnRef.current;
    const loginBtn = loginBtnRef.current;

    registerBtn.addEventListener("click", () => {
      container.classList.add("active");
    });

    loginBtn.addEventListener("click", () => {
      container.classList.remove("active");
    });

    return () => {
      registerBtn.removeEventListener("click", () => {
        container.classList.add("active");
      });

      loginBtn.removeEventListener("click", () => {
        container.classList.remove("active");
      });
    };
  }, []);

  useEffect(() => {
    // Load saved credentials if "Remember Me" was previously checked
    const savedEmail = localStorage.getItem("savedEmail");
    const savedPassword = localStorage.getItem("savedPassword");
    if (savedEmail && savedPassword) {
      setFormData((prev) => ({
        ...prev,
        email: savedEmail,
        password: savedPassword,
      }));
      setRememberMe(true);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, password: value }));
    setIsPasswordTyped(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Form validation function
  const validate = () => {
    if (!formData.email || !formData.email.includes('@')) {
      showErrorAlert("Please enter a valid email address");
      return false;
    }

    if (!formData.password || formData.password.length < 6) {
      showErrorAlert("Password must be at least 6 characters");
      return false;
    }

    if (action === "signup" && !formData.fullName) {
      showErrorAlert("Please enter your full name");
      return false;
    }

    return true;
  };

  // Function to register a new user
  const registerUser = async (userData) => {
    const response = await register({
      email: userData.email || "",
      password: userData.password || "",
      fullName: userData.fullName || "",
      userName: userData.email || "",
      phoneNumber: userData.phoneNumber || "",
      avatar: userData.avatar || ""
    });
    return response;
  };

  // Function to login a user
  const loginUser = async (userData) => {
    const response = await login({
      email: userData.email,
      password: userData.password,
    });
    
    // Store token in Redux
    dispatch(loginAction({ token: response.token }));
    
    // Save credentials if remember me is checked
    if (rememberMe) {
      localStorage.setItem("savedEmail", userData.email);
      localStorage.setItem("savedPassword", userData.password);
    } else {
      localStorage.removeItem("savedEmail");
      localStorage.removeItem("savedPassword");
    }
    
    return response;
  };


  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);
  
  const handleGoogleLogin = () => {
    try {
      // Clear any existing Google Sign-In buttons
      // document.getElementById('googleButton')?.remove();
      // Create container for Google button
      const googleButtonDiv = document.getElementById('googleButton');
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: async (response) => {
            try {
              if (!response.credential) {
                throw new Error('No credentials received from Google');
              }
  
              const decoded = jwtDecode(response.credential);
              console.log('Decoded token:', decoded);
  
              // Format user data
              const userData = {
                email: decoded.email,
                fullName: decoded.name,
                avatar: decoded.picture,
                googleId: decoded.sub,
              };
  
              // Save to Redux store
              dispatch(loginAction({ 
                token: response.credential,
                user: userData 
              }));
              showSuccessAlert('Google login successful!');
              navigate('/');
            } catch (error) {
              console.error('Google login error:', error);
              showErrorAlert('Failed to process Google login');
            }
          },
          // Additional configuration
          auto_select: false,
          ux_mode: 'popup'
        });
        // Render the Google button
        window.google.accounts.id.renderButton(googleButtonDiv, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          width: '250',
        });
  
        // Optionally prompt One Tap UI
        window.google.accounts.id.prompt();
  
      } else {
        throw new Error('Google API not loaded');
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      showErrorAlert('Failed to initialize Google login');
    }
  };
  


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    try {
      // Sửa lại cách xác định action đăng ký
      // Kiểm tra xem form hiện tại là form đăng ký hay không
      const isRegisterForm = containerRef.current.classList.contains("active");
      
      if (isRegisterForm) {
        // Gọi API đăng ký
        await registerUser(formData);
        showSuccessAlert("Registration successful!");
        navigate("/LoginSignup/login");
      } else {
        // Gọi API đăng nhập
        const result = await loginUser(formData);
        showSuccessAlert("Login successful!");
        
        // Check if coming from cart checkout
        const returnPath = searchParams.get("returnTo");
        if (returnPath) {
          navigate(returnPath);
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      showErrorAlert(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await handleGoogleLogin();
      showSuccessAlert("Google authentication successful!");
      navigate("/");
    } catch (error) {
      console.error("Google authentication error:", error);
      showErrorAlert(error.message || "Google authentication failed");
    }
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  return (
    <>
      <Alert />
      <div className="login-signup">
        <div className="container" ref={containerRef}>
          <div className="form-box login">
            <form onSubmit={handleSubmit}>
              <h1>Login</h1>
              <div className="input-box">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <i className="fa fa-envelope"></i>
              </div>
              <div className="input-box">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  required
                />
                {isPasswordTyped && (
                  <i
                    className={`fa ${
                      showPassword ? "fa-eye-slash" : "fa-eye"
                    } password-toggle`}
                    onClick={togglePasswordVisibility}
                  ></i>
                )}
              </div>
              <div className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                  id="rememberMe"
                />
                <label htmlFor="rememberMe">Remember Me</label>
              </div>
              <div className="forgot-link">
                <a href="#">Forgot Password?</a>
              </div>
              <button type="submit" className="btn" disabled={isLoading}>
                {isLoading ? <Spinner size={16} /> : "Login"}
              </button>
              <p>or register with social platforms</p>
              <div className="social-icons">
                <a href="#" className="google" onClick={handleGoogleAuth}>
                  <i className="fa-brands fa-google"></i>
                </a>
                <a href="#" className="facebook">
                  <i className="fa-brands fa-facebook"></i>
                </a>
                <a href="#" className="github">
                  <i className="fa-brands fa-github"></i>
                </a>
                <a href="#" className="linkedin">
                  <i className="fa-brands fa-linkedin-in"></i>
                </a>
              </div>
            </form>
          </div>

          <div className="form-box register">
            <form onSubmit={handleSubmit}>
              <h1>Registration</h1>
              <div className="input-box">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
                <i className="fa fa-user"></i>
              </div>
              <div className="input-box">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <i className="fa fa-envelope"></i>
              </div>
              <div className="input-box">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  required
                />
                {isPasswordTyped && (
                  <i
                    className={`fa ${
                      showPassword ? "fa-eye-slash" : "fa-eye"
                    } password-toggle`}
                    onClick={togglePasswordVisibility}
                  ></i>
                )}
              </div>
              <button type="submit" className="btn" disabled={isLoading}>
                {isLoading ? <Spinner size={16} /> : "Register"}
              </button>
              <p>or1 register with social platforms</p>

              <div className="social-icons">
                <a href="#" className="google" id="googleButton" onClick={handleGoogleLogin}>
                  <i className="fa-brands fa-google"></i>
                </a>
                <a href="#" className="facebook">
                  <i className="fa-brands fa-facebook"></i>
                </a>
                <a href="#" className="github">
                  <i className="fa-brands fa-github"></i>
                </a>
                <a href="#" className="linkedin">
                  <i className="fa-brands fa-linkedin-in"></i>
                </a>
              </div>
            </form>
          </div>

          <div className="toggle-box">
            <div className="toggle-panel toggle-left">
              <h1>Hello, Welcome!</h1>
              <p>Don't have an account?</p>
              <button className="btn register-btn" ref={registerBtnRef}>
                Register
              </button>
            </div>

            <div className="toggle-panel toggle-right">
              <h1>Welcome Back!</h1>
              <p>Already have an account?</p>
              <button className="btn login-btn" ref={loginBtnRef}>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginSignup;
