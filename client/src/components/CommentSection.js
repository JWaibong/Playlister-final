

import { useContext, useState, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';

const CommentSection = () => {

    const { store } = useContext(GlobalStoreContext);
    const [text, setText] = useState("");

    const handleSubmitComment = () => {
        if(text)
            store.submitComment(text)
    }
    let comments = ""
    if(store.selectedPlaylist) {
        comments = store.selectedPlaylist.comments.map(comment => {
            return(<div className="commentCard">
                <div>
                    {comment.author}
                </div>
                <div>
                    {comment.comment}
                </div>
            </div>)
        })
    }

    return (
    <div id="comments-container">
        {comments}
        <TextField 
                  id="multiline-submit-comment"
                  multiline
                  rows={3}
                  onChange={e => setText(e.target.value)}
                  value={text}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                        handleSubmitComment()
                    }
                  }}
                  />
    </div>
    )


}

export default CommentSection