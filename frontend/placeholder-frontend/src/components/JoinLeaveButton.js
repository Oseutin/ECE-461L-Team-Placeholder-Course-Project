// frontend/src/components/JoinLeaveButton.js
import React, { useState } from 'react';
import { Button, Snackbar, Alert } from '@mui/material';
import { joinProject, leaveProject } from '../api';

function JoinLeaveButton({ isAuthorized, projectId, auth, refreshProjects }) {
  const [joined, setJoined] = useState(isAuthorized);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleJoinLeave = async () => {
    try {
      let message;
      if (joined) {
        message = await leaveProject(projectId, auth);
        setJoined(false);
      } else {
        message = await joinProject(projectId, auth);
        setJoined(true);
      }
      setSnackbar({ open: true, message, severity: 'success' });
      refreshProjects();
    } catch (error) {
      const errorMsg = error.msg || 'Action failed.';
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
    }
  };

  return (
    <>
      <Button variant="contained" onClick={handleJoinLeave}>
        {joined ? 'Leave Project' : 'Join Project'}
      </Button>
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
    </>
  );
}

export default JoinLeaveButton;
