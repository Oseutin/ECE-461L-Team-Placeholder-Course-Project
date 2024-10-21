import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';

const projects = [
  {
    id: '001',
    description: "Hello world!",
    name: 'Project 1',
    image: 'https://media.istockphoto.com/id/1397047877/photo/main-microchip-on-the-motherboard.jpg?s=612x612&w=0&k=20&c=1_jGgHtpbePTeadRR_r8TCwIFAN9ZGRvAzfKftPFy50=',
  },
  {
    id: '002',
    description: "Hello world!",
    name: "Project 2",
    image: 'https://media.istockphoto.com/id/1397047877/photo/main-microchip-on-the-motherboard.jpg?s=612x612&w=0&k=20&c=1_jGgHtpbePTeadRR_r8TCwIFAN9ZGRvAzfKftPFy50=',
  },
  {
    id: '003',
    description: "Hello world!",
    name: "Project 3",
    image: 'https://media.istockphoto.com/id/1397047877/photo/main-microchip-on-the-motherboard.jpg?s=612x612&w=0&k=20&c=1_jGgHtpbePTeadRR_r8TCwIFAN9ZGRvAzfKftPFy50=',
  },
  {
    id: '004',
    description: "Hello world!",
    name: "Project 4",
    image: 'https://media.istockphoto.com/id/1397047877/photo/main-microchip-on-the-motherboard.jpg?s=612x612&w=0&k=20&c=1_jGgHtpbePTeadRR_r8TCwIFAN9ZGRvAzfKftPFy50=',
  },
  {
    id: '005',
    description: "Hello world!",
    name: "Project 5",
    image: 'https://media.istockphoto.com/id/1397047877/photo/main-microchip-on-the-motherboard.jpg?s=612x612&w=0&k=20&c=1_jGgHtpbePTeadRR_r8TCwIFAN9ZGRvAzfKftPFy50=',
  },
  {
    id: '006',
    description: "Hello world!",
    name: "Project 6",
    image: 'https://media.istockphoto.com/id/1397047877/photo/main-microchip-on-the-motherboard.jpg?s=612x612&w=0&k=20&c=1_jGgHtpbePTeadRR_r8TCwIFAN9ZGRvAzfKftPFy50=',
  },
];

export default function Project() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={2} columns={12}>
        {projects.map((project, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card sx={{ minWidth: 345 }}>
              <CardMedia sx={{ height: 140 }} image={project.image} />
              <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {project.name} : {project.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">View Hardware</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <React.Fragment>
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
          }}
          onClick={handleClickOpen}
        >
          <AddIcon />
        </Fab>

        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="sm"
          fullWidth
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: '16px',
              backgroundColor: '#f5f5f5',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
            },
          }}
        >
          <DialogTitle
            sx={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#3f51b5',
              textAlign: 'center',
            }}
          >
            Create New Project
          </DialogTitle>

          <DialogContent>
            <DialogContentText
              sx={{
                color: 'black',
                marginBottom: '16px',
                fontSize: '1rem',
                lineHeight: '1.5',
              }}
            >
              To create a new project, please enter the following details:
            </DialogContentText>

            <TextField
              autoFocus
              required
              margin="dense"
              id="projectName"
              name="projectName"
              label="Project Name"
              fullWidth
              variant="outlined"
              InputProps={{
                style: { color: 'black' },
              }}
              InputLabelProps={{
                style: { color: '#3f51b5' },
              }}
              sx={{
                marginBottom: '16px',
                backgroundColor: 'white',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#3f51b5',
                  },
                  '&:hover fieldset': {
                    borderColor: '#3f51b5',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3f51b5',
                  },
                },
              }}
            />

            <TextField
              required
              margin="dense"
              id="description"
              name="description"
              label="Description"
              fullWidth
              variant="outlined"
              InputProps={{
                style: { color: 'black' },
              }}
              InputLabelProps={{
                style: { color: '#3f51b5' },
              }}
              sx={{
                marginBottom: '16px',
                backgroundColor: 'white',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#3f51b5',
                  },
                  '&:hover fieldset': {
                    borderColor: '#3f51b5',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3f51b5',
                  },
                },
              }}
            />

            <TextField
              required
              margin="dense"
              id="projectID"
              name="projectID"
              label="Project ID"
              fullWidth
              variant="outlined"
              InputProps={{
                style: { color: 'black' },
              }}
              InputLabelProps={{
                style: { color: '#3f51b5' },
              }}
              sx={{
                marginBottom: '16px',
                backgroundColor: 'white',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#3f51b5',
                  },
                  '&:hover fieldset': {
                    borderColor: '#3f51b5',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#3f51b5',
                  },
                },
              }}
            />
          </DialogContent>

          <DialogActions
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '16px',
            }}
          >
            <Button onClick={handleClose} color="error" variant="outlined">
              Cancel
            </Button>
            <Button type="submit" color="primary" variant="contained">
              Create Project
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </Box>
  );
}
