import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import CloseIcon from '@mui/icons-material/HighlightOff';

/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar(props) {
    const { store } = useContext(GlobalStoreContext);
    function handleAddNewSong() {
        store.addNewSong();
    }
    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handleClose() {
        store.closeCurrentList();
    }

    let canAddSong = store.canAddNewSong()
    let canUndo = store.canUndo()
    let canRedo = store.canRedo()
    let canClose = store.canClose()

    if (store.currentSong !== undefined && store.currentSong !== null) {
        canAddSong = false
        canUndo = false
        canRedo = false
        canClose = false 
    }

    const handleDup = () => {
        store.duplicate(store.currentList._id)
        store.closeCurrentList()
    }

    const handlePub = () => {
        store.publish(store.currentList._id)
        store.closeCurrentList()
    }
    
    const handleDel = () => {
        store.markListForDeletion(store.currentList)
    }

    return (
        <div id="edit-toolbar">
            <Button
                disabled={!canAddSong}
                id='add-song-button'
                onClick={handleAddNewSong}
                variant="contained">
                <AddIcon />
            </Button>
            <Button 
                disabled={!canUndo}
                id='undo-button'
                onClick={handleUndo}
                variant="contained">
                    <UndoIcon />
            </Button>
            <Button 
                disabled={!canRedo}
                id='redo-button'
                onClick={handleRedo}
                variant="contained">
                    <RedoIcon />
            </Button>
            <Button 
                disabled={!canClose}
                id='close-button'
                onClick={handleClose}
                variant="contained">
                    <CloseIcon />
            </Button>
            <Button 
                disabled={store.currentModal !== "NONE"}
                id='close-button'
                onClick={handleDup}
                variant="contained">
                    Duplicate
            </Button>
            <Button 
                disabled={store.currentModal !== "NONE"}
                id='close-button'
                onClick={handlePub}
                variant="contained">
                    Publish
            </Button>
            <Button 
                disabled={store.currentModal !== "NONE"}
                id='close-button'
                onClick={handleDel}
                variant="contained">
                    Delete
            </Button>
        </div>
    )
}

export default EditToolbar;