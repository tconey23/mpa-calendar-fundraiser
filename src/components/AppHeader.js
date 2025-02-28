import { useEffect} from 'react';
import { MenuItem, Select} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { studentData } from '../business/apiCalls';
import PTALogo from '../assets/PTA-logo-Photoroom.png'
import {useMediaQuery} from '@mui/material';

const AppHeader = ({setStudents, setSelectedStudent, students, selectedStudent, isDarkMode, setIsDarkMode}) => {
    
    const webMed = useMediaQuery('(min-width:900px)');
    
    const getStudentList = async () => {
        try {
            const list = await studentData();
            setStudents(list);
            // console.log(list)
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
                    {/* <Box padding={2}>
                        <i className="fi fi-br-menu-burger"></i>
                    </Box> */}
                   <Box padding={0.5} justifyContent={'center'} alignItems={'center'} width={'100%'} display={'flex'}>
                    <img style={{padding: 2, height: 'clamp(10vh, 10vw, 75px)', backgroundColor: isDarkMode && 'white'}} src={PTALogo}/>
                   </Box>
                    <Box sx={{cursor: 'pointer', ":hover": {filter: 'invert(1)'}}} onClick={() => setIsDarkMode(prev => !prev)}>
                        {isDarkMode ? <i className="fi fi-br-sun"></i> : <i className="fi fi-br-moon"></i>}
                    </Box>
                    {/* <Box width={200} padding={2}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Child's Name</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedStudent}
                                label="Child"
                                onChange={handleChange}
                            >
                                {students &&
                                    students
                                        .sort((a, b) => a.FIRST.localeCompare(b.FIRST)) // Sort alphabetically
                                        .map((st, i) => (
                                            <MenuItem key={i} value={`${st.FIRST} ${st.LAST}`}>
                                                {`${st.FIRST} ${st.LAST}`}
                                            </MenuItem>
                                        ))
                                }
                            </Select>
                        </FormControl>
                    </Box> */}
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default AppHeader;
