import { useContext, useState} from 'react';
import AuthContext from '../auth'
import { useHistory } from 'react-router-dom'
import Copyright from './Copyright'

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Alert from '@mui/material/Alert';
import { AlertTitle } from '@mui/material';


export default function LoginScreen() {
    const { auth } = useContext(AuthContext);
    const history = useHistory()

    const [successfulLogin, setSuccessfulLogin] = useState(null)
    const [errorMessage, setErrorMessage] = useState("")

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        let {success, errorMessage} = await auth.loginUser(
            formData.get('email'),
            formData.get('password')
        );

        if (success) {
            history.push("/playlister");
            return
        }
        setSuccessfulLogin(success)

        if (errorMessage) {
            setErrorMessage(errorMessage)
        }

    };
    const handleCloseLoginError = (event) => {
        setSuccessfulLogin(null)
    }

    //            <Grid
    //             item
    //             xs={false}
    //             sm={4}
    //             md={7}
    //             sx={{
    //                 backgroundImage: 'url(https://source.unsplash.com/random)',
    //                 backgroundRepeat: 'no-repeat',
    //                 backgroundColor: (t) =>
    //                     t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
    //                 backgroundSize: 'cover',
    //                 backgroundPosition: 'center',
    //             }}
    //         />
    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            <CssBaseline />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link href="/register" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                        <Copyright sx={{ mt: 5 }} />
                    </Box>
                </Box>
                <Modal
                        open={successfulLogin === null ? false: !successfulLogin}   
                    >
                        <Grid container justifyContent="center">
                            <Grid item>
                                <Alert severity="warning">
                                    <AlertTitle> Invalid Info </AlertTitle>
                                    <p style={{padding: "10px"}}>
                                        {errorMessage}
                                    </p>
                                    <Button variant="outlined" color="error" onClick={handleCloseLoginError}> Close </Button>

                                </Alert>
                                
                            </Grid>
                        </Grid>
                </Modal>
            </Grid>
        </Grid>
    );
}