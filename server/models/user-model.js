const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const UserSchema = new Schema(
    {
        userName: { type:String, required: true},
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        passwordHash: { type: String, required: true },
        playlists: [{type: ObjectId, ref: 'Playlist'}],
        likes: [{type: ObjectId, ref:'Playlist'}], 
        dislikes: [{type: ObjectId, ref: 'Playlist'}],
        untitledCount: {type:Number, default: 0}
    },
    { timestamps: true },
)

module.exports = mongoose.model('User', UserSchema)
