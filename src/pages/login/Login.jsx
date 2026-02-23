import React from "react";
import "./Login.scss";

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Iniciar sessió</h1>

        <form className="login-form">
          <div className="input-group">
            <input type="text" placeholder="Username" className="login-input" />
          </div>

          <div className="input-group password-group">
            <input
              type="password"
              placeholder="Password"
              className="login-input"
            />
          </div>

          <a href="#forgot" className="forgot-password">
            No recordo la contrasenya
          </a>

          <button type="submit" className="login-button">
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
