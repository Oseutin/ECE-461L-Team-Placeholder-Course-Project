// src/theme.js

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blue
    },
    secondary: {
      main: '#dc004e', // Pink
    },
    text: {
      primary: '#ffffff', // White text
    },
    background: {
      default: '#000000', // Default background (optional)
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    allVariants: {
      color: '#ffffff', // Set all typography to white by default
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& label.Mui-focused': {
            color: '#ffffff',
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: '#ffffff',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#ffffff',
            },
            '&:hover fieldset': {
              borderColor: '#ffffff',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ffffff',
            },
            color: '#ffffff', // Input text color
            '& .MuiInputBase-input': {
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          color: '#ffffff', // Ensure button text is white
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          textDecoration: 'underline',
          '&:hover': {
            color: '#ffffff',
          },
        },
      },
    },
  },
});

export default theme;
