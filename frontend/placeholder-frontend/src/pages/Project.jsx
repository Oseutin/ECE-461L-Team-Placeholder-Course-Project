import * as React from 'react';
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

const projects = [
  { id: '001', image: 'https://media.istockphoto.com/id/1397047877/photo/main-microchip-on-the-motherboard.jpg?s=612x612&w=0&k=20&c=1_jGgHtpbePTeadRR_r8TCwIFAN9ZGRvAzfKftPFy50=' },
  { id: '002', image: 'https://media.istockphoto.com/id/1397047877/photo/main-microchip-on-the-motherboard.jpg?s=612x612&w=0&k=20&c=1_jGgHtpbePTeadRR_r8TCwIFAN9ZGRvAzfKftPFy50=' },
  { id: '003', image: 'https://media.istockphoto.com/id/1397047877/photo/main-microchip-on-the-motherboard.jpg?s=612x612&w=0&k=20&c=1_jGgHtpbePTeadRR_r8TCwIFAN9ZGRvAzfKftPFy50=' },
  { id: '004', image: 'https://media.istockphoto.com/id/1397047877/photo/main-microchip-on-the-motherboard.jpg?s=612x612&w=0&k=20&c=1_jGgHtpbePTeadRR_r8TCwIFAN9ZGRvAzfKftPFy50=' },
  { id: '005', image: 'https://media.istockphoto.com/id/1397047877/photo/main-microchip-on-the-motherboard.jpg?s=612x612&w=0&k=20&c=1_jGgHtpbePTeadRR_r8TCwIFAN9ZGRvAzfKftPFy50=' },
  { id: '006', image: 'https://media.istockphoto.com/id/1397047877/photo/main-microchip-on-the-motherboard.jpg?s=612x612&w=0&k=20&c=1_jGgHtpbePTeadRR_r8TCwIFAN9ZGRvAzfKftPFy50=' },
];

export default function Project() {
  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={2} columns={12}>
        {projects.map((project, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card sx={{ minWidth: 345 }}>
              <CardMedia
                sx={{ height: 140 }}
                image={project.image}
              />
              <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {project.id}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">View Hardware</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Floating action button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}
