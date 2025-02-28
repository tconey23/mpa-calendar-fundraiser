import { useEffect, useState } from 'react';
import { Box, Button, FormControl, OutlinedInput, Stack, TextField, Tooltip, Typography, Alert, Checkbox } from '@mui/material';
import Calendar from './Calendar';
import { studentDates, addStudentDate } from '../business/apiCalls';
import dayjs from 'dayjs';
import Paypal from './Paypal';
import {Avatar} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery'
import DonationForm from './DonationForm';
import DirectDonationForm from './DirectDonationForm';
import SuccessAlert from './SuccessAlert';

const StudentPage = ({ selectedStudent, setSelectedStudent, setLoggedIn }) => { 
  const [disabledDates, setDisabledDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isReserving, setIsReserving] = useState(false)
  const [donationType, setDonationType] = useState('date')
  const [success, setSuccess] = useState(false)
  

  const webMed = useMediaQuery('(min-width:900px)')


  const getStudentDates = async () => {
    const dates = await studentDates(selectedStudent);
    if (dates?.dates) {
      setDisabledDates(Object.entries(dates.dates));
    } else {
      setDisabledDates([]);
    }
  };



  useEffect(() => {
    getStudentDates();
    setSelectedDate(null);
  }, [selectedStudent, refreshTrigger]);

 

  useEffect(() => {
    if(isReserving){
        setTimeout(() => {
            setIsReserving(false)
        }, 2000);
    }
  }, [isReserving])

  const logOut = () => {

    setSelectedStudent(null)
    setLoggedIn(false)

  }

  const upperCaseName = (str) =>{
    return str.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
  }

  useEffect(() => {
    if(success) {
      setTimeout(() => {
        setSuccess(false)
      }, 3000);
    }
  }, [success])

  return (
    <Stack
      direction='column'
      justifyContent={webMed ? 'center' : 'flex_start'}
      alignItems="center"
      sx={{
        height: '75vh',
        width: '75vw',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 5,
      }}
      borderColor="primary.contrastText"
      padding={5}
    >
      <Stack direction={'row'} width={'100%'}>
        <Stack justifySelf={'flex-start'}>
          <Button variant="contained" onClick={() => logOut()}>Back</Button>
        </Stack>
      </Stack>
      <Stack direction={'row'}>
        <Box sx={{display: 'flex'}}>
            <Avatar>{selectedStudent[0]}</Avatar>
            <Typography sx={{textDecoration: 'underline', marginBottom: 2, fontSize: 'clamp(10px, 5vw, 50px)', marginLeft: 1}} color="text.secondary" variant="h3">
                {upperCaseName(selectedStudent)}
            </Typography>
        </Box>
      </Stack>

      <Stack
        direction={webMed ? 'row' : 'column'}
        justifyContent="flex-start"
        alignItems="center"
        sx={{ height: '98%', width: '100%', overflowY: 'scroll', boxShadow: 'inset 0px 0px 16px 0px #00000042'}}
        padding={2}
      >
        <Stack sx={{minHeight: '50px'}}>
            {isReserving && <Alert severity='success'>Your date has been reserved!</Alert>}
        </Stack>
        
        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
          sx={{ height: '98%', width: webMed ? '50%' : '100%' }}
        >
          <Box display="flex" flexDirection={webMed ? 'column' : 'row'} paddingBottom={0}>
            <i className="fi fi-ss-circle" style={{ color: 'green', marginRight: 30}}> Reserved</i>
            <i className="fi fi-ss-circle" style={{ color: 'rgb(1 99 196)' }}> Today</i>
          </Box>
          <Stack justifyContent={'center'} alignItems={'center'} sx={{height: webMed ? '100%' : '100%', width: '100%'}}>
            <Calendar
                disabledDates={disabledDates}
                setSelectedDate={setSelectedDate}
            />
          </Stack>
        </Stack>

        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
          sx={{ height: '98%', width: webMed ? '50%' : '100%'}}
        >

          {!success && !selectedDate && donationType === 'date' &&
            <Stack height={'100%'} width={'75%'} justifyContent={'center'} alignItems={'center'}>
              <Typography textAlign={'center'} sx={{marginBottom: 2}}>{`To donate, select a date from the calendar.`}</Typography>
              <Typography textAlign={'center'} sx={{marginBottom: 2}}>{`The selected date will reflect the donation amount. A donation for the 1st will be $1 and a donation for the 2nd will be $2 etc.`}</Typography>
              <Typography textAlign={'center'} sx={{marginBottom: 2}}>
                {`If the date you want is already reserved, no worries! You can enter a custom donation amount by clicking:`}
                  <br></br>
                  <Button onClick={() => setDonationType('direct')} variant='contained'>HERE</Button>
                </Typography>
            </Stack>
          }

          {!success && !selectedDate && donationType === 'direct' && 
            <DirectDonationForm setSuccess={setSuccess} setSelectedDate={setSelectedDate} selectedDate={selectedDate} selectedStudent={selectedStudent} setRefreshTrigger={setRefreshTrigger} setDonationType={setDonationType}/>
          }


          {!success && selectedDate && donationType === 'date' &&(
           <DonationForm setSuccess={setSuccess} setSelectedDate={setSelectedDate} selectedDate={selectedDate} selectedStudent={selectedStudent} setRefreshTrigger={setRefreshTrigger} setDonationType={setDonationType}/>
          )}


          {success && 
            <Stack width={'100%'} height={'100%'} sx={{opacity: 1, transition: 'opacity 2s ease-in-out'}}>
              <SuccessAlert />
            </Stack>
          }


        </Stack>
      </Stack>
    </Stack>
  );
};

export default StudentPage;
