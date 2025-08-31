import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../../../redux/slices/authSlice";
import { register, login, googleLogin } from "../../../services/userService";
import Spinner from "../../utils/Spinner";
import Alert, { showAlert, showSuccessAlert, showErrorAlert } from "../../utils/Alert";
import "../../../assets/styles/LoginSignup.css";
import { jwtDecode } from "jwt-decode";

function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const registerBtnRef = useRef(null);
  const loginBtnRef = useRef(null);
  const [formData, setFormData] = useState({
    email: "test1@gmail.com",
    password: "Bmzzxv62002@",
    fullName: "",
    userName: "",
    phoneNumber: "",
    avatar: ""
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordTyped, setIsPasswordTyped] = useState(true);
  const [currentAction, setCurrentAction] = useState('login');
  const googleScriptLoadedRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    if (currentAction === "signup") {
      container.classList.add("active");
    } else if (currentAction === "login") {
      container.classList.remove("active");
    }
  }, [isOpen, currentAction]);

  useEffect(() => {
    if (!isOpen) return;
    
    const container = containerRef.current;
    const registerBtn = registerBtnRef.current;
    const loginBtn = loginBtnRef.current;
    
    if (!container || !registerBtn || !loginBtn) return;

    const handleRegisterClick = () => {
      container.classList.add("active");
      setCurrentAction("signup");
    };

    const handleLoginClick = () => {
      container.classList.remove("active");
      setCurrentAction("login");
    };

    registerBtn.addEventListener("click", handleRegisterClick);
    loginBtn.addEventListener("click", handleLoginClick);

    return () => {
      registerBtn.removeEventListener("click", handleRegisterClick);
      loginBtn.removeEventListener("click", handleLoginClick);
    };
  }, [isOpen]);

  // Load Google script
  useEffect(() => {
    if (!isOpen) return;
    
    if (googleScriptLoadedRef.current) return;
    googleScriptLoadedRef.current = true;
    
    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      handleGoogleLogin();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.id = 'google-login-script';
    script.async = true;
    script.defer = true;
  
    script.onload = () => {
      handleGoogleLogin();
    };
  
    script.onerror = () => {
      console.error('Failed to load Google API script');
      showErrorAlert('Failed to load Google login script');
    };
  
    document.body.appendChild(script);
  }, [isOpen]);

  // Google login handler
  const handleGoogleLogin = () => {
    if (!window.google || !window.google.accounts) {
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: async (response) => {
          try {
            if (!response.credential) {
              throw new Error('No credentials received from Google');
            }
  
            const googleToken = response.credential;
            setIsLoading(true);
            
            try {
              const { token, refreshToken, user } = await googleLogin(googleToken);
              
              dispatch(loginAction({ token, refreshToken, user }));
              
              showSuccessAlert('Google login successful!');
              
              if (onLoginSuccess) {
                onLoginSuccess();
              }
              
              onClose();
            } catch (error) {
              console.error('Backend authentication error:', error);
              showErrorAlert(error.message || 'Google authentication failed on server');
            } finally {
              setIsLoading(false);
            }
          } catch (error) {
            console.error('Google login error:', error);
            showErrorAlert('Failed to process Google login');
            setIsLoading(false);
          }
        },
        auto_select: false,
        ux_mode: 'popup'
      });

      // Prompt Google login
      window.google.accounts.id.prompt();
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      showErrorAlert('Failed to initialize Google login');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, password: value }));
    setIsPasswordTyped(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  // Form validation
  const validate = () => {
    if (!formData.email || !formData.email.includes('@')) {
      showErrorAlert("Please enter a valid email address");
      return false;
    }

    if (!formData.password || formData.password.length < 6) {
      showErrorAlert("Password must be at least 6 characters");
      return false;
    }

    if (currentAction === "signup" && !formData.fullName) {
      showErrorAlert("Please enter your full name");
      return false;
    }

    return true;
  };

  // Register user function
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

  // Login user function
  const loginUser = async (userData) => {
    const response = await login({
      email: userData.email,
      password: userData.password,
    });
    
    dispatch(loginAction({ 
      token: response.token, 
      refreshToken: response.refreshToken
    }));
    
    if (rememberMe) {
      localStorage.setItem("savedEmail", userData.email);
      localStorage.setItem("savedPassword", userData.password);
    } else {
      localStorage.removeItem("savedEmail");
      localStorage.removeItem("savedPassword");
    }
    
    return response;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    try {
      if (currentAction === "signup") {
        await registerUser(formData);
        showSuccessAlert("Registration successful!");
        setCurrentAction("login");
        containerRef.current?.classList.remove("active");
      } else {
        const result = await loginUser(formData);
        showSuccessAlert("Login successful!");
        
        if (onLoginSuccess) {
          onLoginSuccess();
        }
        
        onClose();
      }
    } catch (error) {
      console.error("Authentication error:", error);
      showErrorAlert(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Alert />
      <div className="login-modal-overlay" onClick={onClose}>
        <div className="login-modal-container" onClick={(e) => e.stopPropagation()}>
          <div className="login-modal-content">
            <button className="login-modal-close" onClick={onClose}>×</button>
            
            <div className="container" ref={containerRef}>
              <div className="form-container sign-up-container">
                <form onSubmit={handleSubmit}>
                  <h1>Tạo tài khoản</h1>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Họ và tên"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="userName"
                    placeholder="Tên đăng nhập"
                    value={formData.userName}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Số điện thoại"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Mật khẩu"
                    value={formData.password}
                    onChange={handlePasswordChange}
                    required
                  />
                  <button type="submit" disabled={isLoading}>
                    {isLoading ? <Spinner /> : "Đăng ký"}
                  </button>
                </form>
              </div>
              <div className="form-container sign-in-container">
                <form onSubmit={handleSubmit}>
                  <h1>Đăng nhập</h1>
                    <div className="social-container">
                     <a href="#" className="google" onClick={(e) => { e.preventDefault(); handleGoogleLogin(); }}>
                       <i className="fab fa-google-plus-g"></i>
                     </a>
                   </div>
                  <span>hoặc sử dụng tài khoản của bạn</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="password-container">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Mật khẩu"
                      value={formData.password}
                      onChange={handlePasswordChange}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                  <a href="#">Quên mật khẩu?</a>
                  <button type="submit" disabled={isLoading}>
                    {isLoading ? <Spinner /> : "Đăng nhập"}
                  </button>
                </form>
              </div>
              <div className="overlay-container">
                <div className="overlay">
                  <div className="overlay-panel overlay-left">
                    <h1>Chào mừng trở lại!</h1>
                    <p>Để giữ kết nối với chúng tôi, vui lòng đăng nhập bằng thông tin cá nhân của bạn</p>
                    <button className="ghost" ref={loginBtnRef}>
                      Đăng nhập
                    </button>
                  </div>
                  <div className="overlay-panel overlay-right">
                    <h1>Xin chào!</h1>
                    <p>Nhập thông tin cá nhân của bạn và bắt đầu hành trình với chúng tôi</p>
                    <button className="ghost" ref={registerBtnRef}>
                      Đăng ký
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginModal;
