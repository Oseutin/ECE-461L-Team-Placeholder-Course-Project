// frontend/src/components/Project.js
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

function Project({ project, auth, refreshProjects }) {
  return (
    <Card style={{ marginBottom: '15px' }}>
      <CardContent>
        <Typography variant="h6">
          {project.projectName}{' '}
          <span style={{ fontSize: '0.8em', color: 'gray' }}>
            (ID: {project.projectId})
          </span>
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          style={{ marginTop: '5px', marginBottom: '10px' }}
        >
          {project.description}
        </Typography>
        {/* Add more project details or actions here if needed */}
      </CardContent>
    </Card>
  );
}

export default Project;
