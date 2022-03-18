import React, { useState, useEffect } from 'react';
import ReactDOM, { render } from 'react-dom';
import './index.css';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storageRef } from './firebase/firebase';
import App from './App';
import reportWebVitals from './reportWebVitals';

const FirebaseImageUpload = ({setImageURL}) => {
  const [ image, setImage ] = useState(null);

  // handle change of file
  const handleChange = e => {
    if (e.target.files[0]) {
      setImage(e.target.files[0])
    }
  };
  const handleUpload = () => {
    // const storageRef = ref(storage);
    console.log(storageRef, typeof storageRef, typeof function(){})  
    // create a new folder 'images' inside firebase storage
    const storageImagesRef = ref(storageRef, `images/${image.name}`)

    const uploadTask = uploadBytesResumable(storageImagesRef, image);

    uploadTask.on('state_changed', 
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      }, 
      (error) => {
        // Handle unsuccessful uploads
      }, 
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          setImageURL(downloadURL)
        });
      }
    );
  };

  return (
    <div>
      <br />
      <input type='file' onChange={handleChange} accept="image/png, image/jpeg" />
      <button onClick={handleUpload}>Upload</button>
      {/* <img src={imageURL} alt="Uploaded Photo" width="500" height="600" /> */}
    </div>
  );
};
export default FirebaseImageUpload;