import { useEffect, useState } from 'react';
import { Stack, Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress'

const ProgressCircle = () => {
  return (
    <Box sx={{ width: '100%' }}>
        <CircularProgress color='orange'/>
    </Box>
  );
};

export default ProgressCircle;