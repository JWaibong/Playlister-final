import { useContext } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import AuthContext from '../auth'
import {
    AppBanner,
    Statusbar,
    HomeScreen,
    AllPlaylistsScreen,
    UserSpecifiedPlaylistsScreen
} from '../components'



const PlaylisterScreenWrapper = props => {

    const { auth } = useContext(AuthContext);

    

    return (
        <>
            <AppBanner />
            <Switch>
                <Route exact path="/playlister/all" render={props => <HomeScreen {...props} screenType={0}/>} />
                <Route path="/playlister/user/:username?" render={props => <HomeScreen {...props} screenType={1} />} /> 
                <Route path="/playlister/" render={props => <HomeScreen {...props} screenType={2}/> }/>
            </Switch>
            <Statusbar />
        </>
    )
}

//render={props => <HomeScreen {...props} screenType={0}/> }
export default PlaylisterScreenWrapper