import { useEffect, useState } from 'react';
import { Box, Button, FormControl, OutlinedInput, Stack, TextField, Tooltip, Typography } from '@mui/material';
import Calendar from './Calendar';
import { studentDates, addStudentDate } from '../business/apiCalls';
import dayjs from 'dayjs';
import Paypal from './Paypal';

const StudentPage = ({ selectedStudent }) => {
  const [disabledDates, setDisabledDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [donateAmount, setDonateAmount] = useState('$0.00')

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
      let dateNum = formatDate(new Date(selectedDate.date))
      dateNum[0] == 0 ? setDonateAmount(`${dateNum[1]}`) : setDonateAmount(`${dateNum}`)
    }
  }, [selectedDate])

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
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
      <Typography color="text.secondary" variant="h3">
        {selectedStudent}
      </Typography>

      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        sx={{ height: '98%', width: '100%' }}
        padding={2}
      >
        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
          sx={{ height: '98%', width: '50%' }}
        >
          <Box display="flex" flexDirection="column" paddingBottom={2}>
            <i className="fi fi-ss-circle" style={{ color: 'green' }}> Reserved</i>
            <i className="fi fi-ss-circle" style={{ color: 'rgb(1 99 196)' }}> Today</i>
          </Box>
          <Calendar
            disabledDates={disabledDates}
            setSelectedDate={setSelectedDate}
          />
        </Stack>

        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
          sx={{ height: '98%', width: '50%', overflowY: 'auto'}}
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
                    <OutlinedInput
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                    />
                  </Box>
                  <Box padding={2}>
                    <TextField
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      sx={{ width: '100%' }}
                      fullWidth
                      multiline
                      placeholder="Your Message"
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
                  <Paypal donateAmount={donateAmount}/>
                </FormControl>
              )}

              <Tooltip title={selectedDate.reserved ? 'This date has already been reserved' : ''}>
                <Box padding={2}>
                  <Button
                    onClick={handleAddDate}
                    disabled={selectedDate.reserved}
                    variant="contained"
                  >
                    Reserve
                  </Button>
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
