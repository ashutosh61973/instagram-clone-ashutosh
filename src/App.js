import React ,{useState,useEffect} from 'react';
import './App.css';
import Post from "./Post";
import {db,auth} from "./firebase";
import Modal from '@material-ui/core/Modal';
import {makeStyles} from '@material-ui/core/Styles'
import { Button,Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';
function getModalStyle() {
  const top=50;
  const left=50;

  return {
    top:`${top}%`,
    left:`${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes =useStyles();
  const [modalStyle]=useState(getModalStyle);
  const [posts,setPosts]=useState([]);
  const [open,setOpen]=useState(false);
  const [openSignIn,setOpenSignIn]=useState(false);
  const [username,setUsername]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [user,setUser]=useState(null);

useEffect(()=>{
  const unsubscribe=auth.onAuthStateChanged((authUser)=>{
    if(authUser)
    {
      //user logged in
      console.log(authUser);
      setUser(authUser);
    }
    else{
      //logged out
      setUser(null);
      
    }
  })
  return ()=>{
    unsubscribe();
  }

},[user,username]);


  useEffect(()=>{
    //useEffect code going here
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot=>{
      setPosts(snapshot.docs.map(doc=>{
        return {
          id:doc.id,
          post:doc.data()
        };
      }))
    })

  },[]);
  const signUp=(event)=>{
    event.preventDefault();
    auth
    .createUserWithEmailAndPassword(email,password)
    .then((authUser)=>{
      authUser.user.updateProfile({
        displayName:username})
      })
    .catch((error)=>alert(error.message));
    setOpen(false);
  }
  const signIn=(event)=>{
    event.preventDefault();
    auth
    .signInWithEmailAndPassword(email,password)
    .catch((error)=>alert(error.message));
    setOpenSignIn(false);
  }

  return (
   <div className="app">
    <Modal
      open={open}
      onClose={()=>setOpen(false)}
    >
    <div style={modalStyle} className={classes.paper}>
      <form className="app__signUp">
        <center>
          <img
          className="app_headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
          /> 
        </center>  
          <Input id="inp"
            placeholder="username"
            type="text"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
          />
          <Input id="inp"
            placeholder="email"
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />
          <Input id="inp"
            placeholder="password"
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />
          <Button
          type="submit"  
          id="signUp" 
          onClick={signUp}>signUp
          </Button> 
      </form>
    </div>
    </Modal>
    {/* //sign in Modal */}
    <Modal
      open={openSignIn}
      onClose={()=>setOpenSignIn(false)}
    >
    <div style={modalStyle} className={classes.paper}>
      <form className="app__signUp">
        <center>
          <img
          className="app_headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
          /> 
        </center>  
          <Input id="inp"
            placeholder="email"
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />
          <Input id="inp"
            placeholder="password"
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />
          <Button
          type="submit"  
          id="signUp" 
          onClick={signIn}>signIn
          </Button> 
      </form>
    </div>
    </Modal>
   { /*//////////////////////////////////////////////////////////////*/}
    <div className="app__header">
      <img
       className="app_headerImage"
       src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
       alt="a"
      />  
      {
        user?(<Button onClick={()=>auth.signOut()}>logOut</Button>)
        :
        (
          <div className="app_loginContainer">
          <Button onClick={()=>setOpenSignIn(true)}>sign In</Button>
          <Button onClick={()=>setOpen(true)}>sign Up</Button>
          </div>
        )
      }

    </div>
    {/* {user?(<Button onClick={()=>auth.signOut()}>logOut</Button>)
    :
      (
        <div className="app_loginContainer">
        <Button onClick={()=>setOpenSignIn(true)}>sign In</Button>
        <Button onClick={()=>setOpen(true)}>sign Up</Button>
        </div>
      )
    }
     */}
    
{/*     
    <h1 className="app__para">HELLO ASHU 🤡🤡🤡</h1> */}
    <div className="app__posts">
    <div className="app__posLeft">
      {
        posts.map((post)=>{
          const {username,caption,imgUrl}=post.post;
          const {idx}=post.id;
          return <Post key={idx} postId={idx} user={user} username={username} caption={caption} imgUrl={imgUrl}/>
        })

      }
    </div>
    <div className="app__postRight"> 
    <InstagramEmbed
      clientAccessToken='<appId>|<clientToken>'
      url='https://instagr.am/p/Zw9o4/'
      maxWidth={375}
      hideCaption={false}
      containerTagName='div'
      injectScript
      protocol=''
      onLoading={() => {}}
      onSuccess={() => {}}
      onAfterRender={() => {}}
      onFailure={() => {}}
    />
    </div>
    
  
    </div>
    
    {user?.displayName?
     ( <ImageUpload username={user.displayName}/>)
    :
     (<h2>sorry you need to login to upload</h2>)
    }
  
   </div>
  );
}

export default App;
