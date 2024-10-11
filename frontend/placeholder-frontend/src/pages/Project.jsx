import React from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Typography, Box, Card, CardContent, Grid } from '@mui/material';

const Projects = () => {
  // Get the user data from the state passed via navigation
  const location = useLocation();
  const { user } = location.state || {}; // Optional chaining to avoid errors if state is undefined

  // Sample project data
  const projects = [
    {
      title: 'Project Alpha',
      description: 'An innovative project that focuses on creating sustainable energy solutions.',
    },
    {
      title: 'Project Beta',
      description: 'A web application for managing personal finances efficiently.',
    },
    {
      title: 'Project Gamma',
      description: 'A mobile app that helps users track their fitness goals and activities.',
    },
  ];

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Projects
      </Typography>
      {user && (
        <Typography variant="h6" component="h2" gutterBottom>
          Welcome, {user.username}!
        </Typography>
      )}
      <Grid container spacing={4}>
        {projects.map((project, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h3">
                  {project.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {project.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Projects;
