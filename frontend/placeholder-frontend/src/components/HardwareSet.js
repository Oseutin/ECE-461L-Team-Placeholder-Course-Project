import React, { useState } from 'react';
import { Button, TextField, Typography, Box, Snackbar, Alert } from '@mui/material';
import { checkInHardware, checkOutHardware } from '../api';

function HardwareSet({ hardwareSet, projectId, auth, refreshProjects }) {
    const [quantity, setQuantity] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleCheckIn = async () => {
        if (quantity <= 0) {
            setSnackbar({ open: true, message: 'Please enter a positive quantity.', severity: 'error' });
            return;
        }
        try {
            const response = await checkInHardware(projectId, parseInt(quantity), hardwareSet.hwName, auth);
            setSnackbar({ open: true, message: response.msg, severity: 'success' });
            refreshProjects();
            setQuantity('');
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to check in hardware.', severity: 'error' });
        }
    };

    const handleCheckOut = async () => {
        if (quantity <= 0) {
            setSnackbar({ open: true, message: 'Please enter a positive quantity.', severity: 'error' });
            return;
        }
        try {
            const response = await checkOutHardware(projectId, parseInt(quantity), hardwareSet.hwName, auth);
            setSnackbar({ open: true, message: response.msg, severity: 'success' });
            refreshProjects();
            setQuantity('');
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to check out hardware.', severity: 'error' });
        }
    };

    return (
        <Box border={1} borderColor="grey.300" borderRadius="8px" padding="16px" marginBottom="16px">
            <Typography variant="h6">{hardwareSet.hwName}</Typography>
            <Typography>Availability: {hardwareSet.available_capacity} / {hardwareSet.total_capacity}</Typography>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <TextField
                    label="Quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Enter quantity"
                    margin="normal"
                    style={{ width: '60%' }}
                />
                <Box display="flex" justifyContent="flex-end" alignItems="center" style={{ width: '40%' }}>
                    <Button variant="contained" color="primary" onClick={handleCheckIn} style={{ marginRight: '10px' }}>
                        Check In
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleCheckOut}>
                        Check Out
                    </Button>
                </Box>
            </Box>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default HardwareSet;
