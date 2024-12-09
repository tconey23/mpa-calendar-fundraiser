import { useEffect, useState } from 'react';
import { Box, Button, FormControl, OutlinedInput, Stack, TextField, Tooltip, Typography } from '@mui/material';
import Calendar from './Calendar';
import { studentDates } from '../business/getStudents';

const StudentPage = ({selectedStudent, students}) => {
    const [disabledDates, setDisabledDates] = useState()
    const [selectedDate, setSelectedDate] = useState()

    const getStudentDates = async () => {
        let dates = await studentDates(selectedStudent)
        if(dates && dates.dates){
            setDisabledDates(Object.entries(dates.dates))
        } else {
            setDisabledDates([])
        }
    }

    useEffect(() => {
        getStudentDates()
        setSelectedDate(null)
    }, [selectedStudent])

  return (
    <Stack direction={'column'} justifyContent={'flex-start'} alignItems={'center'} sx={{ height: '75vh', width: '100vw', backgroundColor: 'white'}} padding={5}>
        <Stack>
            <Typography color={'black'} variant='h3'>{selectedStudent}</Typography>
        </Stack>
        <Stack direction={'row'} justifyContent={'flex-start'} alignItems={'center'} sx={{ height: '98%', width: '75%', backgroundColor: 'white'}} padding={2}>
            <Stack direction={'column'} justifyContent={'flex-start'} alignItems={'center'} sx={{ height: '98%', width: '50%', backgroundColor: 'white'}}>
                <Box display={'flex'} flexDirection={'column'}>
                    <i className="fi fi-ss-circle" style={{color: 'green'}}> Reserved</i> 
                    <i className="fi fi-ss-circle" style={{color:'rgb(1 99 196)'}}> Today</i>
                </Box>
                <Calendar disabledDates={disabledDates} setSelectedDate={setSelectedDate}/>
            </Stack>
            <Stack direction={'column'} justifyContent={'flex-start'} alignItems={'center'} sx={{ height: '98%', width: '50%', backgroundColor: 'white'}}>
                {selectedDate && 
                    <>
                        <Typography key={selectedDate.date} variant='h4'>{selectedDate.date}</Typography>
                        {selectedDate.reserved ?
                            <>
                                <Typography padding={1} variant='h5'>{selectedDate.reserved.name}</Typography>
                                <Typography padding={1} variant='h6'>{selectedDate.reserved.message}</Typography>
                            </>
                            :
                        <FormControl sx={{ width: '100%' }}>
                            <Box padding={2}>
                                <OutlinedInput placeholder='Your name'/>
                            </Box>
                            <Box padding={2}>
                                <TextField sx={{height: '100%', width: '100%'}} fullWidth multiline placeholder='Your Message' maxRows={4}/>
                            </Box>
                        </FormControl>
                        }
                        <Tooltip title={selectedDate.reserved ? 'This date has already been reserved' : ''}>
                            <Box padding={2}>
                                <Button disabled={selectedDate.reserved} variant="contained">Reserve</Button>
                            </Box>
                        </Tooltip>
                    </>
                }
            </Stack>
        </Stack>

    </Stack>
  );
};

export default StudentPage;