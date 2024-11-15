import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box, Snackbar, Alert, InputAdornment, IconButton, LinearProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Settings({ setAuth }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [passwordStrength, setPasswordStrength] = useState(0);
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

  const handleNewPasswordChange = (e) => {
    const newPassword = e.target.value;
    setNewPassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };

  const isRequirementMet = (regex) => regex.test(newPassword);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setSnackbar({ open: true, message: 'Please fill out all fields.', severity: 'error' });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setSnackbar({ open: true, message: 'New passwords do not match.', severity: 'error' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.REACT_APP_API_URL}/change_password`, {
        currentPassword,
        newPassword
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setSnackbar({ open: true, message: 'Password changed successfully.', severity: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => {
        navigate('/projects');
      }, 3000); // 3 seconds delay
    } catch (error) {
      const errorMsg = error.response?.data?.msg || 'Password change failed: An unexpected error occurred.';
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>
        <form onSubmit={(e) => { e.preventDefault(); handleChangePassword(); }} style={{ width: '100%', marginTop: '1em' }}>
          <TextField
            label="Current Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
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
          <TextField
            label="New Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={handleNewPasswordChange}
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
          <Box mb={2}>
            <Typography variant="caption" color={newPassword.length >= 8 ? "green" : "error"}>
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
            label="Confirm New Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
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
          <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '1em' }}>
            Change Password
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

export default Settings;