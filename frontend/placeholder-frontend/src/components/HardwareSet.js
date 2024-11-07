// frontend/src/components/HardwareSet.js
import React, { useState } from 'react';
import { Button, TextField, Typography, Box, Snackbar, Alert } from '@mui/material';
import { checkInHardware, checkOutHardware } from '../api';

function HardwareSet({ hardwareSetId, setName, availability, maxCapacity, isAuthorized, projectId, auth, refreshProjects }) {
  const [currentAvailability, setCurrentAvailability] = useState(availability);
  const [quantity, setQuantity] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCheckIn = async () => {
    if (!quantity || isNaN(quantity)) {
      setSnackbar({ open: true, message: "Please enter a valid quantity.", severity: "error" });
      return;
    }

    const qty = parseInt(quantity, 10);
    if (qty <= 0) {
      setSnackbar({ open: true, message: "Quantity must be positive.", severity: "error" });
      return;
    }

    try {
      const response = await checkInHardware(projectId, qty, hardwareSetId, auth);
      setSnackbar({ open: true, message: response.message, severity: 'success' });
      setCurrentAvailability(response.newAvailability);
      setQuantity('');
      refreshProjects();
    } catch (error) {
      const errorMsg = error.message || 'Failed to check in hardware.';
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
    }
  };

  const handleCheckOut = async () => {
    if (!quantity || isNaN(quantity)) {
      setSnackbar({ open: true, message: "Please enter a valid quantity.", severity: "error" });
      return;
    }

    const qty = parseInt(quantity, 10);
    if (qty <= 0) {
      setSnackbar({ open: true, message: "Quantity must be positive.", severity: "error" });
      return;
    }

    try {
      const response = await checkOutHardware(projectId, qty, hardwareSetId, auth);
      setSnackbar({ open: true, message: response.message, severity: 'success' });
      setCurrentAvailability(response.newAvailability);
      setQuantity('');
      refreshProjects();
    } catch (error) {
      const errorMsg = error.message || 'Failed to check out hardware.';
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
    }
  };

  return (
    <Box
      border={1}
      borderColor="#e0e0e0"
      borderRadius="8px"
      padding="16px"
      marginBottom="16px"
    >
      <Typography variant="h6">{setName}</Typography>
      <Typography variant="body1">Availability: {currentAvailability} / {maxCapacity}</Typography>
      <Box display="flex" alignItems="center" marginTop="10px">
        <TextField
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          onFocus={() => setQuantity('')}
          disabled={!isAuthorized}
          style={{ marginRight: '16px' }}
          InputProps={{ inputProps: { min: 0 } }}
          placeholder="Enter quantity"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleCheckOut}
          disabled={!isAuthorized || quantity === ''}
          style={{ marginRight: '8px' }}
        >
          Check Out
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleCheckIn}
          disabled={!isAuthorized || quantity === ''}
        >
          Check In
        </Button>
      </Box>
      {!isAuthorized && (
        <Typography variant="caption" color="error" display="block" marginTop="8px">
          You are not authorized to modify this hardware set.
        </Typography>
      )}
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
  );
}

export default HardwareSet;
