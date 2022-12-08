import { useContext, useState } from 'react';
import {useHistory} from 'react-router-dom'
import AuthContext from '../auth'
import Copyright from './Copyright'

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Alert from '@mui/material/Alert';
import { AlertTitle } from '@mui/material';

export default function RegisterScreen() {
    const { auth } = useContext(AuthContext);
    const [successfulRegister, setSuccessfulRegister] = useState(null)
    const [errorMessage, setErrorMessage] = useState("")

    const history = useHistory()

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const {success, errorMessage} = await auth.registerUser(
            formData.get('firstName'),
            formData.get('lastName'),
            formData.get('email'),
            formData.get('password'),
            formData.get('passwordVerify'),
            formData.get('userName')
        );
        
        if(success) {
            history.push("/login")
            return

        }

        setSuccessfulRegister(success)


        if (errorMessage) {
            setErrorMessage(errorMessage)
        }
    };

    const handleCloseAccountError = (event) => {
        setSuccessfulRegister(null)
    }

    return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="userName"
                                    label="Username"
                                    name="userName"
                                    autoComplete="uname"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="fname"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="lname"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="passwordVerify"
                                    label="Password Verify"
                                    type="password"
                                    id="passwordVerify"
                                    autoComplete="new-password"
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/login" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                    <Modal
                        open={successfulRegister === null ? false: !successfulRegister}   
                    >
                        <Grid container justifyContent="center">
                            <Grid item>
                                <Alert severity="warning">
                                    <AlertTitle> Invalid Info </AlertTitle>
                                    <p style={{padding: "10px"}}>
                                        {errorMessage}
                                    </p>
                                    <Button variant="outlined" color="error" onClick={handleCloseAccountError}> Close </Button>

                                </Alert>
                                
                            </Grid>
                        </Grid>
                    </Modal>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
    );
}