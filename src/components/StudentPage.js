import { useEffect, useState } from 'react';
import { Box, Button, Stack, Typography, Alert, Accordion, AccordionSummary, AccordionDetails} from '@mui/material';
import Calendar from './Calendar';
import { studentDates, fetchStudentDetail } from '../business/apiCalls';
import useMediaQuery from '@mui/material/useMediaQuery'
import DonationForm from './DonationForm';
import DirectDonationForm from './DirectDonationForm';
import SuccessAlert from './SuccessAlert';
import {useTheme} from '@mui/material';

const StudentPage = ({ selectedStudent, setSelectedStudent, setLoggedIn, isDarkMode }) => { 
  const [disabledDates, setDisabledDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isReserving, setIsReserving] = useState(false)
  const [donationType, setDonationType] = useState('date')
  const [success, setSuccess] = useState(false)
  const [displayCalendar, setDisplayCalendar] = useState(true)
  const [reservedDates, setReservedDates] = useState([])
  const [totalRaised, setTotalRaised] = useState('0')
  const [isHover, setIsHover] = useState(null)

  const theme = useTheme()
  

  const webMed = useMediaQuery('(min-width:900px)')

  const getStudentDates = async () => {
    console.clear()
    const dates = await studentDates(selectedStudent);
    if (dates?.dates) {
      setDisabledDates(Object.entries(dates.dates));
    } else {
      setDisabledDates([]);
    }
  };

  const getReserved = async () => {
    try {
        const res = await fetchStudentDetail(selectedStudent)
        
        if(res && res[0] !== "N") {
          console.log(res)
          
          res.forEach((dt) => {
            setReservedDates(prev => [
              ...prev,
              dt
            ])
          })
          
          const total = res.reduce((acc, dt) => {
            return acc + parseFloat(dt.dollarAmount.replace('$', ''));
          }, 0);
          
          setTotalRaised(`$${parseInt(total).toFixed(2)}`) 
          
          setReservedDates(res)
        }
    } catch (error) {
        console.log(error);
    }
  }

  useEffect(() => {
    if(!webMed && donationType === 'direct'){
      setDisplayCalendar(false)
    }

    if(!webMed && donationType === 'date'){
      setDisplayCalendar(true)
    }
  }, [donationType, webMed])


  useEffect(() => {
    getStudentDates();
    setSelectedDate(null);
    getReserved()
  }, [selectedStudent, refreshTrigger]);


  useEffect(() => {
    if(selectedDate && donationType === 'direct'){
      setDonationType('date')
    }
  }, [selectedDate])
 

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
      }, 4000);
    }
  }, [success])

  return (
    <Stack
      direction='column'
      justifyContent={webMed ? 'flex_start' : 'flex_start'}
      alignItems="center"
      sx={{
        height: '75vh',
        width: '75vw',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 5,
        overflowY: webMed ? 'auto' : 'scroll',
        overflowX : 'hidden'
      }}
      borderColor="primary.contrastText"
      paddingLeft={2}
      paddingRight={2}
    >

      <Stack direction={webMed ? 'row' : 'column'} width={'100%'} justifyContent={'flex-start'}>
        <Stack justifySelf={webMed ? 'center' : 'flex_start'} paddingBottom={1}>
          <Button sx={{scale: webMed ? 1 : 0.5, margin: 2}} variant="contained" onClick={() => logOut()}>Back</Button>
        </Stack>
      </Stack>

      <Stack direction={'column'} width={'80%'} alignItems={'center'}>
        <Box sx={{display: 'flex'}}>
            <Typography sx={{textDecoration: 'underline', marginBottom: 2, fontSize: webMed ? 40 : 20, marginLeft: 1}} color="text.secondary" variant="h3">
                {upperCaseName(selectedStudent)}
            </Typography>
        </Box>
        <Stack width={'100%'} margin={2} position={'relative'}>
          <Accordion sx={{width: "100%", background: theme.palette.primary.main, maxHeight: '250px'}}>
              <AccordionSummary
              expandIcon={null}
              aria-controls="panel1-content"
              id="panel1-header"
              fontSize={'clamp(10px, 2vw, 20px)'}
            >
              <Typography fontSize={'100%'}>
                {totalRaised && `Total Raised: ${totalRaised}`}
              </Typography>
            </AccordionSummary>
            <Stack fontSize={'clamp(10px, 2vw, 20px)'} direction={'row'} justifyContent={'space-around'} width={'90%'}>
              <Box width={'33%'}>
                <Typography fontSize={'100%'} justifySelf={'center'} width={'100%'} textAlign={'center'}>From:</Typography>
              </Box>
              <Box width={'33%'}>
                <Typography fontSize={'100%'} justifySelf={'center'} width={'100%'} textAlign={'center'}>Message:</Typography> 
              </Box>
              <Box width={'33%'}>
                <Typography fontSize={'100%'} justifySelf={'center'} width={'100%'} textAlign={'center'}>Amount:</Typography>
              </Box>
            </Stack>
            <Stack overflow={'auto'} height={'100px'}>
            {reservedDates && reservedDates.map((dt, i) => { 
              return (
                <AccordionDetails key={i} onMouseOver={() => setIsHover(i)} onMouseOut={() => setIsHover(null)} sx={{marginBottom: '0px', width: '100%'}}>
                <Stack borderRadius={20} width={'100%'} fontSize={'clamp(5px, 2vw, 20px)'} direction={'row'} justifyContent={'space-around'} border={isHover !== i ? '1px solid black' : 'none'} 
                sx={{
                  background: isHover === i ? theme.palette.primary.avatar : theme.palette.primary.main,
                  boxShadow: isHover === i ? '1px 3px 8px 1px #00000070' : 'none'
                }}
                >
                <Box sx={{ display: "flex", flexWrap: "wrap"}} width={'33%'} borderRight={'1px solid grey'} margin={1}>
                  <Typography sx={{
                    width: '95%',
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2, // Limits to 2 lines
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    textAlign: 'center'
                  }} fontSize={'100%'} justifySelf={'center'} color={theme.palette.text.avatar}>{dt.name}</Typography>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap"}} width={'33%'} borderRight={'1px solid grey'} margin={1}>
                  <Typography sx={{
                    width: '95%',
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2, // Limits to 2 lines
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    textAlign: 'center'
                  }}  fontSize={'100%'} justifySelf={'center'} color={theme.palette.text.avatar}>{`"${dt.message}"`}</Typography>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap"}} width={'33%'} margin={1}>
                  <Typography sx={{
                    width: '90%',
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2, // Limits to 2 lines
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    textAlign: 'center'
                  }}  fontSize={'80%'} justifySelf={'center'} color={theme.palette.text.avatar}>{dt.dollarAmount}</Typography>
                </Box>
                </Stack>
              </AccordionDetails>
            )})}
            </Stack>
          </Accordion>
        </Stack>
      </Stack>

      <Stack
        direction={webMed ? 'row' : 'column-reverse'}
        justifyContent="flex-start"
        alignItems="center"
        sx={{ height: webMed ? '98%' : '200%', boxShadow: 'inset 0px 0px 16px 0px #00000042'}}
        width={'100%'}
        padding={2}
      >
        <Stack sx={{minHeight: '50px'}}>
            {isReserving && <Alert severity='success'>Your date has been reserved!</Alert>} 
        </Stack>
        
        {displayCalendar && 
        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
          sx={{ height: '98%', width: webMed ? '50%' : '100%', scale: webMed ? 1 : 0.75}}
        >
          <Box display="flex" flexDirection={webMed ? 'column' : 'row'} paddingBottom={0}>
            <i className="fi fi-ss-circle" style={{ color: 'green', marginRight: 30}}> Reserved</i>
            {/* <i className="fi fi-ss-circle" style={{ color: 'rgb(1 99 196)' }}> Today</i> */}
          </Box>
          
          <Stack justifyContent={'center'} alignItems={'center'} sx={{height: '100%', width: '100%'}}>
            <Calendar
                disabledDates={disabledDates}
                setSelectedDate={setSelectedDate}
            />
          </Stack>
        </Stack>}

        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
          sx={{ height: '98%', width: webMed ? '50%' : '100%', overflow: 'auto'}}
        >

          {!success && !selectedDate && donationType === 'date' &&
            <Stack height={'100%'} width={'75%'} justifyContent={'center'} alignItems={'center'}>
              <Typography fontSize={webMed ? 15 : 10} textAlign={'center'} sx={{marginBottom: 2}}>{`To donate, select a date from the calendar.`}</Typography>
              <Typography fontSize={webMed ? 15 : 10} textAlign={'center'} sx={{marginBottom: 2}}>{`The selected date will reflect the donation amount. A donation for the 1st will be $1 and a donation for the 2nd will be $2 etc.`}</Typography>
              <Typography fontSize={webMed ? 15 : 10} textAlign={'center'} sx={{marginBottom: 2}}>
                {`If the date you want is already reserved, no worries! You can enter a custom donation amount by clicking:`}
                  <br></br>
                  <Button sx={{scale: webMed ? 1 : 0.5}} onClick={() => setDonationType('direct')} variant='contained'>HERE</Button>
                </Typography>
            </Stack>
          }

          {!success && !selectedDate && donationType === 'direct' && 
            <DirectDonationForm setSuccess={setSuccess} setSelectedDate={setSelectedDate} selectedDate={selectedDate} selectedStudent={upperCaseName(selectedStudent)} setRefreshTrigger={setRefreshTrigger} setDonationType={setDonationType}/>
          }


          {!success && selectedDate && donationType === 'date' &&(
           <DonationForm setSuccess={setSuccess} setSelectedDate={setSelectedDate} selectedDate={selectedDate} selectedStudent={upperCaseName(selectedStudent)} setRefreshTrigger={setRefreshTrigger} setDonationType={setDonationType}/>
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
