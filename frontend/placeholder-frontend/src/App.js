import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Project from "./pages/Project";
import HardwarePage from "./pages/HardwarePage";
import BackgroundVideo from "./components/BackgroundVideo";

const App = () => {
  return (
    <Router>
      {/* BackgroundVideo is placed outside Routes to ensure it stays across all pages */}
      <BackgroundVideo />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/projects" element={<Project />} />
        <Route path="/hardware" element={<HardwarePage />} />
      </Routes>
    </Router>
  );
};

export default App;
