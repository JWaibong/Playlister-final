/*
    This is where we'll route all of the received http requests
    into controller response functions.
    
    @author McKilla Gorilla
*/
const express = require('express')
const PlaylistController = require('../controllers/playlist-controller')
const router = express.Router()
const auth = require('../auth')

// A non-guest user can create their own new playlist (assuming they don't already own one with the same name requested)
router.post('/playlist', auth.verify, PlaylistController.createPlaylist)
router.delete('/playlist/:id', auth.verify, PlaylistController.deletePlaylist)

router.get('/playlist/published/:id', PlaylistController.getPublishedPlaylistById)
router.get('/playlist-duplicate/:id', auth.verify, PlaylistController.duplicatePlaylist)
router.get('/your-playlists', auth.verify, PlaylistController.getPlaylistInfoOwnedByLoggedInUser)
router.get('/your-playlists-containing-name/:name', auth.verify, PlaylistController.getYourPlaylistsContainingName)
router.get('/playlists/published', PlaylistController.getPublishedPlaylists)
router.get('/playlists-containing-name/:name', PlaylistController.getPlaylistsContainingName)
router.get('/playlists-containing-username/:username',PlaylistController.getPlaylistsContainingUserName)

// A non-guest user can only update the name, songs, and publish status of playlists they own.
router.put('/playlist/:id', auth.verify, PlaylistController.updatePlaylist) 

// Any non-guest user can like, dislike, or comment on another user's playlist (or their own)
router.put('/playlist/:id/likes', auth.verify, PlaylistController.updatePlaylistLikes)
router.put('/playlist/:id/comments', auth.verify, PlaylistController.updatePlaylistComments)

// Any users (including guests) can increment the listen counter on any playlist.
router.put('/playlist/:id/listens', PlaylistController.updatePlaylistListens)

module.exports = router