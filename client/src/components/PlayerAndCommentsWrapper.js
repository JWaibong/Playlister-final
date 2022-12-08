import {useState, useContext} from 'react'
import YoutubePlayerExample from './YoutubePlayerExample'
import CommentSection from './CommentSection'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { GlobalStoreContext } from '../store'
import Button from '@mui/material/Button';

const PlayerAndCommentsWrapper = (props) => {

    const [playerSelected, setPlayerSelected] = useState(true)
    const {store}  = useContext(GlobalStoreContext)
    const handlePlayerTabClick = () => {
        setPlayerSelected(true)
    }
    const handleCommentTabClick = () => {
        setPlayerSelected(false)
    }

    const theme = createTheme({
        palette: {
            primary: {
                main: '#FFFFFF'
            },
            neutral: {
                main: '#E0E0E0'
            }
        }
    })

    let visiblyDisabledPlayerTab = ""
    let visiblyDisabledCommentTab =""

    let playerOrComments = ""

    if (playerSelected) {
        visiblyDisabledPlayerTab = "tab-disabled"
        playerOrComments = (<YoutubePlayerExample/>)
        if (!store.selectedPlaylist) {
            visiblyDisabledCommentTab = "tab-disabled"
        }
    }
    else {
        visiblyDisabledCommentTab = "tab-disabled"
        playerOrComments = (<CommentSection />)
    }



    return (
        <div id="player-comments-container">
            <ThemeProvider theme={theme}>
                <Button variant="contained" onClick={handlePlayerTabClick} color={playerSelected ? "primary" : "neutral"} className={visiblyDisabledPlayerTab} disabled={visiblyDisabledPlayerTab !== ""}>
                    Player
                </Button>
                <Button variant="contained" onClick={handleCommentTabClick} color={!playerSelected ? "primary" : "neutral"} className={visiblyDisabledCommentTab} disabled={visiblyDisabledCommentTab !== ""}>
                    Comments
                </Button>
            </ThemeProvider>
            {playerOrComments}

        </div>
    )
}
export default PlayerAndCommentsWrapper