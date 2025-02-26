import { useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import SearchField from './SearchField';
import { useNavigate } from 'react-router-dom';
import StudentCard from './StudentCard';
import useMediaQuery from '@mui/material/useMediaQuery';
import MediaDisplay from './MediaDisplay';

const HomePage = ({ students, setSelectedStudent, selectedStudent }) => {
  const navigate = useNavigate();
  const webMed = useMediaQuery('(min-width:900px)');
  const [studentFilter, setStudentFilter] = useState(null);

  useEffect(() => {
    if (selectedStudent) {
      navigate(`/find_student/${selectedStudent}`);
    }
  }, [selectedStudent]);

  useEffect(() => {
    console.log();
  }, [students]);

  return (
    <Stack direction={webMed ? 'row' : 'column'} sx={{width: '100%', height: '100%'}}> 
      {webMed && 
        <Stack direction={'column'} justifyContent={'center'} alignItems={'center'} width={'50vw'} height={'75vh'}>
          <MediaDisplay />
        </Stack>
      }
      <Stack
      direction={'column'}
      justifyContent={'flex-start'}
      alignItems={'center'}
      sx={{
        height: '75vh',
        width: webMed ? '50vw' : '75vw',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: '5px',
        boxShadow: '3px 5px 20px 1px #00000073',
      }}
      borderColor={'primary.contrastText'}
      padding={5}
      >
      <SearchField
        setStudentFilter={setStudentFilter}
        text={'123'}
        label={"Student's Name"}
        data={students}
        />
        <Stack
          sx={{ overflowY: 'scroll' }}
          width={'95%'}
          direction={'column'}
          alignItems={'center'}
          padding={1}
          >
          {students
            .filter((st) => {
              if (!studentFilter) {
                return true;
              }
              return `${st.FIRST} ${st.LAST}` === studentFilter;
            })
            .map((st, i) => (
              <StudentCard webMed={webMed} key={i} student={st} setSelectedStudent={setSelectedStudent}/>
            ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default HomePage;