import Logo from '../images/logo.png'
import Button from '@mui/material/Button';
import {Link} from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles';
export default function SplashScreen() {
    const theme = createTheme({
        palette: {
            primary: {
                main: '#000000'
            }
        }
    })

    return (
        <div id="splash-screen">
            <img src={Logo} alt="" id="splash-logo"/>
            <h1 id="welcome-listeners"> Welcome Listeners!</h1>
            <div id="welcome-text"> Playlister is an app designed for all your music needs. Create, edit, and publish
            your own playlists so that you can share your favorite songs with friends and people 
            around the world. Sign up today for free!</div>
            <div id="app-author-text"> App by Jonathan Ng </div>
            <div id="splash-buttons-container">
                <ThemeProvider theme={theme}>
                    <Button variant="contained" color="primary" className="splash-button"> <Link to="/login"  className="link"> Login </Link></Button>
                    <Button variant="contained" color="primary" className="splash-button"> <Link to="/register"  className="link"> Register </Link></Button>
                    <Button variant="contained" color="primary" className="splash-button"> <Link to="/playlister/all"  className="link"> Continue As Guest </Link> </Button>
                </ThemeProvider>
            </div>
        </div>
    )
}