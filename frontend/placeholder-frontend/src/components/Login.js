// frontend/src/components/Login.js
import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box, Snackbar, Alert, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ setAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleLogin = async () => {
    if (!username || !password) {
      setSnackbar({ open: true, message: 'Please enter both username and password.', severity: 'error' });
      return;
    }
  
    try {
      // Use environment variable for API URL
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
        username,
        password
      });
  
      const { access_token } = response.data;
      if (access_token) {
        localStorage.setItem('token', access_token);
        setAuth(access_token);
        navigate('/projects');
      } else {
        throw new Error("Login failed: No token received.");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.msg || 'Login failed: An unexpected error occurred.';
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
    }
  };  

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <Container maxWidth="sm">
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        minHeight="100vh"
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: '1em' }}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    onClick={handleClickShowPassword}
                    edge="end"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth
            style={{ marginTop: '1em' }}
          >
            Log in
          </Button>
          <Button
            variant="text"
            color="primary"
            fullWidth
            style={{ marginTop: '1em' }}
            onClick={() => navigate('/signup')}
          >
            Don't have an account? Sign Up
          </Button>
        </form>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}

export default Login;
