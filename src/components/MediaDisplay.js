import { useEffect, useState } from 'react';
import { Box, ImageList, ImageListItem, Stack, Tooltip, Typography } from '@mui/material';
import PlaygroundImg from '../assets/playground.png'
import BienLogo from '../assets/bienenstock-logo.png'

const MediaDisplay = () => {

    const [isHover, setIsHover] = useState(false)

return (
    <Stack padding={5} justifyContent={'center'} alignItems={'center'} maxHeight={'75vh'}>
            <Box marginBottom={3} display={'flex'} flexDirection={'row'} justifyContent={'center'} height={'100%'}>
                <img style={{width: '75%', height: '100%'}} src={BienLogo}/>
            </Box>
        <Tooltip title='click to enlarge'>
            <img onClick={() => setIsHover(true)} style={{width: '100%', height: '100%', boxShadow: '#000000a1 3px 2px 13px 1px', cursor: 'pointer'}} src={PlaygroundImg}/>
        </Tooltip>

        {isHover && 
            <Stack backgroundColor={'#000000b0'}  left={0} top={0} justifyContent={'center'} alignItems={'center'} position={'absolute'} height={'100vh'} width={'100vw'} zIndex={10}>
                <i onClick={() => setIsHover(false)} className="fi fi-sr-circle-xmark" style={{fontSize: '25px', cursor: 'pointer'}}></i>
                <img style={{transition: 'all 1s ease-in-out', width: '90%', height: '90%', boxShadow: '#000000a1 3px 2px 13px 1px'}} src={PlaygroundImg}/>
            </Stack>
        }
    </Stack>
)

}

export default MediaDisplay