// frontend/src/components/ProjectInfo.js
import React from 'react';
import { Typography } from '@mui/material';

function ProjectInfo({ projectName, projectId, users }) {
  return (
    <div>
      <Typography variant="h5">
        {projectName} <span style={{ fontSize: '0.8em', color: 'gray' }}> (ID: {projectId})</span>
      </Typography>
      <Typography variant="body1">Authorized Users: {users.join(', ')}</Typography>
    </div>
  );
}

export default ProjectInfo;
