import './App.css';
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom"; 
import { Stack, CssBaseline, Typography, Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { lightPalette, darkPalette } from './business/palette' 
import AppHeader from './components/AppHeader';
import { useState, useEffect } from 'react';
import StudentPage from './components/StudentPage';
import LoginFields from './components/LoginFields';
import useMediaQuery from '@mui/material/useMediaQuery'
import { adminVal } from './business/apiCalls';
import Admin from './components/Admin';

function App() {
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)
  const [version] = useState('4.2')
  const [isAdmin, setIsAdmin] = useState(false)
  const [toggleAdmin, setToggleAdmin] = useState(false)

  const webMed = useMediaQuery('(min-width:900px)')

  const theme = isDarkMode ? darkPalette : lightPalette;

  const checkAdmin = async () => {
    const res = await adminVal()
    res === true ? setIsAdmin(true) : setIsAdmin(false)
  }

  useEffect(() => {
    checkAdmin()
  }, [])


  return (
    <BrowserRouter initialEntries={["/home"]}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Stack sx={{overflow: webMed ? 'hidden' : 'auto'}} direction="column" justifyContent="center" alignItems={'center'} width={'100%'} height={'100vh'}>
          <AppHeader
            setToggleAdmin={setToggleAdmin}
            isAdmin={isAdmin}
            students={students}
            setStudents={setStudents}
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
            setIsDarkMode={setIsDarkMode}
            isDarkMode={isDarkMode}
          />
          <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="center"
            padding={3}
            sx={{overflow: webMed ? 'hidden' : 'auto', height: webMed ? '100vh' : '200vh'}}
          >
            <Typography sx={{fontSize: webMed ? 30 : 15, textAlign: 'center'}}>Thank you for supporting the new MPA playground!</Typography>
            {!loggedIn && !toggleAdmin && 
            <Stack>
              <LoginFields loggedIn={loggedIn} setLoggedIn={setLoggedIn} setSelectedStudent={setSelectedStudent}/>
            </Stack>}
            {loggedIn && selectedStudent &&
              <StudentPage selectedStudent={selectedStudent} setSelectedStudent={setSelectedStudent} setLoggedIn={setLoggedIn} isDarkMode={isDarkMode}/>
            }
          </Stack>
          {toggleAdmin && 
          <Stack>
            <Admin />
          </Stack>}
          <Stack direction={'row'} alignItems={'flex-end'} width={'97vw'}>
            <Typography fontSize={8}>ver: {version}</Typography>
          </Stack>
        </Stack>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
