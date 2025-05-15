import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useSearchParams, useLocation } from "react-router-dom"; // Add useLocation 
import { useDispatch, useSelector } from "react-redux"; // Add useSelector
import { login as loginAction } from "../../../redux/slices/authSlice"; // Import login action
import { register, login, googleLogin } from "../../../services/userService"; // Import googleLogin service
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation(); // Get location to access state passed by navigation
  const containerRef = useRef(null);
  const registerBtnRef = useRef(null);
  const loginBtnRef = useRef(null);
  const [formData, setFormData] = useState({
    email: "test1@gmail.com", // Email mặc định cho HR
    password: "Bmzzxv62002@", // Password mặc định cho HR
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
  const auth = useSelector(state => state.auth);
  const hasRedirectedRef = useRef(false); // Track if redirect has happened
  const googleScriptLoadedRef = useRef(false); // Track if Google script is loaded

  // Một lần duy nhất khi component mount, kiểm tra token
  useEffect(() => {
    // Chỉ chạy code này một lần khi component được mount
    if (hasRedirectedRef.current) return;

    const token = localStorage.getItem('authToken');
    
    // Nếu người dùng đã đăng nhập và đang ở trang login, chuyển hướng một lần
    if (token) {
      hasRedirectedRef.current = true; // Đánh dấu đã chuyển hướng
      const returnTo = searchParams.get("returnTo") || "/";
      window.location.replace(returnTo); // Sử dụng replace để ngăn back button
      return;
    }
  }, []); // Dependecy array rỗng để chỉ chạy một lần

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const currentAction = action || 'login'; // Default to login if no action specified
    
    if (currentAction === "signup") {
      container.classList.add("active");
    } else if (currentAction === "login") {
      container.classList.remove("active");
    }
  }, [action]);

  useEffect(() => {
    if (hasRedirectedRef.current) return; // Không thiết lập event nếu đang chuyển hướng
    
    const container = containerRef.current;
    const registerBtn = registerBtnRef.current;
    const loginBtn = loginBtnRef.current;
    
    if (!container || !registerBtn || !loginBtn) return;

    // Tạo các hàm xử lý sự kiện một lần duy nhất
    const handleRegisterClick = () => {
      container.classList.add("active");
      // Thay vì navigate, thay đổi URL trực tiếp
      window.history.pushState({}, "", '/LoginSignup/signup');
    };

    const handleLoginClick = () => {
      container.classList.remove("active");
      // Thay vì navigate, thay đổi URL trực tiếp
      window.history.pushState({}, "", '/LoginSignup/login');
    };

    registerBtn.addEventListener("click", handleRegisterClick);
    loginBtn.addEventListener("click", handleLoginClick);

    return () => {
      registerBtn.removeEventListener("click", handleRegisterClick);
      loginBtn.removeEventListener("click", handleLoginClick);
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

    const currentAction = action || 'login';
    if (currentAction === "signup" && !formData.fullName) {
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
    dispatch(loginAction({ 
      token: response.token, 
      refreshToken: response.refreshToken
    }));
    
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

  // Tải Google script một lần duy nhất
  useEffect(() => {
    // Nếu đã tải script, không tải lại
    if (googleScriptLoadedRef.current) return;
    googleScriptLoadedRef.current = true;
    
    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      // Script đã tồn tại, không tải lại
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
    
    return () => {
      // Không xóa script khi component unmount để tránh tải lại liên tục
    };
  }, []);
  
  // Google login handler
  const handleGoogleLogin = () => {
    if (!window.google || !window.google.accounts) {
      return; // Google API chưa sẵn sàng
    }

    try {
      const googleButtons = document.querySelectorAll('.google');
      if (googleButtons.length === 0) return;
      
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
              // Call our backend API with the Google token
              const { token, refreshToken, user } = await googleLogin(googleToken);
              
              // Store received JWT token in Redux
              dispatch(loginAction({ token, refreshToken, user }));
              
              // Đánh dấu đã chuyển hướng để tránh các useEffect khác chạy
              hasRedirectedRef.current = true;
              
              showSuccessAlert('Google login successful!');
              
              // Xác định đường dẫn sau đăng nhập
              let redirectPath = "/";
              const returnToParam = searchParams.get("returnTo");
              if (returnToParam) {
                redirectPath = returnToParam;
              } else if (location.state?.from?.pathname) {
                redirectPath = location.state.from.pathname;
              }
              
              // Chuyển hướng bằng window.location thay vì navigate
              window.location.replace(redirectPath);
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

      // Render button
      googleButtons.forEach(buttonDiv => {
        // Clear previous content
        buttonDiv.innerHTML = '';
        window.google.accounts.id.renderButton(buttonDiv, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          width: '250',
        });
      });

      // Chỉ gọi prompt một lần
      if (!hasRedirectedRef.current) {
        window.google.accounts.id.prompt();
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      showErrorAlert('Failed to initialize Google login');
    }
  };
  
  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    try {
      // Xác định đây là form đăng ký hay đăng nhập
      const currentAction = action || 'login';
      const isRegisterForm = currentAction === 'signup' || 
                             containerRef.current?.classList.contains("active");
      
      if (isRegisterForm) {
        // Xử lý đăng ký
        await registerUser(formData);
        showSuccessAlert("Registration successful!");
        
        // Chuyển hướng đến trang login
        window.location.replace("/LoginSignup/login");
      } else {
        // Xử lý đăng nhập
        const result = await loginUser(formData);
        
        // Đánh dấu đã chuyển hướng
        hasRedirectedRef.current = true;
        
        showSuccessAlert("Login successful!");
        
        // Xác định đường dẫn chuyển hướng sau đăng nhập
        let redirectPath = "/";
        const returnToParam = searchParams.get("returnTo");
        if (returnToParam) {
          redirectPath = returnToParam;
        } else if (location.state?.from?.pathname) {
          redirectPath = location.state.from.pathname;
        }
        
        // Sử dụng window.location thay vì navigate
        window.location.replace(redirectPath);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      showErrorAlert(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Google authentication handler
  const handleGoogleAuth = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      handleGoogleLogin();
    } catch (error) {
      console.error("Google authentication error:", error);
      showErrorAlert(error.message || "Google authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Remember me checkbox handler
  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  // Ngăn render nếu đang chuyển hướng
  if (hasRedirectedRef.current) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Redirecting...</p>
      </div>
    );
  }

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
              <p>or register with social platforms</p>
                
              <div className="social-icons">
                <a href="#" className="google" id="googleButton" onClick={handleGoogleAuth}>
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
