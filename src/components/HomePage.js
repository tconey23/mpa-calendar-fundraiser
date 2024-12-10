import { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import SearchField from './SearchField';
import { useNavigate } from 'react-router-dom';

const HomePage = ({students, setSelectedStudent, selectedStudent}) => {
    const navigate = useNavigate()

    useEffect(() => {
        if (selectedStudent) {
          navigate(`/find_student/${selectedStudent}`);
        }
      }, [selectedStudent]);

  return (
    <Stack direction={'column'} justifyContent={'flex-start'} alignItems={'center'} sx={{ height: '75vh', width: '75vw', borderWidth: '1px', borderStyle: 'solid', borderRadius: '5px', boxShadow: '3px 5px 20px 1px #00000073'}} borderColor={'primary.contrastText'} padding={5}>
        <SearchField setSelectedStudent={setSelectedStudent} text={'123'} label={"Child's Name"} data={students}/>
    </Stack>
  );
};

export default HomePage;