import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Box } from '@mui/material';
import { Menu as MenuIcon, Brightness4, Brightness7 } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ auth, setAuth, themeMode, toggleTheme }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAuth(null);
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#6200ea', height: '100px' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '1200px', justifyContent: 'center' }}>
          <Typography variant="h4" component="div" sx={{ textAlign: 'center' }}>
            Placeholder
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', flexGrow: 1, gap: 2 }}>
            {!auth && <Button color="inherit" component={Link} to="/">Home</Button>}
            <Button color="inherit" component={Link} to="/about">About</Button>
            {auth && <Button color="inherit" component={Link} to="/projects">Projects</Button>}
          </Box>
          <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
            {themeMode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          {auth ? (
            <>
              <Button color="inherit" onClick={handleLogout} sx={{ marginLeft: 'auto' }}>
                Logout
              </Button>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMenu}
                sx={{ display: { xs: 'flex', md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose} component={Link} to="/projects">Projects</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/signup">Signup</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;