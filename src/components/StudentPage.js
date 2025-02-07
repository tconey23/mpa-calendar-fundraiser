import { useEffect, useState } from 'react';
import { Box, Button, FormControl, OutlinedInput, Stack, TextField, Tooltip, Typography, Alert, InputLabel } from '@mui/material';
import Calendar from './Calendar';
import { studentDates, addStudentDate } from '../business/apiCalls';
import dayjs from 'dayjs';
import Paypal from './Paypal';
import {Avatar} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery'

const StudentPage = ({ selectedStudent }) => {
  const [disabledDates, setDisabledDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [donateAmount, setDonateAmount] = useState('$0.00')
  const [transactionStatus, setTransactionStatus] = useState(null)
  const [isReserving, setIsReserving] = useState(true)

  const webMed = useMediaQuery('(min-width:900px)')

  const formatDate = (date) => dayjs(date).format('DD')

  const getStudentDates = async () => {
    const dates = await studentDates(selectedStudent);
    if (dates?.dates) {
      setDisabledDates(Object.entries(dates.dates));
    } else {
      setDisabledDates([]);
    }
  };

  const resetData = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleAddDate = async () => {
    const reservation = {
      date: {
        [selectedDate.date]: {
          reserved: true,
          message,
          name,
          dollarAmount: donateAmount
        },
      },
      student: selectedStudent,
    };

    await addStudentDate(reservation);
    resetData();
  };

  useEffect(() => {
    getStudentDates();
    setSelectedDate(null);
  }, [selectedStudent, refreshTrigger]);

  useEffect(() => {
    if(selectedDate){
        setTransactionStatus(null)
      let dateNum = formatDate(new Date(selectedDate.date))
      dateNum[0] == 0 ? setDonateAmount(`${dateNum[1]}`) : setDonateAmount(`${dateNum}`)
    }
  }, [selectedDate])

  useEffect(() => {
    if(isReserving){
        setTimeout(() => {
            setIsReserving(false)
        }, 2000);
    }
  }, [isReserving])

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
        <Box sx={{display: 'flex'}}>
            <Avatar>{selectedStudent[0]}</Avatar>
            <Typography sx={{textDecoration: 'underline', marginBottom: 2, fontSize: 'clamp(10px, 5vw, 50px)', marginLeft: 1}} color="text.secondary" variant="h3">
                {selectedStudent}
            </Typography>
        </Box>

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
          {selectedDate && (
            <>
              <Typography key={selectedDate.date} variant="h4">
                {selectedDate.date}
              </Typography>

              {selectedDate.reserved ? (
                <>
                  <Typography padding={1} variant="h5">
                    Reserved by: {selectedDate.reserved.name}
                  </Typography>
                  <Typography padding={1} variant="h6">
                    Message: {selectedDate.reserved.message}
                  </Typography>
                </>
              ) : (
                <FormControl sx={{ width: '100%' }}>
                  <Box padding={2}>
                    <TextField
                      label='Your name'
                      required
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                    />
                  </Box>
                  <Box padding={2}>
                    <TextField
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      sx={{ width: '100%' }}
                      required
                      fullWidth
                      multiline
                      label="Your Message"
                      maxRows={4}
                    />
                  </Box>
                  <Box padding={2}>
                    <TextField
                      value={`$${donateAmount}.00`}
                      disabled
                      placeholder="Donation Amount"
                      maxRows={4}
                    />
                  </Box>
                {!transactionStatus && message && name &&
                    <Paypal setTransactionStatus={setTransactionStatus} donateAmount={donateAmount}/>
                }
                {transactionStatus === 'COMPLETED' && message && name && <Alert severity='success'>
                    <Typography>{`Thank you for supporting ${selectedStudent} and Montessori Peaks Academy!`}</Typography>
                    <Typography>Please proceed with your reservation</Typography>
                </Alert>
                }
                {transactionStatus !== 'COMPLETED' && message && name && <Alert severity='error'>
                    <Typography>{`We're sorry there was an error in your request. Your payment could not be completed`}</Typography>
                </Alert>
                }
                
                </FormControl>
              )}

              <Tooltip title={selectedDate.reserved ? 'This date has already been reserved' : ''}>
                <Box padding={2}>
                  {transactionStatus === 'COMPLETED' && <Button
                    onClick={handleAddDate}
                    disabled={selectedDate.reserved}
                    variant="contained"
                  >
                    Reserve
                  </Button>}
                </Box>
              </Tooltip>
            </>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default StudentPage;
