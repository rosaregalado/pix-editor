import React, { useState, useEffect } from 'react';
import ReactDOM, { render } from 'react-dom';
import './index.css';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storageRef } from './firebase/firebase';
import reportWebVitals from './reportWebVitals';

const FirebaseImageUpload = ({setImageURL, setImage}) => {

  // handle change of file
  const handleChange = e => {
    const file = e.target.files[0];
    if (file) {
      setImage(file)
      getBase64(file, base64URL => setImageURL(base64URL))
    }
  };
  // https://stackoverflow.com/questions/47176280/how-to-convert-files-to-base64-in-react
  const getBase64 = (file, cb) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        cb(reader.result)
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
  }

  return (
    <div className='upload-div'>
      <h3 className="upload-title">Upload an Image</h3>
      <input type='file' onChange={handleChange} accept="image/png, image/jpeg" />
      {/* <img src={imageURL} alt="Uploaded Photo" width="500" height="600" /> */}
    </div>
  );
};
export default FirebaseImageUpload;