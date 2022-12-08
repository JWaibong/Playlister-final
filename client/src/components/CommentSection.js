

import { useContext, useState, useEffect, useRef} from 'react'
import { GlobalStoreContext } from '../store'
import GlobalAuthContext  from '../auth'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography'
const CommentSection = () => {

    const { store } = useContext(GlobalStoreContext);
    const {auth} = useContext(GlobalAuthContext)
    const [comments, setComments] = useState([])
    const handleSubmitComment = (text) => {
        if (text) {
            store.submitComment(text, submitCommentCallback)
        }
    }

    const submitCommentCallback = (comments) => {
        setComments(comments)
    }


    useEffect(() => {
        if(store.selectedPlaylist) {
            setComments(store.selectedPlaylist.comments)
        }
    }, [store.selectedPlaylist])


    const commentsJSX = comments.map((comment, index) => {
            return(<ListItem key={index} className="commentCard">
                <Typography variant="h6">
                    {comment.author+ ": "}
                </Typography>
                <Typography variant="body2">
                    {comment.comment}
                </Typography>
            </ListItem>)
        })

    const commentRef = useRef('')
    return (
    <div id="comments-container">
        <List id="comments">
            {commentsJSX}
        </List>
        <TextField 
                  id="multiline-submit-comment"
                  multiline
                  rows={3}
                  inputRef={commentRef}
                  disabled={!auth.user}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                        handleSubmitComment(commentRef.current.value)
                        commentRef.current.value = ""
                    }
                  }}
                  />
    </div>
    )


}

export default CommentSection