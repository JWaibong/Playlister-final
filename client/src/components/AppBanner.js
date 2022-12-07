import { useContext, useState } from 'react';
import { Link } from 'react-router-dom'
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'
import {useHistory} from 'react-router-dom'
import Logo from '../images/logo.png'

import EditToolbar from './EditToolbar'

import AccountCircle from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import TextField from '@mui/material/TextField';
import SortIcon from '@mui/icons-material/Sort';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function AppBanner(props) {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    const {screenType} = props;
    const history = useHistory()
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);


    const [sortByAnchor, setSortByAnchor] = useState(null)
    const isSortByOpen = Boolean(sortByAnchor)

    const handleSortByMenuOpen = event => {
        setSortByAnchor(event.currentTarget)
    }

    const handleSortByClose = event => {
        setSortByAnchor(null)
    }

    const handleSort = () => {
        store.sortBy()
        handleSortByClose()
    }

    let menuId = 'primary-sort-account-menu';
    const sortByMenu = (
        <Menu
            anchorEl={sortByAnchor}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isSortByOpen}
            onClose={handleSortByClose}
            >
            {(screenType !== 2) ?
            <div>
                <MenuItem> Creation Date (Old-New) </MenuItem>
                <MenuItem> Last Edit Date (New-Old) </MenuItem>
                <MenuItem> Name (A-Z) </MenuItem>
            </div>
                :
            <div>
                <MenuItem> Name(A-Z) </MenuItem>
                <MenuItem> Publish Date (Newest) </MenuItem>
                <MenuItem> Listens (High-Low) </MenuItem>
                <MenuItem> Likes (High-Low) </MenuItem>
                <MenuItem> Dislikes (High-Low) </MenuItem>
            </div>
            }


        </Menu>
    )
    //“By
// Creation Date (Old-New)”, “By Last Edit Date (New-Old)”, and “By
// Name (A-Z)”

// or
// Name (A-Z)
// Publish Date (Newest)
// Listens (High-Low)
// Likes (High-Low)
// Dislikes (High-Low)

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        if(store.tps) 
            store.tps.clearAllTransactions();
        handleMenuClose();
        auth.logoutUser();
    }

    menuId = 'primary-search-account-menu';
    const loggedOutMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}><Link to='/login/'>Login</Link></MenuItem>
            <MenuItem onClick={handleMenuClose}><Link to='/register/'>Create New Account</Link></MenuItem>
        </Menu>
    );
    const loggedInMenu = 
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>        

    let editToolbar = "";
    let menu = loggedOutMenu;
    if (auth.loggedIn) {
        menu = loggedInMenu;
        if (store.currentList) {
            editToolbar = <EditToolbar />;
        }
    }
    
    function getAccountMenu(loggedIn) {
        let userInitials = auth.getUserInitials();
        if (loggedIn) 
            return <div>{userInitials}</div>;
        else
            return <AccountCircle />;
    }

    const theme = createTheme({
        palette: {
            primary: {
                main: '#F7B42C'
            },
            secondary: {
                main: '#FC575E'
            }
        }
    })

    console.log('rerender')
    return (
        <Box sx={{ flexGrow: 1 }}>
            <ThemeProvider theme={theme}>
                <AppBar position="static" color="primary">
                        <div id="top-bar-container">
                        <img src={Logo} alt=""></img>
                            <Box id="account-icon">
                                <IconButton
                                    size="large"
                                    edge="end"
                                    aria-label="account of current user"
                                    aria-controls={menuId}
                                    aria-haspopup="true"
                                    onClick={handleProfileMenuOpen}
                                    color="inherit"
                                >
                                    { getAccountMenu(auth.loggedIn) }
                                </IconButton>
                            </Box>
                        </div>
                </AppBar>
                <AppBar position="static" color="secondary">
                        <div id="secondary-bar-container">
                            <IconButton
                                size="large"
                                onClick={ () => { history.push("/playlister")}}
                                disabled={auth.guest}
                            >
                                <HomeIcon color="primary" />
                            </IconButton>

                            <IconButton
                                size="large"
                                onClick={ () => { history.push("/playlister/all")}}
                            >
                                <GroupsIcon color="primary" />
                            </IconButton>
                            <IconButton
                                size="large"
                                onClick={ () => { history.push("/playlister/user")}}
                            >
                                <PersonIcon color="primary" />
                            </IconButton>
                            <TextField
                                id="search-bar"
                                label="Search"
                                type="search"
                                variant="filled"
                                />

                            <div id="sort-by">
                                SORT BY
                            </div>
                            <IconButton
                                size="large"
                                onClick={e => handleSortByMenuOpen(e)}
                            >
                                <SortIcon>

                                </SortIcon>
                            </IconButton>
                        </div>
                </AppBar>
            </ThemeProvider>
            {
                menu
            }
            {
                sortByMenu
            }
        </Box>
    );
}

    // <Typography                        
    // variant="h4"
    // noWrap
    // component="div"
    // sx={{ display: { xs: 'none', sm: 'block' } }}                        
    // >
    // <Link style={{ textDecoration: 'none', color: 'white' }} onClick={() => store.closeCurrentList()} to='/'>⌂</Link>
    // </Typography>
    // <Box sx={{ flexGrow: 1 }}>{editToolbar}</Box>