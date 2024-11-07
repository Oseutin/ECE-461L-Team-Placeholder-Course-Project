// frontend/src/components/Project.js
import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';

function Project({ project, auth, refreshProjects }) {
  // Check if the user is authorized based on `users` array
  const isUserAuthorized = Array.isArray(project.users) ? project.users.includes(auth) : false;

  return (
    <Card style={{ marginBottom: '15px' }}>
      <CardContent>
        <Typography variant="h6">
          {project.projectName} <span style={{ fontSize: '0.8em', color: 'gray' }}> (ID: {project.projectId})</span>
        </Typography>
        <Typography variant="body2" color="textSecondary" style={{ marginTop: '5px', marginBottom: '10px' }}>
          {project.description}
        </Typography>
        <Box marginTop="10px">
          {/* Render more details or actions here */}
          {isUserAuthorized && (
            <Button variant="contained" color="primary" onClick={() => {/* handle actions */}}>
              Authorized Actions
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default Project;
