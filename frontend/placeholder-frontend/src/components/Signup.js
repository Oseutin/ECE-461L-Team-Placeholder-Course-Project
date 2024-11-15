import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box, Snackbar, Alert, InputAdornment, IconButton, LinearProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup({ setAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [usernameError, setUsernameError] = useState('');
  const navigate = useNavigate();

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20; // Uppercase letter
    if (/[a-z]/.test(password)) strength += 20; // Lowercase letter
    if (/\d/.test(password)) strength += 20; // Number
    if (/[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/.test(password)) strength += 20; // Special character
    return strength;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };

  const usernameRequirements = /^[a-zA-Z0-9_.]{5,20}$/; // Alphanumeric, underscores, and periods, 5-20 characters

  const handleUsernameChange = (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    if (!usernameRequirements.test(newUsername)) {
      setUsernameError('Username must be 5-20 characters long and can only contain letters, numbers, underscores, and periods.');
    } else {
      setUsernameError('');
    }
  };

  const handleSignup = async () => {
    if (!username || !password || !confirmPassword) {
      setSnackbar({ open: true, message: 'Please fill out all fields.', severity: 'error' });
      return;
    }

    if (!usernameRequirements.test(username)) {
      setSnackbar({ open: true, message: 'Username must be 5-20 characters long and can only contain letters, numbers, underscores, and periods.', severity: 'error' });
      return;
    }

    if (password !== confirmPassword) {
      setSnackbar({ open: true, message: 'Passwords do not match.', severity: 'error' });
      return;
    }

    const passwordRequirements = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]{8,}$/;
    if (!passwordRequirements.test(password)) {
      setSnackbar({ 
        open: true, 
        message: 'Password must meet all requirements.', 
        severity: 'error' 
      });
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/add_user`, {
        username,
        password
      });

      const { access_token } = response.data;
      if (access_token) {
        localStorage.setItem('token', access_token);
        setAuth(access_token);
        navigate('/projects');
      } else {
        throw new Error("Signup successful, but no token received.");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.msg || 'Signup failed: An unexpected error occurred.';
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
    }
  };

  // Helper function to check if each requirement is met
  const isRequirementMet = (regex) => regex.test(password);

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
        <Typography variant="h4" component="h1" gutterBottom>
          Sign Up
        </Typography>
        <form onSubmit={(e) => { e.preventDefault(); handleSignup(); }} style={{ width: '100%', marginTop: '1em' }}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={handleUsernameChange}
            required
            error={!!usernameError}
            helperText={usernameError}
          />
          <TextField
            label="Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={password}
            onChange={handlePasswordChange}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box mt={1} mb={2}>
            <LinearProgress variant="determinate" value={passwordStrength} />
            <Typography variant="caption" display="block" align="center" style={{ marginTop: '8px' }}>
              Password Strength: {passwordStrength}%
            </Typography>
          </Box>
          {/* Password requirements hints */}
          <Box mb={2}>
            <Typography variant="caption" color={password.length >= 8 ? "green" : "error"}>
              - At least 8 characters
            </Typography><br />
            <Typography variant="caption" color={isRequirementMet(/[A-Z]/) ? "green" : "error"}>
              - At least one uppercase letter
            </Typography><br />
            <Typography variant="caption" color={isRequirementMet(/[a-z]/) ? "green" : "error"}>
              - At least one lowercase letter
            </Typography><br />
            <Typography variant="caption" color={isRequirementMet(/\d/) ? "green" : "error"}>
              - At least one number
            </Typography><br />
            <Typography variant="caption" color={isRequirementMet(/[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/) ? "green" : "error"}>
              - At least one special character (e.g., @$!%*?&)
            </Typography>
          </Box>
          <TextField
            label="Confirm Password"
            variant="outlined"
            type={showConfirmPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '1em' }}>
            Sign Up
          </Button>
          <Button
            variant="text"
            color="primary"
            fullWidth
            style={{ marginTop: '1em' }}
            onClick={() => navigate('/login')}
          >
            Already have an account? Log in
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

export default Signup;
