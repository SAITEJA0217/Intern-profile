import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar"; // ✅ Make sure the path is correct

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RegisterIntern from "./pages/RegisterIntern";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Login />} />               {/* Login page at root */}
        <Route path="/dashboard" element={<Dashboard />} />  {/* Dashboard page */}
        <Route path="/register" element={<RegisterIntern />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ paddingTop: "80px" }}>
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;
