// frontend/src/components/Projects.js
import React, { useEffect, useState } from 'react';
import Project from './Project';
import { Container, Typography, Button, Box, CircularProgress, Snackbar, Alert, Card, CardContent, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { ContentCopy } from '@mui/icons-material';

function Projects({ token, handleLogout }) {
  const [username, setUsername] = useState('');
  const [projectData, setProjectData] = useState({});
  const [userInventory, setUserInventory] = useState({});
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newProjectId, setNewProjectId] = useState('');
  const [newProject, setNewProject] = useState({ id: '', name: '', description: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUsername(decoded.username); // assuming `username` is the field in the decoded token
    }
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchProjects = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/inventory`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const projectsArray = response.data.projects || [];
      const userInventory = response.data.userInventory || {};

      const projectsObject = projectsArray.reduce((acc, project) => {
        acc[project.projectId] = project;
        return acc;
      }, {});

      console.log("Fetched Project Data:", projectsObject);
      console.log("Fetched User Inventory:", userInventory);

      setProjectData(projectsObject);
      setUserInventory(userInventory);
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
  }, [token]);

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
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/join_project`,
        { user_id: token, id: newProjectId },
        {
          headers: {
            Authorization: `Bearer ${token}`
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

  const handleLeaveProject = async (projectId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/leave_project`, { id: projectId }, {
        headers: { Authorization: `Bearer ${token}`}
      });
      setSnackbar({ open: true, message: 'Successfully left project.', severity: 'success' });
      fetchProjects();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to leave project.', severity: 'error' });
    }
  }

  const handleCreateProjectOpen = () => {
    setCreateDialogOpen(true);
  };

  const handleCreateProjectClose = () => {
    setCreateDialogOpen(false);
    setNewProject({ id: '', name: '', description: '' });
  };

  const handleCreateProjectSubmit = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/create_project`,
        {
          user_id: token,
          project_data: { id: newProject.id, name: newProject.name, description: newProject.description }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
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

  const fetchHardwareSets = async (projectId) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/hardware_sets/${projectId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data.hardwareSets;
    } catch (error) {
        console.error('Error fetching hardware sets:', error);
        return [];
    }
  };

  const handleCopyProjectId = (projectId) => {
    navigator.clipboard.writeText(projectId);
    setSnackbar({ open: true, message: 'Project ID copied to clipboard.', severity: 'success' });
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '40px' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="20px">
        <Typography variant="h3" gutterBottom>
          Projects
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Logged in as: {username}
        </Typography>
        <Button variant="outlined" color="secondary" onClick={handleLogoutClick}>
          Logout
        </Button>
      </Box>
      
      <Box marginBottom="20px">
        <Typography variant="h5" gutterBottom>Your Hardware Inventory</Typography>
        {Object.entries(userInventory).map(([projectId, hardwareSets]) => {
          const project = projectData[projectId];
          return (
            <Card key={projectId} style={{ marginBottom: '15px' }}>
              <CardContent>
                <Typography variant="h6">
                  {project.projectName} <span style={{ fontSize: '0.8em', color: 'gray' }}> (ID: {projectId}
                  <Button onClick={() => handleCopyProjectId(projectId)} style={{ marginLeft: '5px' }} title="Copy Project ID">
                    <ContentCopy fontSize="small" />
                  </Button>)</span>
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
        Object.values(projectData).map((project) => (
          <Box key={project.id} style={{ marginBottom: '15px' }}>
            <Project
              project={project}
              token={token}
              refreshProjects={fetchProjects}
              fetchHardwareSets={fetchHardwareSets}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleLeaveProject(project.projectId)}
            >
              Leave Project
            </Button>
          </Box>      
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
