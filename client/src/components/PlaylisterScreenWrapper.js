import { useContext } from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import AuthContext from '../auth'
import {
    AppBanner,
    Statusbar,
    HomeScreen,
} from '../components'



const PlaylisterScreenWrapper = props => {

    const { auth } = useContext(AuthContext);

    

    return (
        <>
            <Switch>
                <Route exact path="/playlister/all" render={props => <HomeScreen {...props} screenType={0}/>} />
                <Route path="/playlister/user/:username?" render={props => <HomeScreen {...props} screenType={1} />} /> 
                {auth.user ? <Route path="/playlister/" render={props => <HomeScreen {...props} screenType={2}/> }/> : <Redirect to="/playlister/all"></Redirect>} 
            </Switch>
        </>
    )
}

//render={props => <HomeScreen {...props} screenType={0}/> }
export default PlaylisterScreenWrapper