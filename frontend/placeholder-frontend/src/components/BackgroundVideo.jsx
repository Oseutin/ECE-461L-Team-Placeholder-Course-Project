import React from 'react';
import { Box } from '@mui/material';

const BackgroundVideo = () => {
  return (
    <Box
      component="video"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        minWidth: '100%',
        minHeight: '100%',
        width: 'auto',
        height: 'auto',
        zIndex: -1,
        objectFit: 'cover',
      }}
      autoPlay
      loop
      muted
      playsInline
      src="/background.mp4"
      type="video/mp4"
    />
  );
};

export default BackgroundVideo;
