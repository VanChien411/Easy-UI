import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { register, login } from "../../../services/userService"; // Ensure this path is correct
import Spinner from "../../utils/Spinner"; // Import the Spinner component
import Alert, { showAlert } from "../../utils/Alert";
import "../../../assets/styles/LoginSignup.css";

function LoginSignup() {
  const { action } = useParams();
  const navigate = useNavigate(); // Initialize navigate
  const containerRef = useRef(null);
  const registerBtnRef = useRef(null);
  const loginBtnRef = useRef(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordTyped, setIsPasswordTyped] = useState(true);

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

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
      });
      showAlert({
        title: "Success",
        message: "Registration successful!",
        type: "success",
      });
      navigate("/"); // Redirect to homepage
    } catch (error) {
      showAlert({
        title: "Error",
        message: error.message,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({
        email: formData.email,
        password: formData.password,
      });
      if (rememberMe) {
        localStorage.setItem("savedEmail", formData.email);
        localStorage.setItem("savedPassword", formData.password);
      } else {
        localStorage.removeItem("savedEmail");
        localStorage.removeItem("savedPassword");
      }
      navigate("/"); // Redirect to homepage
      // showAlert({
      //   title: "Success",
      //   message: "Login successful!",
      //   type: "success",
      // });
    } catch (error) {
      showAlert({
        title: "Error",
        message: error.message,
        type: "error",
      });
    } finally {
      setIsLoading(false);
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
            <form onSubmit={handleLogin}>
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
                <a href="#" className="google">
                  <i class="fa-brands fa-google"></i>
                </a>
                <a href="#" className="facebook">
                  <i className="fa-brands fa-facebook"></i>
                </a>
                <a href="#" className="github">
                  <i className="fa-brands fa-github"></i>
                </a>
                <a href="#" className="linkedin">
                  <i class="fa-brands fa-linkedin-in"></i>
                </a>
              </div>
            </form>
          </div>

          <div className="form-box register">
            <form onSubmit={handleRegister}>
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
                <a href="#" className="google">
                  <i class="fa-brands fa-google"></i>
                </a>
                <a href="#" className="facebook">
                  <i className="fa-brands fa-facebook"></i>
                </a>
                <a href="#" className="github">
                  <i className="fa-brands fa-github"></i>
                </a>
                <a href="#" className="linkedin">
                  <i class="fa-brands fa-linkedin-in"></i>
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
