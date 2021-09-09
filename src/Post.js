import React, { useEffect, useState } from 'react'
import './Post.css';
import {Avatar,Button, TextField} from  '@material-ui/core';
import { db } from './firebase';
import firebase from '@firebase/app-compat';
import { ref,set } from "firebase/database";
import PostComments from './PostComments'
import SendRoundedIcon from '@material-ui/icons/SendRounded';
import { doc, setDoc } from "firebase/firestore";
function Post({key,postId,user,username,caption,imgUrl}) {

    const [comments,setComments]=useState([]);
    const [comment, setComment] = useState("");
    useEffect(() => {
    //   let unsubscribe=db;
        if(postId)
        {
            db
            .collection("posts")
            .doc(postId)
            .orderBy('timestamp','desc')
            .onSnapshot((snapshot)=>{
                return setComments(snapshot.docs.map((doc)=>doc.data().comments));
            })
        }
        // return () => {
        //     unsubscribe();
        // };
    }, [postId]);

    const postComment=(event)=>{
        event.preventdefaullt();
        // set(ref(db, 'posts/'+ {postId}),{
        //     text:comment,
        //     username:user.displayName,
        //     timeStamp:firebase.firestore.FieldValue.serverTimestamp()
        // });
        // db.collection("posts").doc(postId).collection("comments").add({
        //     text:comment,
        //     username:user.displayName,
        //     timeStamp:firebase.firestore.FieldValue.serverTimestamp()
        // })
        comments.push({
            comment:comment,
            username:user.displayName,
        });
        db.collection("posts").doc(key).set({
            comment:comments
        })
        .then(()=>{
            setComment('');
            console.log("comment added");
        }) .catch(
            (err)=>{
                console.log(`error ${err}`);
            }
        );
        
    }

    return (
        <div className="post">
            <div className="post__header">
                
                <Avatar 
                className="post__avatar"
                alt="b/\_guy"
                src="/static/images/avatar/1.jpg"
                />

                <h3>{username}</h3>
            
            </div>
           
            {/*IMAGE*/ }
            <img className="post__image" alt="opps" src={imgUrl}/>
            
            {/*caption*/}
            <h4 className="post__text"><strong>{username}</strong>- {caption}</h4>
            
            <div className="post__comments">
                <PostComments/>

                {comments?(
                    comments.map((comment)=>(
                        <p>
                            <storng>{comment.comment}</storng>{comment.username}
                        </p>
                    ))
                    ):
                    (
                        <></>
                    )
                }
            </div>
            <form className="post__commentBox">
                <TextField
                    label="Add comment"
                    size="small"
                    variant="outlined"
                    className="post__input"
                    type="text"
                    placeholder="add a kind comment........."
                    value={comment}
                    onChange={(e)=>setComment(e.target.value)}
                />    
                <Button
                    variant ="contained"
                    size="small"
                    endIcon={<SendRoundedIcon fontSize='' color=''/>}
                    className="post__button"
                    disabled={!comment}
                    type="submit"
                    onClick={postComment}
                >
                Send
                </Button>
            </form>

        </div>
    )
}

export default Post;
