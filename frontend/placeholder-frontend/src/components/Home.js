import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Home() {
  return (
    <Container>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" mt={-6}>
        <Box display="flex" justifyContent="center" alignItems="center" width="100%" mt={2} mb={4}>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Typography variant="h4" component="h4" gutterBottom>
              <Box component="span" sx={{ bgcolor: 'primary.main', color: 'white', px: 2, py: 1, borderRadius: 2 }}>Hardware-as-a-Service</Box> at your fingertips.
            </Typography>
          </motion.div>
        </Box>
        <Box display="flex" justifyContent="center" mb={2}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <img src="/image1.png" alt="Laptop" style={{ margin: '0 10px' }} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <img src="/image2.png" alt="CPU" style={{ margin: '0 10px' }} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <img src="/image3.png" alt="Robot" style={{ margin: '0 10px' }} />
          </motion.div>
        </Box>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography variant="h1" component="h1" gutterBottom align="center">
            Welcome to Placeholder
          </Typography>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <Typography variant="h5" component="h2" gutterBottom>
            Your one-stop solution for managing projects and hardware sets.
          </Typography>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <Button variant="contained" color="primary" component={Link} to="/signup" sx={{ mt: 2 }}>
            Get Started
          </Button>
        </motion.div>
      </Box>
    </Container>
  );
}

export default Home;