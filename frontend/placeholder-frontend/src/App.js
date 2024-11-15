// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, GlobalStyles } from '@mui/material';
import Login from './components/Login';
import Signup from './components/Signup';
import Projects from './components/Projects';
import Home from './components/Home';
import About from './components/About';
import Navbar from './components/Navbar';
import Settings from './components/Settings';

function App() {
  const [auth, setAuth] = useState(null);
  const [themeMode, setThemeMode] = useState('light');

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

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: '#6200ea',
      },
      secondary: {
        main: '#03dac6',
      },
      background: {
        default: themeMode === 'light' ? '#f5f5f5' : '#121212',
      },
    },
    typography: {
      fontFamily: 'Playwrite DE Grund, sans-serif',
      fontWeight: 400,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={{ "input::-ms-reveal, input::-ms-clear": { display: "none" } }} />
      <Router>
        <Navbar auth={auth} setAuth={setAuth} themeMode={themeMode} toggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={auth ? <Navigate to="/projects" replace /> : <Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login setAuth={setAuth} />} />
          <Route path="/signup" element={<Signup setAuth={setAuth} />} />
          <Route path="/projects" element={auth ? <Projects auth={auth} handleLogout={handleLogout} /> : <Navigate to="/" replace />} />
          <Route path="/settings" element={auth ? <Settings setAuth={setAuth} /> : <Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
