

import { useContext, useState, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography'
const CommentSection = () => {

    const { store } = useContext(GlobalStoreContext);
    const [text, setText] = useState("");

    const handleSubmitComment = () => {
        if(text)
            store.submitComment(text)
    }
    let comments = ""
    if(store.selectedPlaylist) {
        comments = store.selectedPlaylist.comments.map((comment, index) => {
            return(<ListItem key={index} className="commentCard">
                <Typography variant="h6">
                    {comment.author+ ": "}
                </Typography>
                <Typography variant="body2">
                    {comment.comment}
                </Typography>
            </ListItem>)
        })
    }

    return (
    <div id="comments-container">
        <List id="comments">
            {comments}
        </List>
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