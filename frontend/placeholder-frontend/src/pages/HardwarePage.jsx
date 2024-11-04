// src/components/HardwarePage.js

import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
} from "@mui/material";

// Sample hardware data
const hardwareItems = [
  {
    id: 1,
    name: "Graphics Card",
    description: "High-performance graphics card for gaming and rendering.",
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    name: "Motherboard",
    description: "Reliable motherboard with support for the latest processors.",
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    id: 3,
    name: "SSD",
    description: "Fast SSD for quick data access and storage.",
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    id: 4,
    name: "RAM",
    description: "High-speed RAM for optimal performance.",
    imageUrl: "https://via.placeholder.com/150",
  },
];

const HardwarePage = () => {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Hardware List
      </Typography>
      <Grid container spacing={2}>
        {hardwareItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={item.imageUrl}
                alt={item.name}
              />
              <CardContent>
                <Typography variant="h5" component="div">
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
                <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HardwarePage;
