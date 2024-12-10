import { useEffect, useState } from 'react';
import { Stack, Typography, Avatar, Slider } from '@mui/material';

const StudentCard = ({ student, webMed, setSelectedStudent }) => {
  const [studentTotal, setStudentTotal] = useState(0);
  const [isHover, setIsHover] = useState(false)

  useEffect(() => {
    if (student && student.dates && student.dates !== "NA") {
      const dates = Object.entries(student.dates).reduce((acc, dt) => {
        acc += dt[1].dollarAmount;
        return acc;
      }, 0);

      setStudentTotal(dates);
    }
  }, [student]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Stack
      direction={'row'}
      padding={1}
      sx={{ 
        width: '95%', 
        height: '100px', 
        cursor: 'pointer',
        bgcolor: isHover ? 'primary.hover' : 'background.default'
    }}
      onMouseOver={() => setIsHover(true)}
      onMouseOut={() => setIsHover(false)}
      onClick={() => setSelectedStudent(`${student.FIRST} ${student.LAST}`)}
      alignItems={'flex-start'}
      justifyContent={'flex-start'}
    >
      <Avatar>{`${student.FIRST[0]}${student.LAST[0]}`}</Avatar>
      <Stack width={'100%'} marginLeft={1}>
        <Typography>{`${student.FIRST} ${student.LAST}`}</Typography>
        <Typography marginTop="4px" fontWeight="bold">
          {formatCurrency(studentTotal)}
        </Typography>
        <Slider
          sx={{ marginTop: '8px' }}
          disabled
          valueLabelDisplay={webMed ? 'off' : 'off'}
          value={studentTotal}
          aria-label="Disabled slider"
          valueLabelFormat={formatCurrency(studentTotal)}
        />
      </Stack>
    </Stack>
  );
};

export default StudentCard;