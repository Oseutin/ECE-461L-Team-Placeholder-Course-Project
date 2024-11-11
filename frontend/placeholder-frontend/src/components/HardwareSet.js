// frontend/src/components/HardwareSet.js

import React, { useState } from 'react';
import { Button, TextField, Typography, Box, Snackbar, Alert } from '@mui/material';
import { checkInHardware, checkOutHardware } from '../api';

function HardwareSet({ hardwareSet, projectId, auth, refreshProjects }) {
    const [quantity, setQuantity] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleCheckIn = async () => {
        try {
            const response = await checkInHardware(projectId, quantity, hardwareSet.hwName, auth);
            setSnackbar({ open: true, message: response.message, severity: 'success' });
            refreshProjects();
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to check in hardware.', severity: 'error' });
        }
    };

    const handleCheckOut = async () => {
        try {
            const response = await checkOutHardware(projectId, quantity, hardwareSet.hwName, auth);
            setSnackbar({ open: true, message: response.message, severity: 'success' });
            refreshProjects();
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to check out hardware.', severity: 'error' });
        }
    };

    return (
        <Box>
            <Typography variant="h6">{hardwareSet.hwName}</Typography>
            <Typography>Availability: {hardwareSet.available_capacity} / {hardwareSet.total_capacity}</Typography>
            <TextField
                label="Quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
            />
            <Button variant="contained" color="primary" onClick={handleCheckOut}>Check Out</Button>
            <Button variant="contained" color="secondary" onClick={handleCheckIn}>Check In</Button>
            
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
}

export default HardwareSet;
