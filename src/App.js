import './App.css';
import { Routes, Route, useNavigate } from "react-router-dom";
import { Stack } from '@mui/material';
import AppHeader from './components/AppHeader';
import { useState, useEffect } from 'react';
import StudentPage from './components/StudentPage';

function App() {
  const [students, setStudents] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(''); 
  const goto = useNavigate();

  useEffect(() => {
    if (selectedStudent) {
      goto(`/getstudent/${selectedStudent}`);
    }
  }, [selectedStudent, goto, students]);

  return (
    <Stack>
      <AppHeader
        students={students}
        setStudents={setStudents}
        selectedStudent={selectedStudent}
        setSelectedStudent={setSelectedStudent}
      />
      <Routes>
        {students &&
          students.map((st) => (
            <Route
              key={`${st.FIRST} ${st.LAST}`}
              path={`getstudent/${st.FIRST} ${st.LAST}`}
              element={<StudentPage students={students} selectedStudent={`${st.FIRST} ${st.LAST}`} />}
            />
          ))}
      </Routes>
    </Stack>
  );
}

export default App;
