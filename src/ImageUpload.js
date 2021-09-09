import { Button, Input } from '@material-ui/core';
import {db} from "./firebase";
import firebase from 'firebase/compat/app';
import React, { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import './ImageUpload.css';
const storage = getStorage();
function ImageUpload({username}) {
   const [image, setImage] = useState(null);
   const [progress, setProgress] = useState(0);
   const [Caption, setCaption] = useState("");
   const handleChange=(e)=>{
        if(e.target.files[0])
        {
            setImage(e.target.files[0]);
        }

   }
   const handleUpload=(e)=>{
    //   const UploadTask=storage.ref(`images/${image.name}`).put(image);
    console.log(e);
    const storageRef = ref(storage, `images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on("State_changed",(snapshot)=>{
            const progress=Math.round(
                (snapshot.bytesTransferred/snapshot.totalBytes)*100
            );
            setProgress(progress);
    },
    (error)=>{
          console.log(error);
          alert(error.message);
    },
    ()=>{
        getDownloadURL(uploadTask.snapshot.ref)
          .then((Url)=>{
            db.collection("posts").add({
            timestamp:firebase.firestore.FieldValue.serverTimestamp(),
            caption:Caption,
            imgUrl:Url,
            username:username
            });
            console.log('File available at', Url);
            setProgress(0);
            setCaption("");
            setImage(null);
          })
    }
      
    )
    };
    return (
        <div className="imageupload">
            <progress className="ImageUpload__progress" value={progress} max="100" >{progress}</progress>
            <Input className="ImageUpload__input" type="text" placeholder="Enter The Caption....." onChange={(event)=>setCaption(event.target.value)} val={Caption}/>
            <Input className="ImageUpload__input"  type="file" onChange={handleChange} />
            {/* {   console.log("image: "+ image.name)} */}
            <Button className="Imageupload__button" onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload;
