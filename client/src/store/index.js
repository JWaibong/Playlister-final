import { createContext, useContext, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import CreateSong_Transaction from '../transactions/CreateSong_Transaction'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction'
import AuthContext from '../auth'
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    HIDE_MODALS: "HIDE_MODALS",
    SET_SELECTED_PLAYLIST: "SET_SELECTED_PLAYLIST",
    SET_PLAYING_SONG: "SET_PLAYING_SONG"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const CurrentModal = {
    NONE : "NONE",
    DELETE_LIST : "DELETE_LIST",
    EDIT_SONG : "EDIT_SONG",
    REMOVE_SONG : "REMOVE_SONG"
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        currentModal : CurrentModal.NONE,
        idNamePairs: [],
        currentList: null,
        currentSongIndex : -1,
        currentSong : null,
        newListCounter: 0,
        listNameActive: false,
        listIdMarkedForDeletion: null,
        playingSong: null,
    });
    const history = useHistory();
    const location = useLocation()
    // console.log("inside useGlobalStore");

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);
    // console.log("auth: " + auth);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: null, // previously was payload.playlist
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    selectedPlaylist: store.selectedPlaylist,
                    playingSong: store.playingSong,
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    selectedPlaylist: store.selectedPlaylist,
                    playingSong: store.playingSong,
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {                
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    selectedPlaylist: store.selectedPlaylist,
                    playingSong: store.playingSong,
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,

                    selectedPlaylist: store.selectedPlaylist,
                    playingSong: store.playingSong,
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    currentModal : CurrentModal.DELETE_LIST,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: payload.id,
                    selectedPlaylist: store.selectedPlaylist,
                    playingSong: store.playingSong,
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    songPlaying: store.songPlaying,
                    selectedPlaylist: store.selectedPlaylist
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listIdMarkedForDeletion: null,
                    selectedPlaylist: store.selectedPlaylist,
                    playingSong: store.playingSong,
                });
            }
            // 
            case GlobalStoreActionType.EDIT_SONG: {
                return setStore({
                    currentModal : CurrentModal.EDIT_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    selectedPlaylist: store.selectedPlaylist,
                    playingSong: store.playingSong,
                });
            }
            case GlobalStoreActionType.REMOVE_SONG: {
                return setStore({
                    currentModal : CurrentModal.REMOVE_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    selectedPlaylist: store.selectedPlaylist,
                    playingSong: store.playingSong,
                });
            }
            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    selectedPlaylist: store.selectedPlaylist,
                    playingSong: store.playingSong,
                });
            }
            case GlobalStoreActionType.SET_SELECTED_PLAYLIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    selectedPlaylist: payload.playingList,
                    playingSong: store.playingSong,
                })
            }
            case GlobalStoreActionType.SET_PLAYING_SONG: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    selectedPlaylist: store.selectedPlaylist,
                    playingSong: payload
                })
            }
            default:
                return store;
        }
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        if(!newName) {
            storeReducer({
                type: GlobalStoreActionType.CHANGE_LIST_NAME,
                payload: {
                    idNamePairs: store.idNamePairs,
                }
            })
            return;
        }
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {

                        if (location.pathname === "/playlister") {
                            response = await api.getPlaylistInfoByLoggedInUser()
                        }
                        else if (location.pathName === "/playlister/all" || location.pathName.matches("/playlister/user*")) {
                            response = await api.getPublishedPlaylists()
                        }

                        if (response.data.success) {
                                let pairsArray = response.data.playlistsInfo;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                            });
                        }
                    }
                }
                updateList(playlist).catch(err => console.log(err));
            }
        }

        asyncChangeListName(id).catch(err => console.log(err))
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        tps.clearAllTransactions();

    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        let response = await api.createPlaylist();
        if (response.data.success) {
           response = await api.getPlaylistInfoByLoggedInUser()
           if(response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: response.data.playlistsInfo
                });
           } 
        }


    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadPlaylists = function (screenType, searchQuery) {
        if (searchQuery === "") {
            storeReducer({
                type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                payload: []
            });
            return
        }
        async function asyncLoadPlaylists() {
            let response = null;
            if (screenType === 0) {
                // all lists
                if (searchQuery !== null) {
                    response = await api.getPlaylistsContainingName(searchQuery)
                }
                else {
                    response = await api.getPublishedPlaylists()
                }

            }
            else if (screenType === 1) {
                // users lists
                if (searchQuery !== null) {
                    response = await api.getPlaylistsContainingUserName(searchQuery)
                }
                else {
                    response = await api.getPublishedPlaylists()
                }

            }
            else {
                // your lists
                if (searchQuery !== null) {
                    response = await api.getYourPlaylistsContainingName(searchQuery)
                }
                else {
                    response = await api.getPlaylistInfoByLoggedInUser()
                }
            } 
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: response.data.playlistsInfo
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadPlaylists();
    }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = function (id) {
        storeReducer({
            type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
            payload: {id}
        });
    }
    store.deleteList = function (id) {
        async function processDelete(id) {
            let response = await api.deletePlaylistById(id);
            if (response.data.success) {
                if(location.pathname === "/playlister") {
                    response = await api.getPlaylistInfoByLoggedInUser()
                }
                else {
                    response = await api.getPublishedPlaylists()
                }
                if(response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                        payload: response.data.playlistsInfo
                    })
                }
            }
        }
        processDelete(id);
    }
    store.deleteMarkedList = function() {
        store.deleteList(store.listIdMarkedForDeletion._id);
        store.hideModals();
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST

    store.showEditSongModal = (songIndex, songToEdit) => {
        storeReducer({
            type: GlobalStoreActionType.EDIT_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToEdit}
        });        
    }
    store.showRemoveSongModal = (songIndex, songToRemove) => {
        storeReducer({
            type: GlobalStoreActionType.REMOVE_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToRemove}
        });        
    }
    store.hideModals = () => {
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: {}
        });    
    }
    store.isDeleteListModalOpen = () => {
        return store.currentModal === CurrentModal.DELETE_LIST;
    }
    store.isEditSongModalOpen = () => {
        return store.currentModal === CurrentModal.EDIT_SONG;
    }
    store.isRemoveSongModalOpen = () => {
        return store.currentModal === CurrentModal.REMOVE_SONG;
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentEditList = function (playlist) {
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_LIST,
            payload: playlist
        })

    }

    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.addNewSong = function(currentList) {
        let index = this.getPlaylistSize();
        this.addCreateSongTransaction(index, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCTION CREATES A NEW SONG IN THE CURRENT LIST
    // USING THE PROVIDED DATA AND PUTS THIS SONG AT INDEX
    store.createSong = function(index, song) {
        let list = store.currentList;      
        list.songs.splice(index, 0, song);
        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    store.moveSong = function(start, end) {
        let list = store.currentList;

        // WE NEED TO UPDATE THE STATE FOR THE APP
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION REMOVES THE SONG AT THE index LOCATION
    // FROM THE CURRENT LIST
    store.removeSong = function(index) {
        let list = store.currentList;      
        list.songs.splice(index, 1); 

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION UPDATES THE TEXT IN THE ITEM AT index TO text
    store.updateSong = function(index, songData) {
        let list = store.currentList;
        let song = list.songs[index];
        song.title = songData.title;
        song.artist = songData.artist;
        song.youTubeId = songData.youTubeId;

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    store.addNewSong = () => {
        let playlistSize = store.getPlaylistSize();
        store.addCreateSongTransaction(
            playlistSize, "Untitled", "?", "dQw4w9WgXcQ");
    }
    // THIS FUNCDTION ADDS A CreateSong_Transaction TO THE TRANSACTION STACK
    store.addCreateSongTransaction = (currentList, index, title, artist, youTubeId) => {
        // ADD A SONG ITEM AND ITS NUMBER
        let song = {
            title: title,
            artist: artist,
            youTubeId: youTubeId
        };
        let transaction = new CreateSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }    
    store.addMoveSongTransaction = function (start, end) {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
    store.addRemoveSongTransaction = () => {
        let index = store.currentSongIndex;
        let song = store.currentList.songs[index];
        let transaction = new RemoveSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }
    store.addUpdateSongTransaction = function (index, newSongData) {
        let song = store.currentList.songs[index];
        let oldSongData = {
            title: song.title,
            artist: song.artist,
            youTubeId: song.youTubeId
        };
        let transaction = new UpdateSong_Transaction(this, index, oldSongData, newSongData);        
        tps.addTransaction(transaction);
    }
    store.updateCurrentList = function() {
        async function asyncUpdateCurrentList() {
            const response = await api.updatePlaylistById(store.currentList._id, store.currentList).catch(err => console.log(err));
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: store.currentList
                });
            }
        }
        asyncUpdateCurrentList().catch(err => console.log(err));
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }
    store.canAddNewSong = function() {
        return (store.currentList !== null);
    }
    store.canUndo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToUndo());
    }
    store.canRedo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToRedo());
    }
    store.canClose = function() {
        return (store.currentList !== null);
    }

    store.unmarkListForDeletion = () => {
        storeReducer({
            type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
            payload: {id: null, playlist: null}
        })
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    store.submitComment = (text, cb) => {
        if(!auth.user || auth.guest) {
            return
        }

        const asyncSubmitComment = async () => {
            const comment = {
                author: auth.user.userName,
                text
            }
            let response = await api.updatePlaylistComments( store.selectedPlaylist._id, comment)
            if (response.data.success) {
                let comments = response.data.playlist.comments
                cb(comments)

                // if (location.pathname === "/playlister") {
                //     response = await api.getPlaylistInfoByLoggedInUser()
                // }
                // else {
                //     response = await api.getPublishedPlaylists()
                // }
                // if (response.data.success) {
                //     storeReducer({
                //         type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                //         payload: response.data.playlistsInfo
                //     })
                // }
            }
        
        }

        asyncSubmitComment()
    }

    store.setSelectedPlaylist = (playlist, edit) => {

        if (edit) {
            storeReducer({
                type: GlobalStoreActionType.SET_SELECTED_PLAYLIST,
                payload: {currentList: playlist, playingList: playlist}
            })
        }
        else {
            storeReducer({
                type: GlobalStoreActionType.SET_SELECTED_PLAYLIST,
                payload: {currentList: null, playingList: playlist}
            })
        }

    }

    store.setSongPlaying = index => {
        storeReducer( {
            type: GlobalStoreActionType.SET_PLAYING_SONG,
            payload: index
        })
    }

    store.incrementOrUndoLike = (id) => {

        const asyncIncLike = async () => {
            let response = await api.updatePlaylistLikes(id, {incrementLikes: true})
            
            if (response.data.success) {
                if (location.pathname==="/playlister") {
                    response = await api.getPlaylistInfoByLoggedInUser()
                }
                else {
                    response = await api.getPublishedPlaylists() 
                }
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                        payload: response.data.playlistsInfo
                    });
               }
            }
        }
        asyncIncLike()
    }

    store.incrementOrUndoDislike = (id) => {
        const asyncIncDislike = async () => {
            let response = await api.updatePlaylistLikes(id, {incrementDislikes: true})
            if (response.data.success) {
                if (location.pathname==="/playlister") {
                    response = await api.getPlaylistInfoByLoggedInUser()
                }
                else {
                    response = await api.getPublishedPlaylists() 
                }
               if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                        payload: response.data.playlistsInfo
                    });
               }
            }
        }
        asyncIncDislike()
    }

    store.incrementListens = (id) => {
        if (id === "") {
            return
        }
        const asyncIncListens = async () => {
            let response = await api.updatePlaylistListens(id)
            if (response.data.success) {
                if (location.pathname === "/playlister") {
                    response = await api.getPlaylistInfoByLoggedInUser()
                }
                else {
                    response = await api.getPublishedPlaylists() 
                }
                if (response.data.success) {
                     storeReducer({
                         type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                         payload: response.data.playlistsInfo
                     });
                }
            }
        }
        asyncIncListens()
    }

    store.sortBy = (type) => {

        let sortedPairs = store.idNamePairs
        switch(type) {
            case 0:
                sortedPairs.sort((a,b) => {
                    let res = Date.parse(a.createdAt) - Date.parse(b.createdAt)
                    return res
                })
                break;
            case 1:
                sortedPairs.sort((a,b) => {
                    let res = Date.parse(b.updatedAt) - Date.parse(a.updatedAt)
                    return res
                })
                break;
            case 2:
                sortedPairs.sort((a,b) => a.name.localeCompare(b.name))
                break;
            case 3:
                sortedPairs.sort((a,b) => a.name.localeCompare(b.name))
                break;
            case 4:
                sortedPairs.sort((a,b) =>  {
                    let res = Date.parse(b.publishDate) - Date.parse(a.publishDate)

                    return res
                })
                break;
            case 5:
                sortedPairs.sort((a,b) => b.listens - a.listens)
                break;
            case 6:
                sortedPairs.sort((a,b) => b.likes - a.likes)
                break;
            case 7:
                sortedPairs.sort((a,b) => b.dislikes - a.dislikes)
                break;
            default:
                break;
        }

        storeReducer({
            type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
            payload: sortedPairs
        })
    }

    store.duplicate = id => {
        if (!auth.user) {
            return
        }

        const asyncDuplicate = async () => {
            
            let response = await api.duplicate(id)
            
            if (response.data.success) {
                if (location.pathname === "/playlister") {
                    response = await api.getPlaylistInfoByLoggedInUser()
                    
                }
                else {
                    response = await api.getPublishedPlaylists()
                }
                if(response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                        payload: response.data.playlistsInfo
                    })
                }
            }

        }

        asyncDuplicate()
    
    }

    store.publish = id => {
        if (!auth.user) {
            return
        }

        const asyncPublish = async () => {
            let response = await api.updatePlaylistById(id, {publishStatus: 1})
            if(response.data.success) {
                if (location.pathname === "/playlister") {
                    response = await api.getPlaylistInfoByLoggedInUser()
                    
                }
                else {
                    response = await api.getPublishedPlaylists()
                }
                if(response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                        payload: response.data.playlistsInfo
                    })
                }
            }
        }
        asyncPublish()

    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };