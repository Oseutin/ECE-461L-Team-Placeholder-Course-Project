import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import DescriptionIcon from '@mui/icons-material/Description';
import GitHubIcon from '@mui/icons-material/GitHub';

function About() {
  return (
    <Container>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
        <Box display="flex" justifyContent="center" mb={4}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <img src="/image4.png" alt="VR Person" style={{ margin: '0 10px' }} />
          </motion.div>
        </Box>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography variant="h2" component="h1" gutterBottom>
            About Placeholder
          </Typography>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <Typography variant="h5" component="h2" gutterBottom>
            Placeholder is designed to help you manage your projects and hardware sets efficiently.
          </Typography>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <Box display="flex" justifyContent="center" mt={4}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<GitHubIcon />}
              component={Link}
              to="https://github.com/Oseutin/ECE-461L-Team-Placeholder-Course-Project"
              target="_blank"
            >
              View our website's repository on GitHub
            </Button>
          </Box>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <Box display="flex" justifyContent="center" mt={4}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<DescriptionIcon />}
              component={Link}
              to="https://docs.google.com/document/d/1JvMRN2Ut6UTkhOBBJdxP5xN6cGy566wtWcegBBh37CM/edit?tab=t.0#heading=h.vual5566ayoi"
              target="_blank"
            >
              View our vision here in the Placeholder Project Plan
            </Button>
          </Box>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2 }}
        >
          <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
            <Typography variant="h6" component="h3" gutterBottom>
              Developed by yours truly,
            </Typography>
            <Typography variant="body1" component="p">
              Amy Bae, back-end and DB engineer
            </Typography>
            <Typography variant="body1" component="p">
              Austin Fang, front-end and UX/UI design engineer
            </Typography>
            <Typography variant="body1" component="p">
              Dreylon Nguyen, back-end and DB engineer
            </Typography>
            <Typography variant="body1" component="p">
              Michael Zhao, front-end and cloud engineer
            </Typography>
          </Box>
        </motion.div>
      </Box>
    </Container>
  );
}

export default About;