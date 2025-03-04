import { useEffect} from 'react';
import { Button, Stack} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { studentData } from '../business/apiCalls';
import PTALogo from '../assets/PTA-logo-Photoroom.png'
import {useMediaQuery} from '@mui/material';
import DonationCounter from './DonationCounter';

const AppHeader = ({setStudents, setSelectedStudent, isDarkMode, setIsDarkMode, isAdmin, setToggleAdmin}) => {
    
    const webMed = useMediaQuery('(min-width:900px)');
    
    const getStudentList = async () => {
        try {
            const list = await studentData();
            setStudents(list);
        } catch (error) {
            console.error('Error fetching student list:', error);
        }
    };

    useEffect(() => {
        getStudentList();
    }, []);

    const handleChange = (event) => {
        setSelectedStudent(event.target.value);
    };

    return (
        <Box width={'100vw'} sx={{ flexGrow: 1 }}> 
            <AppBar position="static">
                <Toolbar>

                    {isAdmin && 
                    <Box padding={2}>
                        <Button onClick={() => setToggleAdmin(prev => !prev)}>
                            <i className="fi fi-br-menu-burger"></i>
                        </Button>
                    </Box>}

                   <Box padding={0.5} justifyContent={'center'} alignItems={'center'} width={'100%'} display={'flex'}>
                    <img style={{padding: 2, height: 'clamp(10vh, 10vw, 75px)', backgroundColor: isDarkMode && 'white'}} src={PTALogo}/>
                   </Box>

                    <Box sx={{cursor: 'pointer', ":hover": {filter: 'invert(1)'}}} onClick={() => setIsDarkMode(prev => !prev)}>
                        {isDarkMode ? <i className="fi fi-br-sun"></i> : <i className="fi fi-br-moon"></i>}
                    </Box>

                </Toolbar>

                <Stack justifyContent={'center'} width={'100%'} alignItems={'center'}>
                    <DonationCounter />
                </Stack>

            </AppBar>
        </Box>
    );
};

export default AppHeader;
