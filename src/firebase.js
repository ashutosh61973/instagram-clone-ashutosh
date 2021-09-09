
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
const firebaseApp =firebase.initializeApp({
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    apiKey: "AIzaSyDao-q7r_8VtXQrNoDQINqed135xEwD_Ds",
    authDomain: "instagram-clone-react-fbe3a.firebaseapp.com",
    projectId: "instagram-clone-react-fbe3a",
    storageBucket: "instagram-clone-react-fbe3a.appspot.com",
    messagingSenderId: "610669384778",
    appId: "1:610669384778:web:e5eb4e75edd6b34e7982b3",
    measurementId: "G-XF14Y3CCJ3"
  
});
const db=firebaseApp.firestore();
const auth=firebase.auth();
const storage=firebase.storage;

export {db,auth,storage};

  