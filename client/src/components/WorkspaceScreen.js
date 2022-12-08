import { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import SongCard from './SongCard.js'
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'
import MUIDeleteModal from './MUIDeleteModal'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { GlobalStoreContext } from '../store/index.js'

import EditToolBar from './EditToolbar'

/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function WorkspaceScreen(props) {
    const { store } = useContext(GlobalStoreContext);
    //store.history = useHistory();
    const handleOnKeyDown = (event) => {
        event.stopPropagation()
        console.log(event)
        if (!event.ctrlKey || !store.tps) {
            return
        }

        if (event.keyCode === 89) {
            store.redo()
        }
        else if (event.keyCode === 90) {
            store.undo()
        }
    }
    let modalJSX = "";
    if (store.isEditSongModalOpen()) {
        modalJSX = <MUIEditSongModal />;
    }
    else if (store.isRemoveSongModalOpen()) {
        modalJSX = <MUIRemoveSongModal />;
    }
    else if (store.isDeleteListModalOpen()) {
        modalJSX = <MUIDeleteModal />
    }

    if (!store.currentList) {
        return (<div>
            Loading
        </div>)
    }

    return (
        <>        
        <EditToolBar currentList={store.currentList}/>
        <Box sx={{maxHeight: '90%', overflowY:'scroll'}}>
        <List 
            id="playlist-cards" 
            sx={{ width: '100%', bgcolor: 'background.paper'}}
        >
            {
                store.currentList.songs.map((song, index) => (
                    <SongCard
                        id={'playlist-song-' + (index)}
                        key={'playlist-song-' + (index)}
                        index={index}
                        song={song}
                    />
                ))  
            }
         </List>            
         { modalJSX }
         </Box>
         </>
    )
}

export default WorkspaceScreen;