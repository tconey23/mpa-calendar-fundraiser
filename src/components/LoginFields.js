import { useEffect, useState } from 'react';
import { Stack, Box, Button, Typography } from '@mui/material';
import { studentCredentials } from '../business/apiCalls';
import TextField from '@mui/material/TextField';
import { child } from 'firebase/database';
import MediaDisplay from './MediaDisplay';


const LoginFields = ({setLoggedIn, loggedIn, setSelectedStudent}) => {

    const [childFirst, setChildFirst] = useState(null)
    const [childLast, setChildLast] = useState(null)
    const [password, setPassword] = useState(null)
    const [username, setUserName] = useState(null)
    const [toggleError, setToggleError] = useState(false)

    const checkCredentials = async () => {

        const loginReq = await studentCredentials(password, username)
        if(loginReq) {
            setLoggedIn(true)
            setSelectedStudent(`${childFirst} ${childLast}`)
        } else {
            setToggleError(true)
        }

    }

    useEffect(() => {

        if(password && username){
            console.log(password, username)
            checkCredentials()
        }

    }, [childFirst, childLast, password, username])
    
  return (
    <Stack direction={'column'} sx={{ height: '79vh', width: '98vw', borderColor:'white', borderStyle: 'solid', borderWidth: '1px'}} paddingTop={3} justifyContent={'flex-start'} alignItems={'center'}>
        <Stack direction={'column'} sx={{padding: 1, borderColor:'white', borderStyle: 'solid', borderWidth: '1px'}} width={1000} justifyContent={'center'} alignItems={'center'}>
            <Typography>Enter your child's first and last name, as well as the last name of their primary teacher</Typography>
            <Typography>Name's should not include any spaces or symbols (hyphen, apostrophe etc.)</Typography>
            <Box
            component="form"
            sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
            noValidate
            autoComplete="off"
            >
            <TextField
                id="outlined-controlled"
                label="Child First Name"
                value={childFirst}
                onChange={(event) => {
                    setChildFirst(event.target.value.toLowerCase());
                }}
                />
            <TextField
                id="outlined-controlled"
                label="Child Last Name"
                value={childLast}
                onChange={(event) => {
                    setChildLast(event.target.value.toLowerCase());
                }}
                />
            <TextField
                id="outlined-controlled"
                label="Teacher Last Name"
                value={password}
                onChange={(event) => {
                    setPassword(event.target.value.toLowerCase());
                }}
                />
            </Box>
            <Button
            variant="contained"
                onClick={() => setUserName(`${childFirst}${childLast}`)}
                >Submit</Button>
            </Stack>
            <MediaDisplay />
    </Stack>
  );
};

export default LoginFields;