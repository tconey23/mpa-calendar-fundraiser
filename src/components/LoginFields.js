import { useEffect, useState } from 'react';
import { Stack, Box, Button, Typography } from '@mui/material';
import { studentCredentials, debugUsers } from '../business/apiCalls';
import TextField from '@mui/material/TextField';
import MediaDisplay from './MediaDisplay';
import useMediaQuery from '@mui/material/useMediaQuery'



const LoginFields = ({setLoggedIn, loggedIn, setSelectedStudent}) => {

    const [childFirst, setChildFirst] = useState('')
    const [childLast, setChildLast] = useState('')
    const [password, setPassword] = useState('')
    const [errorFields, setErrorFields] = useState([])
    const [username, setUserName] = useState(null)
    const [errors, setErrors] = useState([])
    const [toggleError, setToggleError] = useState(null)
    const [debugLogin] = useState(false)
    

    const checkString = async (str) => /[^a-zA-Z0-9]/.test(str);
    const webMed = useMediaQuery('(min-width:900px)')
    const webSml = useMediaQuery('(max-width:232px )')

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
        debugLogin && debugUsers()
    }, [debugLogin])



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
            // console.log(password, username)
            checkCredentials()
        }

    }, [childFirst, childLast, password, username, webSml])
    
  return (
    <Stack direction={'column'} sx={{ height: '79vh', width: '100%', borderColor:'white', borderStyle: 'solid', borderWidth: '1px', overflow: webMed ? 'hidden' : 'auto'}} paddingTop={3} justifyContent={'flex-start'} alignItems={'center'}>
        <Stack direction={'column'} sx={{scale: webMed? 1 : 0.75, padding: 1, borderColor:'white', borderStyle: 'solid', borderWidth: '1px'}} width={webMed ? "90vw" : "98vw"} justifyContent={'center'} alignItems={'center'}>
            <Typography textAlign={'center'} fontSize={webMed? 20 : 10}>Enter your child's <i>full</i> first and last name, as well as the last name of their <i>lead</i> teacher</Typography>
            <i>
                <Typography textAlign={'center'} fontSize={webMed? 20 : 10}>**Do not include any spaces or symbols (hyphen, apostrophe etc.)**</Typography>
            </i>
            <Box
            component="form"
            sx={{ '& > :not(style)': { m: 1, width: webSml ? '90%' : '100%'}, display: 'flex', flexDirection: webMed ? 'row': 'column'}}
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
                {toggleError && 
                    <Typography color={'red'}>{toggleError}</Typography>
                }
            </Stack>
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