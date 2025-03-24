import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
// import "../../../assets/styles/LoginSignup.css";
import "font-awesome/css/font-awesome.min.css"; // Ensure this line is uncommented

function LoginSignup() {
  const { action } = useParams();
  const containerRef = useRef(null);
  const registerBtnRef = useRef(null);
  const loginBtnRef = useRef(null);

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

  return (
    <div className="login-signup">
      <div className="container" ref={containerRef}>
        <div className="form-box login">
          <form action="#">
            <h1>Login</h1>
            <div className="input-box">
              <input type="text" placeholder="Username" required />
              <i className="fa fa-user "></i>
            </div>
            <div className="input-box">
              <input type="password" placeholder="Password" required />
              <i className="fa fa-lock"></i>
            </div>
            <div className="forgot-link">
              <a href="#">Forgot Password?</a>
            </div>
            <button type="submit" className="btn">
              Login
            </button>
            <p>or login with social platforms</p>
            <div className="social-icons">
              <a href="#" className="google">
                <i className="fa fa-google"></i>
              </a>
              <a href="#" className="facebook">
                <i className="fa fa-facebook"></i>
              </a>
              <a href="#" className="github">
                <i className="fa fa-github"></i>
              </a>
              <a href="#" className="linkedin">
                <i className="fa fa-linkedin"></i>
              </a>
            </div>
          </form>
        </div>

        <div className="form-box register">
          <form action="#">
            <h1>Registration</h1>
            <div className="input-box">
              <input type="text" placeholder="Username" required />
              <i className="fa fa-user "></i>
            </div>
            <div className="input-box">
              <input type="email" placeholder="Email" required />
              <i className="fa fa-envelope"></i>
            </div>
            <div className="input-box">
              <input type="password" placeholder="Password" required />
              <i className="fa fa-lock"></i>
            </div>
            <button type="submit" className="btn">
              Register
            </button>
            <p>or register with social platforms</p>
            <div className="social-icons">
              <a href="#" className="google">
                <i className="fa fa-google"></i>
              </a>
              <a href="#" className="facebook">
                <i className="fa fa-facebook"></i>
              </a>
              <a href="#" className="github">
                <i className="fa fa-github"></i>
              </a>
              <a href="#" className="linkedin">
                <i className="fa fa-linkedin"></i>
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
  );
}

export default LoginSignup;
