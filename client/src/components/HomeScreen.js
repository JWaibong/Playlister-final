import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import PlayerAndCommentsWrapper from './PlayerAndCommentsWrapper'

import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';
import Typography from '@mui/material/Typography'

import WorkSpaceScreen from './WorkspaceScreen'

import {AppBanner} from '../components'

import {useParams} from 'react-router-dom'

/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = props => {
    
    const { store } = useContext(GlobalStoreContext)

    const {username} = useParams()

    useEffect(() => {
        store.loadPlaylists(props.screenType, null)
    }, [props.screenType]);



    function handleCreateNewList() {
        store.createNewList()
    }

    const handleSearch = (query) => {
        store.loadPlaylists(props.screenType, query)
    }

    let listCard = "";
    if (store && !store.currentList) {
        listCard = 
            <List sx={{ width: '90%', left: '5%', bgcolor: 'background.paper' }}>
            {
                store.idNamePairs.map((info) => (
                    <ListCard
                        key={info._id}
                        info={info}
                        selected={false}
                    />
                ))
            }
            </List>;
    }
    else {
        listCard = <WorkSpaceScreen />
    }


    let addLists = ""
    if (props.screenType === 2 && store && !store.currentList) {
        addLists = (
            <div id="list-selector-heading">
                <Typography variant="h2">Your Lists</Typography>
                <Fab 
                color="success" 
                aria-label="add"
                id="add-list-button"
                onClick={handleCreateNewList}
                disabled={store.listMarkedForDeletion !== null || store.listNameActive}
            >
                <AddIcon />
            </Fab>
            </div>
        )
    }

    return (
        <>
            <AppBanner screenType={props.screenType} handleSearchCallback={handleSearch}/>
            <div id="playlist-selector">
                <div id="playlist-player-comment-container">
                    <div id="list-selector-list">
                        {
                            listCard
                        }
                        <MUIDeleteModal />
                    </div>
                    <PlayerAndCommentsWrapper />
                    {
                        addLists
                    }
                </div>
            </div>
        </>)
}

export default HomeScreen;