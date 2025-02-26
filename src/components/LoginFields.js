import { useEffect, useState } from 'react';
import { Stack, Box, Button, Typography } from '@mui/material';
import { studentCredentials } from '../business/apiCalls';
import TextField from '@mui/material/TextField';
import { child } from 'firebase/database';
import MediaDisplay from './MediaDisplay';


const LoginFields = ({setLoggedIn, loggedIn, setSelectedStudent}) => {

    const [childFirst, setChildFirst] = useState(null)
    const [childLast, setChildLast] = useState(null)
    const [errorFields, setErrorFields] = useState([])
    const [password, setPassword] = useState(null)
    const [username, setUserName] = useState(null)
    const [errors, setErrors] = useState([])
    const [toggleError, setToggleError] = useState(null)
    

    const checkString = async (str) => /[^a-zA-Z0-9]/.test(str);

    const validateEntry = async (str, fld, id) => {
        const val = await checkString(str)
        if(val) {
            setErrors(prev => [
                ...prev,
                `${fld} contains invalid characters, symbols or spaces`
            ])
            setErrorFields(prev => [
                ...prev,
                id
            ])
        }
    }

    const checkCredentials = async () => {

        const loginReq = await studentCredentials(password, username)
        if(loginReq) {
            setLoggedIn(true)
            setSelectedStudent(`${childFirst} ${childLast}`)
        } else {
            setToggleError('That combination does not exist. Please try again')
        }

    }

    const enterPressed = (event) => {
        if(event.key === 'Enter'){
            setUserName(`${childFirst}${childLast}`)
        }        
    }



    useEffect(() => {

        setErrors([])
        setToggleError('')
        setErrorFields([])

        if(childFirst){
            validateEntry(childFirst, "Child's first name", 'first')
        }

        if(childLast){
            validateEntry(childLast, "Child's last name", 'last')
        }

        if(password){
            validateEntry(password, "Teacher's last name", 'password')
        }

        if(password && username){
            console.log(password, username)
            checkCredentials()
        }

    }, [childFirst, childLast, password, username])
    
  return (
    <Stack direction={'column'} sx={{ height: '79vh', width: '98vw', borderColor:'white', borderStyle: 'solid', borderWidth: '1px'}} paddingTop={3} justifyContent={'flex-start'} alignItems={'center'}>
        <Stack direction={'column'} sx={{padding: 1, borderColor:'white', borderStyle: 'solid', borderWidth: '1px'}} width={1000} justifyContent={'center'} alignItems={'center'}>
            <Typography>Enter your child's <i>full</i> first and last name, as well as the last name of their <i>lead</i> teacher</Typography>
            <i>
                <Typography >**Do not include any spaces or symbols (hyphen, apostrophe etc.)**</Typography>
            </i>
            <Box
            component="form"
            sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
            noValidate
            autoComplete="off"
            >
            <TextField
                error={errorFields.includes('first') ? true : false}
                id="first"
                label="Child First Name"
                value={childFirst}
                onKeyDown={enterPressed}
                onChange={(event) => {
                    setChildFirst(event.target.value.toLowerCase());
                }}
                />
            <TextField
                error={errorFields.includes('last') ? true : false}
                id="last"
                label="Child Last Name"
                value={childLast}
                onKeyDown={enterPressed}
                onChange={(event) => {
                    setChildLast(event.target.value.toLowerCase());
                }}
                />
            <TextField
                error={errorFields.includes('password') ? true : false}
                id="password"
                label="Teacher Last Name"
                value={password}
                onKeyDown={enterPressed}
                onChange={(event) => {
                    setPassword(event.target.value.toLowerCase());
                }}
                />
            </Box>
            <Stack sx={{overflow: 'auto', height: '50px'}}> 
                {errors && errors.map((e) => (
                        <Typography color={'red'}>{e}</Typography>
                    ))}
            </Stack>
            <Button
            variant="contained"
                onClick={() => setUserName(`${childFirst}${childLast}`)}
                >Submit</Button>
                {toggleError && 
                    <Typography color={'red'}>{toggleError}</Typography>
                }
            </Stack>
            <MediaDisplay />
    </Stack>
  );
};

export default LoginFields;