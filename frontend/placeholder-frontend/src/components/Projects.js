// frontend/src/components/Projects.js
import React, { useEffect, useState } from 'react';
import Project from './Project';
import { Container, Typography, Button, Box, CircularProgress, Snackbar, Alert, Card, CardContent, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Projects({ auth, handleLogout }) {
  const [projectData, setProjectData] = useState({});
  const [userInventory, setUserInventory] = useState({});
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newProjectId, setNewProjectId] = useState('');
  const [newProject, setNewProject] = useState({ id: '', name: '', description: '' });
  const navigate = useNavigate();

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/inventory`, {
        headers: {
          Authorization: `Bearer ${auth}`
        }
      });

      // Handle project data structure and guard against undefined
      const projectsArray = response.data.projects || [];
      const inventory = response.data.userInventory || {};

      // Convert projects array to an object with project IDs as keys for easier lookup
      const projectsObject = projectsArray.reduce((acc, project) => {
        acc[project.projectId] = project;
        return acc;
      }, {});

      setProjectData(projectsObject);
      setUserInventory(inventory);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setSnackbar({ open: true, message: 'Failed to fetch projects. Please try again.', severity: 'error' });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line
  }, [auth]);

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/');
  };

  const handleJoinProjectOpen = () => {
    setJoinDialogOpen(true);
  };

  const handleJoinProjectClose = () => {
    setJoinDialogOpen(false);
    setNewProjectId('');
  };

  const handleJoinProjectSubmit = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/join_project`,
        { user_id: auth, id: newProjectId },
        {
          headers: {
            Authorization: `Bearer ${auth}`
          }
        }
      );
      setSnackbar({ open: true, message: response.data.message, severity: 'success' });
      fetchProjects();
      handleJoinProjectClose();
    } catch (error) {
      const errorMsg = error.response?.data?.msg || 'Failed to join project.';
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
    }
  };

  const handleCreateProjectOpen = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateProjectClose = () => {
    setCreateDialogOpen(false);
    setNewProject({ id: '', name: '', description: '' });
  };

  const handleCreateProjectSubmit = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/create_project`,
        {
          user_id: auth,
          project_data: { id: newProject.id, name: newProject.name, description: newProject.description }
        },
        {
          headers: {
            Authorization: `Bearer ${auth}`
          }
        }
      );
      setSnackbar({ open: true, message: response.data.message, severity: 'success' });
      fetchProjects();
      handleCreateProjectClose();
    } catch (error) {
      const errorMsg = error.response?.data?.msg || 'Failed to create project.';
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
    }
  };

  const handleCreateProjectInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '40px' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="20px">
        <Typography variant="h3" gutterBottom>
          Projects
        </Typography>
        <Button variant="outlined" color="secondary" onClick={handleLogoutClick}>
          Logout
        </Button>
      </Box>
      
      <Box marginBottom="20px">
        <Typography variant="h5" gutterBottom>Your Hardware Inventory</Typography>
        {Object.entries(userInventory).map(([projectId, hardwareSets]) => {
          const project = projectData[projectId];
          if (!project) return null;

          return (
            <Card key={projectId} style={{ marginBottom: '15px' }}>
              <CardContent>
                <Typography variant="h6">
                  {project.projectName} <span style={{ fontSize: '0.8em', color: 'gray' }}> (ID: {projectId})</span>
                </Typography>
                <Typography variant="body2" color="textSecondary" style={{ marginTop: '5px', marginBottom: '10px' }}>
                  {project.description}
                </Typography>
                <Box marginTop="10px">
                  {Object.entries(hardwareSets).map(([hwSetId, quantity]) => (
                    <Typography key={hwSetId} variant="body2">
                      {hwSetId}: {quantity} checked out
                    </Typography>
                  ))}
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      <Typography variant="h5" gutterBottom>Your Project Library</Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      ) : Object.keys(projectData).length === 0 ? (
        <Typography variant="h6">No authorized projects available.</Typography>
      ) : (
        Object.values(projectData)
          .filter((project) => project.users?.includes(auth))
          .map((project) => (
            <Project key={project.projectId} project={project} auth={auth} refreshProjects={fetchProjects} />
          ))
      )}

      <Box display="flex" flexDirection="column" alignItems="center" marginTop="20px">
        <Button variant="contained" color="primary" onClick={handleJoinProjectOpen} style={{ marginBottom: '10px' }}>
          Join Existing Project
        </Button>
        <Button variant="contained" color="primary" onClick={handleCreateProjectOpen}>
          Create New Project
        </Button>
      </Box>

      <Dialog open={joinDialogOpen} onClose={handleJoinProjectClose}>
        <DialogTitle>Join Existing Project</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the project ID of the project you would like to join.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Project ID"
            type="text"
            fullWidth
            value={newProjectId}
            onChange={(e) => setNewProjectId(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleJoinProjectClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleJoinProjectSubmit} color="primary">
            Join Project
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={createDialogOpen} onClose={handleCreateProjectClose}>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the details for the new project. Once created, you will be automatically authorized to access this project.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Project ID"
            type="text"
            fullWidth
            name="id"
            value={newProject.id}
            onChange={handleCreateProjectInputChange}
            required
          />
          <TextField
            margin="dense"
            label="Project Name"
            type="text"
            fullWidth
            name="name"
            value={newProject.name}
            onChange={handleCreateProjectInputChange}
            required
          />
          <TextField
            margin="dense"
            label="Project Description"
            type="text"
            fullWidth
            name="description"
            value={newProject.description}
            onChange={handleCreateProjectInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateProjectClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreateProjectSubmit} color="primary">
            Create Project
          </Button>
        </DialogActions>
      </Dialog>

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
    </Container>
  );
}

export default Projects;
