import './App.css';
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom"; 
import { Stack, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { lightPalette, darkPalette } from './business/palette' 
import AppHeader from './components/AppHeader';
import { useState } from 'react';
import StudentPage from './components/StudentPage';
import HomePage from './components/HomePage';
import BreadCrumbs from './components/BreadCrumbs';

function App() {
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(true)

  const theme = isDarkMode ? darkPalette : lightPalette;

  return (
    <BrowserRouter initialEntries={["/home"]}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Stack direction="column" justifyContent="center">
          <AppHeader
            students={students}
            setStudents={setStudents}
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
            setIsDarkMode={setIsDarkMode}
            isDarkMode={isDarkMode}
          />
          <BreadCrumbs setSelectedStudent={setSelectedStudent}/>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            padding={3}
          >
            <Routes>
              <Route path="/" element={<Navigate to='/find_student' />} />
              <Route
                path='/find_student'
                element={
                  <HomePage
                    students={students}
                    selectedStudent={selectedStudent}
                    setSelectedStudent={setSelectedStudent}
                  />
                }
              />
              {students.map((st) => (
              <Route
                key={`/find_student/${st.FIRST} ${st.LAST}`}
                path={`/find_student/${st.FIRST} ${st.LAST}`}
                element={
                  <StudentPage
                    students={students}
                    selectedStudent={`${st.FIRST} ${st.LAST}`}
                  />
                }
              />
            ))}
            </Routes>
          </Stack>
        </Stack>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
