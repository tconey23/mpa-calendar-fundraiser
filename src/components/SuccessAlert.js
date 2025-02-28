import { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';

const SuccessAlert = () => {
  return (
    <Stack padding={2} backgroundColor={'#0000006b'} direction={'column'} sx={{height: '100%', width: '100%', boxShadow: '1px 1px 17px 1px black', borderRadius: '30px'}}>
      <Stack justifyContent={'center'} alignItems={'center'} sx={{height: '100%', borderWidth: '1px', borderColor: 'white', borderStyle: 'solid', borderRadius: '30px'}}>
        <Typography>Donation submitted successfully!</Typography>
        <Typography>Thank you for your support!</Typography>
      </Stack>
    </Stack>
  );
};

export default SuccessAlert;