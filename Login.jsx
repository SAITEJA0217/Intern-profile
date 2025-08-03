import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // import the CSS

const Login = () => {
  const [internName, setInternName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (internName.trim() !== "") {
      navigate("/dashboard", { state: { internName } });
    } else {
      alert("Please enter your name");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Intern Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your name"
            value={internName}
            onChange={(e) => setInternName(e.target.value)}
            className="login-input"
          />
          <button type="submit" className="login-button">
            Go to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
