// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Projects from './components/Projects';
import { GlobalStyles } from '@mui/material';

function App() {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuth(token);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth(null);
  };

  return (
    <>
      <>
        <GlobalStyles styles={{"input::-ms-reveal, input:: -ms-clear": { display: "none" }}}
        />
      </>
      <Router>
        <Routes>
          <Route
            path="/"
            element={auth ? <Navigate to="/projects" replace /> : <Login setAuth={setAuth} />} />
          <Route
            path="/signup"
            element={<Signup setAuth={setAuth} />} />
          <Route
            path="/projects"
            element={auth ? <Projects auth={auth} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
