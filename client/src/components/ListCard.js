import { useContext, useState, useEffect} from 'react'
import { GlobalStoreContext } from '../store'

import {useHistory} from 'react-router-dom'

import AuthContext from '../auth'
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'

import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext)
    const history = useHistory()
    const [editActive, setEditActive] = useState(false)
    const [text, setText] = useState("")
    const [droppedDown, setDroppedDown] = useState(false)

    const { info, selected } = props
    
    const { auth } = useContext(AuthContext);
    function handleLoadList(event) {
        if (auth.user && auth.user.userName === info.ownerUserName && info.publishStatus === 0) {
            store.setSelectedPlaylist(info, true)
        }
        else {
            store.setSelectedPlaylist(info, false)
        }
    }

    useEffect(() => {
        const cleanUp = history.listen(() => {
            setDroppedDown(false)
        })


        return cleanUp
    }, [history])




    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        let _id = event.target.id;
        _id = ("" + _id).substring("delete-list-".length);
        store.markListForDeletion(id);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, text);
            toggleEdit();
        }
    }

    function handleBlur(event) {
        let id = event.target.id.substring("list-".length);
        store.changeListName(id, text);
        toggleEdit();
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    const handleDropDown = (event) => {
        event.stopPropagation()
        setDroppedDown(true)
    }

    const handleDropUp = (event) => {
        event.stopPropagation()
        setDroppedDown(false)
    }

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }


    let publishedInfo = (
        <>
         <Box sx={{p: 1, fontSize:'18pt'}}>
                <IconButton>
                    <ThumbUpIcon>

                    </ThumbUpIcon>
                </IconButton>
                {info.likes}
        </Box>
            <Box sx={{p: 1, fontSize:'18pt'}}>
                <IconButton>
                    <ThumbDownIcon>

                    </ThumbDownIcon>
                </IconButton>
                {info.dislikes}
            </Box>
            <Box sx={{p: 1, fontSize:'18pt'}}>
                {"Published: " + info.publishDate}
            </Box>
            <Box sx={{p: 1, fontSize:'18pt'}}>
                {"Listens: "+ info.listens}
            </Box>
        </>
    )

    let dropDownInfo = ""
    if (droppedDown) {
        dropDownInfo = (
            <div className="dropdown-container">
                {info.songs.map((song,index) => {
                    return (
                        <div id={info._id + index} className=
                        {store.selectedPlaylist && store.selectedPlaylist._id === info._id && index === store.playingSong ? 
                            "current-song-playing" : ""}>
                            {index + 1}. {song.title} by {song.artist}
                        </div>
                    )
                })}
                {auth.user && auth.user.userName === info.ownerUserName ? 
                    <Button variant="filled"> Delete </Button>
                : ""
                }
                <Button variant="filled"> Duplicate </Button>
            </div>
        )
    }

    let cardElement =
        <ListItem
            id={info._id}
            key={info._id}
            sx={{ marginTop: '15px', display: 'flex', p: 1 }}
            style={{ width: '100%' }}
            button
            onClick={(event) => {
                handleLoadList(event)
            }}
        >
            <Box sx={{ p: 1, flexGrow: 1, fontSize:'28pt' }}>{info.name}</Box>
            {info.publishStatus !== 0 ? publishedInfo : ""}
            <Box sx={{p: 1, fontSize:'18pt'}}>
                {info.ownerUserName}
            </Box>
            <Box sx={{p: 1, fontSize:'18pt'}}>
                {!droppedDown ?
                (<IconButton onClick={e => handleDropDown(e)}>
                    <KeyboardDoubleArrowDownIcon>

                    </KeyboardDoubleArrowDownIcon>
                </IconButton>) :
                (
                <IconButton onClick={e => handleDropUp(e)}>
                    <KeyboardDoubleArrowUpIcon>

                    </KeyboardDoubleArrowUpIcon>
                </IconButton>
                )
                }
            </Box>
            {dropDownInfo}
        </ListItem>
    //<Box sx={{ p: 1 }}>
//     <IconButton onClick={handleToggleEdit} aria-label='edit'>
//     <EditIcon style={{fontSize:'48pt'}} />
// </IconButton>
// </Box>
// <Box sx={{ p: 1 }}>
// <IconButton onClick={(event) => {
//         handleDeleteList(event, info._id)
//     }} aria-label='delete'>
//     <DeleteIcon style={{fontSize:'48pt'}} />
// </IconButton>
// </Box>

    if (editActive) {
        cardElement =
            <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + info._id}
                label="Playlist Name"
                name="name"
                autoComplete="Playlist Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onBlur={handleBlur}
                onChange={handleUpdateText}
                defaultValue={info.name}
                inputProps={{style: {fontSize: 48}}}
                InputLabelProps={{style: {fontSize: 24}}}
                autoFocus
            />
    }
    return (
        cardElement
    );
}

export default ListCard;