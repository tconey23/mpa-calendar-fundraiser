import { useEffect, useState } from 'react';
import { Box, Button, FormControl, OutlinedInput, Stack, TextField, Tooltip, Typography, Alert, Checkbox } from '@mui/material';
import Calendar from './Calendar';
import { studentDates, addStudentDate } from '../business/apiCalls';
import dayjs from 'dayjs';
import Paypal from './Paypal';
import {Avatar} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery'

const hashDate = (date) => dayjs(date).format('MMDDYYYYhhhhmmssms')

const DonationForm = ({selectedDate, selectedStudent, setRefreshTrigger, setSelectedDate, setSuccess}) => {
    const [transactionStatus, setTransactionStatus] = useState(null)
    const [toggleName, setToggleName] = useState(false)
    const [toggleMessage, setToggleMessage] = useState(false)
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
    const [donateAmount, setDonateAmount] = useState('$0.00')
    const [orderId, setOrderId] = useState(null)

    const formatDate = (date) => dayjs(date).format('DD')

    const webMed = useMediaQuery('(min-width:900px)')

    useEffect(() => {
      if (selectedDate) {
        // console.log(selectedDate);
        setTransactionStatus(null);
        
        let dateNum = formatDate(new Date(selectedDate.date.replace(/-/g, '/')));
    
        setDonateAmount(dateNum);
      }
    }, [selectedDate]);

    useEffect(() => {
      console.log(parseFloat(donateAmount).toFixed(2))
      console.log(`$${parseFloat(donateAmount).toFixed(2)}`)
    }, [donateAmount])


    const nameRequired = () => {

        if(toggleName && name) {
          return true
        }
    
        if(!toggleName){
          return true
        }
    
        return false
    
      }
    
      const messageRequired = () => {
    
        if(toggleMessage && message) {
          return true
        }
    
        if(!toggleMessage){
          return true
        } 
    
        return false
      }

      const handleAddDate = async () => {
        const reservation = {
          date: {
            [selectedDate.date]: {
              reserved: true,
              message,
              name,
              dollarAmount: `$${parseFloat(donateAmount).toFixed(2)}`
            },
          },
          student: selectedStudent,
        };

        console.log(reservation)
    
        await addStudentDate(reservation);
        resetData();
      };

      const resetData = () => {
        setRefreshTrigger((prev) => prev + 1);
        setSuccess(true)
      };

            useEffect(() => {
      
              let student = selectedStudent?.replace(' ', '').toLowerCase()
      
              let donor
              name ? donor = name.replace(' ', '').toLowerCase() : donor = 'Anon'
      
              let idNum = hashDate(Date.now())
              setOrderId(`${donor}:${student}:${idNum}`)
            }, [selectedStudent, name, message])


  return (
    <Stack justifyContent={'center'} alignItems={'center'}>

            {!transactionStatus && <Button sx={{scale: webMed ? 1 : 0.75}} variant='contained' onClick={() => setSelectedDate(null)}>Clear Selected Date</Button>
}
            <Typography key={selectedDate.date} variant={webMed ? 'h4' : 'h6'}>
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
                  <Box display={'flex'} sx={{flexDirection: 'row', alignItems: 'center'}} padding={2}>
                    <Checkbox onChange={() => setToggleName(prev => !prev)}/>
                    {toggleName ? <TextField
                      label='Your name'
                      required
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                    /> :
                    <Typography>Include Name?</Typography>
                  }
                  </Box>
                  <Box display={'flex'} sx={{flexDirection: 'row', alignItems: 'center'}} padding={2}>
                    <Checkbox onChange={() => setToggleMessage(prev => !prev)}/> 
                    {toggleMessage ? 
                    
                    <TextField
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      sx={{ width: '100%' }}
                      required
                      fullWidth
                      multiline
                      label="Your Message"
                      maxRows={4}
                    /> : 
                    <Typography>Include Message?</Typography>
                  } 
                  </Box>
                  <Box padding={2}>
                    <TextField
                      value={`$${parseFloat(donateAmount).toFixed(2)}`}
                      disabled
                      placeholder="Donation Amount"
                      maxRows={4}
                    />
                  </Box>
                {!transactionStatus && nameRequired() && messageRequired() &&
                    <Paypal setTransactionStatus={setTransactionStatus} donateAmount={donateAmount} orderId={orderId}/>
                }
                {transactionStatus === 'COMPLETED' && nameRequired() && messageRequired() && <Alert severity='success'>
                    <Typography>{`Thank you for supporting ${selectedStudent} and Montessori Peaks Academy!`}</Typography>
                    <Typography>Please proceed with your reservation</Typography>
                </Alert>
                }
                {/* {transactionStatus !== 'COMPLETED' && nameRequired() && messageRequired() && <Alert severity='error'>
                    <Typography>{`We're sorry there was an error in your request. Your payment could not be completed`}</Typography>
                </Alert>
                } */}
                
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
    </Stack>
  );
};

export default DonationForm;