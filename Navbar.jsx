// Navbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css"; // ✅ CSS imported

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <h2 className="logo">Intern Portal</h2>
      <div className="nav-links">
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>
          Dashboard
        </Link>
        <Link to="/register" className={location.pathname === "/register" ? "active" : ""}>
          Register Intern
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
