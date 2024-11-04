// frontend/src/components/Project.js
import React from 'react';
import ProjectInfo from './ProjectInfo';
import HardwareSet from './HardwareSet';
import JoinLeaveButton from './JoinLeaveButton';
import { Card, CardContent, Divider, Typography } from '@mui/material';
import { jwtDecode } from 'jwt-decode';

function Project({ project, auth, refreshProjects }) {
  // Decode the JWT token to get the current username
  let currentUser = null;
  try {
    currentUser = jwtDecode(auth).sub;
  } catch (e) {
    console.error('Failed to decode JWT:', e);
  }

  const isAuthorized = project.authorizedUsers.includes(currentUser);

  return (
    <Card style={{ marginBottom: '20px' }}>
      <CardContent>
        <ProjectInfo projectName={project.name} projectId={project.id} users={project.authorizedUsers} />
        <Typography variant="body2" color="textSecondary" style={{ marginTop: '5px', marginBottom: '10px' }}>
          {project.description}
        </Typography>
        <Divider style={{ margin: '20px 0' }} />
        {Object.keys(project.hardwareSets).map((hwSetId) => (
          <HardwareSet
            key={hwSetId}
            hardwareSetId={hwSetId}
            setName={hwSetId}
            availability={project.hardwareSets[hwSetId].availability}
            maxCapacity={project.hardwareSets[hwSetId].max_capacity}
            isAuthorized={isAuthorized}
            projectId={project.id}
            auth={auth}
            refreshProjects={refreshProjects}
          />
        ))}
        <JoinLeaveButton isAuthorized={isAuthorized} projectId={project.id} auth={auth} refreshProjects={refreshProjects} />
      </CardContent>
    </Card>
  );
}

export default Project;
