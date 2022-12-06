const Playlist = require('../models/playlist-model')
const User = require('../models/user-model');
const mongoose = require('mongoose')
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/



/*
    getPlaylistsContainingName
    getPlaylistsContainingUserName 
    are two completely new functions
    all other functions in this file have been modified from HW 4
*/

// TODO: Test once publishing is implemented
// this function does not require user authorization
// return all published playlists containing specified name
getPlaylistsContainingName = async (req, res) => {
    const playlistNameQuery = new RegExp(req.params.name, "i") // case insensitive

    Playlist.find({"name" : playlistNameQuery, "publishStatus": 1}, (err, playlists) => {
        if (err) {
            return res.status(404).json({
                success: false,
                error: 'No playlists found',
            })
        }
        return res.status(201).json({success: true, playlists})
    })
}

// this function does not require user authorization
// return all published playlists by owners containing specified username 
getPlaylistsContainingUserName = async (req, res) => {
    const userNameQuery = new RegExp(req.params.username, "i")

    Playlist.find({"ownerUserName" : userNameQuery,  "publishStatus": 1}, (err, playlists) => {
        if (err) {
            return res.status(404).json({
                success: false,
                error: 'No playlists found',
            })
        }
        return res.status(201).json({success: true, playlists})
    })
}


/*
    modified function from HW 4
*/
createPlaylist = async (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Playlist',
        })
    }
    User.
        findOne({_id: req.userId}, async (err, user) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    errorMessage: "Unable to find user"
                })
            }
            let name = body.name === undefined ? `Untitled ${user.untitledCount}` : body.name

            const playlist = new Playlist({...body, owner: req.userId, ownerUserName: user.userName, name})
            if (!playlist) {
                return res.status(400).json({ success: false, error: err })
            }
            

            await playlist.save().catch(err => res.status(400).json({success: false, errorMessage: "Playlist not created!"}))
            user.playlists.push(playlist)
            user.untitledCount = user.untitledCount + 1

            user.
                save().
                then(() => res.status(201).json({success: true, playlist}))
                .catch(err => res.status(400).json({success: false, errorMessage: "Playlist not created!"}))
        })
}
/*
    modified function from HW 4
*/
deletePlaylist = async (req, res) => {
    await User.
        findOne({_id: req.userId}, (err, user) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    errorMessage: "Unable to find user"
                })
            }
            const newLists = user.playlists.filter(playlistId => playlistId.toString() !== req.params.id)

            user.playlists = newLists
            user.markModified('playlists')

            user.save().then(() => console.log("Successfully deleted playlist from user collection"))
            .catch(err => res.status(400).json({success: false, errorMessage: "Unable to delete playlist from user colleciton"}))
        })
    Playlist.findOneAndDelete({ _id: req.params.id }, () => {
            console.log("Successfully deleted playlist from playlists collection");
            return res.status(200).json({success: true})
        }).catch(err => res.status(400).json({success: false, errorMessage: "Unable to delete playlist from playlists colleciton"}))
}

/*
    Modified function from HW 4

    This function does not need to authorize the user because it can only send published playlists.
*/
getPublishedPlaylistById = async (req, res) => {
    Playlist.findById({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        if (list.publishStatus == 0) {
            return res.status(400).json({ success: false, errorMessage: "Attempt to access unpublished playlist" });
        }


        return res.status(201).json({success: true, playlist: list});
    }).catch(err => console.log(err))
}

// originally returned an array of objects called idNamePairs
// now returns a specific users playlist info (everything except for comments and songs)
getPlaylistInfoOwnedByLoggedInUser = async (req, res) => {
        Playlist.find({ owner: req.userId }, (err, playlists) => {
            if (err) {
                return res.status(400).json({ success: false, error: err })
            }
            if (!playlists) {
                return res
                    .status(404)
                    .json({ success: false, error: 'Playlists not found' })
            }
            let playlistsInfo = [];
            for (const key in playlists) {
                const list = playlists[key];
                const {_id, name, ownerUserName, likes, dislikes, listens, publishDate, publishStatus} = list;
                const info = {
                    _id,
                    name,
                    ownerUserName,
                    likes,
                    dislikes,
                    listens,
                    publishDate,
                    publishStatus
                };
                playlistsInfo.push(info);
            }
            return res.status(200).json({ success: true, playlistsInfo })
        })
}

/*
    From HW 4
    Returns all playlists from all users

    Gets called whenever a search query (either for usernames or playlist names) is empty, or no search has been performed yet
*/
getPlaylists = async (req, res) => {
    Playlist.find({}, (err, playlists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!playlists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Playlists not found` })
        }
        return res.status(200).json({ success: true, data: playlists })
    }).catch(err => console.log(err))
}



// Update playlist songs, name, publish status.
// User must be authorized and be the owner of the playlist they are trying to update.
updatePlaylist = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }
    User.
        findOne({_id: req.userId})
        .populate('playlists')
        .exec((err, user) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    errorMessage: "Unable to find user"
                })
            }

            const listToUpdate = user.playlists.find(playlist => playlist._id === req.params.id)

            if (listToUpdate === undefined) {
                return res.status(400).json({success: false, errorMessage: `Unable to find playlist with requested id ${req.params.id}`})
            }

            if (body.playlist.name !== undefined) {
                const listWithSameName = user.playlists.find(playlist => playlist.name === body.playlist.name)
                if (listWithSameName.name !== undefined) {
                    return res.status(400).json({success: false, errorMessage: "Playlist cannot be renamed because name already exists"})
                }
                listToUpdate.name = body.playlist.name
            }

            if (body.playlist.publishStatus !== undefined) { 
                if (listToUpdate.publishStatus !== 0) {
                    return res.status(400).json({success: false, errorMessage: "Cannot revert publish status of this playlist back to unpublished. Publishing a playlist is a permanent change."})
                }
                listToUpdate.publishStatus = body.playlist.publishStatus
            }
            
            if (body.playlist.songs !== undefined) {
                listToUpdate.songs = body.playlist.songs
            }

            listToUpdate.save().then(() => {
                user.markModified('playlists')
                user.save().then(() => {
                    console.log("Successfully updated playlist from user collection")
                    return res.status(201).json({success: true, playlist: listToUpdate})
                })
                .catch(err => res.status(400).json({success: false, errorMessage: "Unable to update playlist from user colleciton"}))
            })
            .catch(err => res.status(400).json({success: false, errorMessage: "Unable to update playlist from playlist collection"}))
        })
}

updatePlaylistLikes = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({success: false, errorMessage: 'You must provide a body to update likes or dislikes'})
    }

    const {incrementLikes, decrementLikes, incrementDislikes, decrementDislikes} = body

    if (incrementLikes === undefined && decrementLikes === undefined && incrementDislikes === undefined && decrementDislikes === undefined) {
        return res.status(400).json({success: false, errorMessage: 'You must provide an action to like or dislike in body'})
    }

    User
        .findOne({_id: req.userId})
        .populate('playlists')
        .exec((err, user) => {
            const likedPlaylistIndex = user.likes.findIndex(playlist => playlist._id === req.params.id)
            const dislikedPlaylistIndex = user.dislikes.findIndex(playlist => playlist._id === req.params.id)

            // Case where we found the playlist already in user's likes
            if (likedPlaylistIndex !== -1) {
                if (incrementLikes || decrementDislikes) {
                    return res.status(400).json({success: false, errorMessage: "Unable to like the same playlist a second time"})
                }

                const likedPlaylist = user.likes[likedPlaylistIndex]
                user.likes.splice(likedPlaylistIndex, 1)

                user.markModified('likes')
                user.save().then(() => {
                    if (decrementLikes) {
                        // Equivalent to "unliking"
                        likedPlaylist.likes = likedPlaylist.likes - 1
    
                    }
                    else if (incrementDislikes) {
                        // Equivalent to changing a like to a dislike
                        likedPlaylist.likes = likedPlaylist.likes - 1
                        likedPlaylist.dislikes = likedPlaylist.dislikes + 1
                    }

                    likedPlaylist.save().then(() => {
                        return res.status(200).json({success: true, playlist: likedPlaylist})
                    }).catch(err => res.status(500).json({success: false, errorMessage: "Unable to save playlist likes"}))
                }).catch(err => res.status(500).json({success: false, errorMessage: "Unable to save user's likes"}))

            }
            // Case where we found the playlist already in user's dislikes
            if (dislikedPlaylistIndex !== -1) {
                if (incrementDislikes || decrementLikes) {
                    return res.status(400).json({success: false, errorMessage: "Unable to dislike the same playlist a second time"})
                }
                
                const dislikedPlaylist = user.dislikes[dislikedPlaylistIndex]
                user.dislikes.splice(dislikedPlaylistIndex, 1)
                user.markModified('dislikes')
                user.save().then(() => {
                    if (decrementDislikes) {
                        // Equivalent to "undisliking"
                        dislikedPlaylist.dislikes = dislikedPlaylist.dislikes - 1
    
                    }
                    else if (incrementLikes) {
                        // Equivalent to changing a dislike to a like
                        dislikedPlaylist.dislikes = dislikedPlaylist.dislikes - 1
                        dislikedPlaylist.likes = dislikedPlaylist.likes + 1
                    }
                    dislikedPlaylist.save().then(() => {
                        return res.status(200).json({success: true, playlist: dislikedPlaylist})
                    }).catch(err => res.status(500).json({success: false, errorMessage: "Unable to save playlist dislikes"}))
                }).catch(err => res.status(500).json({success: false, errorMessage: "Unable to save user's dislikes"}))
            }

            Playlist.findOne({_id: req.params.id}, (err, playlist)=> {
                if (err) {
                    return res.status(500).json({success: false, errorMessage: "Unable to find playlist"})
                }

                if (decrementLikes || decrementDislikes) {
                    return res.status(400).json({success: false, errorMessage: "You are currently unable to unlike or undislike this playlist"})
                }

                if (incrementLikes) {
                    playlist.likes = playlist.likes + 1

                    user.likes.push(playlist)
                    user.markModified('likes')
                }

                if (decrementLikes) {
                    playlist.dislikes = playlist.dislikes + 1
                    user.dislikes.push(playlist)
                    user.markModified('dislikes')
                }

                user.save().then(() => {
                    playlist.save().then(() => {
                        return res.status(200).json({success: true, playlist})
                    }).catch(err => res.status(500).json({success: false, errorMessage: "Unable to save playlist's likes/dislikes"}))

                }).catch(err => res.status(500).json({success: false, errorMessage: "Unable to save user's likes/dislikes"}))
                
            })

        })

}

updatePlaylistListens = async (req, res) => {
    Playlist.findOneAndUpdate({_id: req.params.id}, { $inc: {listens: 1}}, (err, response) => {
        if (err) {
            return res.status(500).json({success: false, errorMessage: "Unable to increment playlist listens"})
        }
        return res.status(200).json({success: true})
    })
}

updatePlaylistComments = async (req, res) => {


    const body = req.body
    
    if(!body || !body.comment) {
        return res.status(400).json({success: false, errorMessage: "You must provide a comment in the body"})
    }

    Playlist.findOne({_id: req.params.id}, (err, playlist)=> {
        if (err) {
            return res.status(500).json({success: false, errorMessage: "Unable to find playlist"})
        }

        const author = new mongoose.mongo.ObjectId(req.userId)
        const commentToAdd = {
            author,
            comment: body.comment
        }

        playlist.comments.push(comment)

        playlist.markModified('comments')

        playlist.save().then(() => {
            return res.status(200).json({success: true, playlist})
        }).catch(err => res.status(500).json({success: false, errorMessage: "Unable to save playlist comments"}))
    })

}





module.exports = {
    createPlaylist,
    deletePlaylist,
    getPublishedPlaylistById,
    getPlaylistInfoOwnedByLoggedInUser,
    getPlaylists,
    updatePlaylist,
    updatePlaylistLikes,
    updatePlaylistListens,
    updatePlaylistComments,
    getPlaylistsContainingUserName,
    getPlaylistsContainingName,    

}