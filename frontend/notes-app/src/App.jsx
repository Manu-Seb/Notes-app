import React from "react";
import Login from "./pages/Login/Login.jsx";
import Signup from "./pages/Signup/Signup.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" exact element={<Home />} />
        <Route path="/login" exact element={<Login />} />
        <Route path="/signup" exact element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
