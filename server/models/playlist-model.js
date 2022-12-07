const mongoose = require('mongoose')
const Schema = mongoose.Schema
/*
    This is where we specify the format of the data we're going to put into
    the database.
    
    @author McKilla Gorilla
*/
const playlistSchema = new Schema(
    {
        name: { type: String, required: true },
        owner: { type: Schema.Types.ObjectId, ref:'User', required: true },
        ownerUserName: {type: String, required: true},  
        songs: { type: [{
            title: String,
            artist: String,
            youTubeId: String
        }], default: []},
        comments: { type: [{
            author: String,
            comment: String,
        }], default: []},
        likes: {type: Number, default: 0},
        dislikes: {type: Number, default: 0},
        listens: {type: Number, default: 0},
        publishDate: {type: Date},
        publishStatus: {type: Number, default: 0}, 
    },
    { timestamps: true },
)

module.exports = mongoose.model('Playlist', playlistSchema)
