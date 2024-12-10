import { useEffect, useState } from 'react';
import { Box, ImageList, ImageListItem, Stack, Typography } from '@mui/material';
import PlaygroundImg from '../assets/playground.png'
import BienLogo from '../assets/bienenstock-logo.png'

const MediaDisplay = () => {


return (
    <Stack padding={5} justifyContent={'center'} alignItems={'center'} maxHeight={'75vh'}>
        <Box marginBottom={3} display={'flex'} flexDirection={'row'} justifyContent={'center'} height={'100%'}>
            <img style={{width: '75%', height: '100%'}} src={BienLogo}/>
        </Box>
        <img style={{width: '100%', height: '100%', boxShadow: '#000000a1 3px 2px 13px 1px'}} src={PlaygroundImg}/>
    </Stack>
)

}

export default MediaDisplay