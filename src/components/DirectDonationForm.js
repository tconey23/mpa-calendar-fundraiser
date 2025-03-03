import { useEffect, useState } from 'react';
import { Box, Button, FormControl, OutlinedInput, Stack, TextField, Tooltip, Typography, Alert, Checkbox } from '@mui/material';
import Calendar from './Calendar';
import { studentDates, addStudentDate } from '../business/apiCalls';
import dayjs from 'dayjs';
import Paypal from './Paypal';
import {Avatar} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery'
import SuccessAlert from './SuccessAlert';

const formatToUSD = (num) => new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
}).format(num);

const DirectDonationForm = ({selectedDate, selectedStudent, setRefreshTrigger, setSelectedDate, setDonationType, setSuccess}) => {
    const [transactionStatus, setTransactionStatus] = useState(null)
    const [toggleName, setToggleName] = useState(false)
    const [toggleMessage, setToggleMessage] = useState(false)
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
    const [donateAmount, setDonateAmount] = useState(null)
    const [rawDonateAmount, setRawDonateAmount] = useState(null)
    const [isReady, setIsReady] = useState(false)
    
    const webMed = useMediaQuery('(min-width:900px)')

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

      const resetData = () => {
        setDonateAmount(null)
        setDonationType('date')
        setSuccess(true)
      };

      const handleAddDate = async () => {

        const formatDate = (date) => dayjs(date).format('MM-DD-YYYY:hhhhmmssms')
        let now = formatDate(Date.now())

        const reservation = {
          date: {
            [now]: {
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

      const handleChange = (e) => {
        const rawValue = e.target.value.replace(/[^0-9.]/g, "");
        setIsReady(false)
        setDonateAmount(rawValue);
      };
    
      const handleBlur = () => {
        let checkCurrency = donateAmount.includes('$')
        console.log(checkCurrency)
        if (donateAmount !== "" && !checkCurrency) {
          setDonateAmount(formatToUSD(parseFloat(donateAmount)));
        }
      };

      useEffect(() => {

        let val

        if(donateAmount){
          val = parseFloat(donateAmount.replace('$', '').replace(',', ''))
        } else {
          val = 0
        }

        console.log(typeof val.toString(), val.toString())

        setRawDonateAmount(val.toString())
      }, [donateAmount])

      const cancelDirectDonate = () => {
        setDonationType('date')
        setRawDonateAmount(null)
        setDonateAmount(null)
      }

  return (
    <Stack sx={{scale: webMed ? 1 : 0.75}}>
              <Typography variant="h6">
                Custom Donation Amount
              </Typography>

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
                      disabled={transactionStatus}
                      value={donateAmount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter amount"
                      fullWidth
                    />
                    {!transactionStatus &&
                    <Stack padding={2} sx={{scale: webMed ? 1 : 0.75}}>
                      {donateAmount && <Button sx={{marginBottom: 1}} onClick={() => setIsReady(true)} variant='contained'>Confirm Amount</Button>}
                      <Button onClick={() => cancelDirectDonate()} variant='contained'>Cancel</Button>
                    </Stack>
                    }
                  </Box>
                {!transactionStatus && nameRequired() && messageRequired() && rawDonateAmount && isReady &&
                    <Paypal setTransactionStatus={setTransactionStatus} donateAmount={rawDonateAmount}/>
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

                <Box padding={2}>
                  {transactionStatus === 'COMPLETED' && <Button
                    onClick={handleAddDate}
                    
                    variant="contained"
                  >
                    Complete
                  </Button>}
                </Box>
    </Stack>
  );
};

export default DirectDonationForm;