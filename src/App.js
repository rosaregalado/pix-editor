import React, { createRef, useState } from 'react';
import './App.css';
import ImageUploader from './ImageUploader'
import Slider from './Slider'
import SidebarItem from './SidebarItem'
import { useScreenshot } from 'use-react-screenshot'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storageRef } from './firebase/firebase';


// set editor default options
const default_options = [
  {
    name: 'Brightness',
    property: 'brightness',
    value: 100,
    range: {
      min: 0,
      max: 200
    },
    unit: '%'
  },
  {
    name: 'Contrast',
    property: 'contrast',
    value: 100,
    range: {
      min: 0,
      max: 200
    },
    unit: '%'
  },
  {
    name: 'Saturation',
    property: 'saturate',
    value: 100,
    range: {
      min: 0,
      max: 200
    },
    unit: '%'
  },
  {
    name: 'Grayscale',
    property: 'grayscale',
    value: 0,
    range: {
      min: 0,
      max: 100
    },
    unit: '%'
  },
  {
    name: 'Sepia',
    property: 'sepia',
    value: 0,
    range: {
      min: 0,
      max: 100
    },
    unit: '%'
  },
  {
    name: 'Hue Rotate',
    property: 'hue-rotate',
    value: 0,
    range: {
      min: 0,
      max: 360
    },
    unit: 'deg' 
  },
  {
    name: 'Blur Effect',
    property: 'blur',
    value: 0,
    range: {
      min: 0,
      max: 20
    },
    unit: 'px' 
  }
]
const defaultImageURL = "https://finestayslovenia.com/wp-content/uploads/2019/01/lake-jasna-2-1536x1025.jpg"

function ImageEditor({handleUpload, imageURL = ''}) {
  // use  state to select options AND set default options
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0)
  const [options, setOptions] = useState(default_options)
  const selectedOption = options[selectedOptionIndex]
  // create screenshot feature
  const screenshotRef = createRef(null)
  const [screenshot, takeScreenshot] = useScreenshot()
  const getImage = () => {
    takeScreenshot(screenshotRef.current)
    handleUpload()
  }

  //handle slider changes
  function handleSliderChange({ target }) {
    setOptions(prevOptions => {
      return prevOptions.map((option, index) => {
        if(index !== selectedOptionIndex) return option
        return { ...option, value: target.value }
      })
    })
  }

  // apply filters to image
  function getImageStyle() {
    // convert options to css properties
    const filters = options.map(option => {
      return `${option.property}(${option.value}${option.unit})`
    })
    return {filter: filters.join(' '), backgroundImage: `url(${imageURL})`}
  }

  return (
    <div>
      <div className='container' >
        <div className='main-image' style={getImageStyle()} ref={screenshotRef}></div>
        <div className='sidebar'>
          {options.map((option, index) => {
            return (
              <SidebarItem
                key = {index}
                name = {option.name}
                active = {index === selectedOptionIndex}
                handleClick={() => setSelectedOptionIndex(index)}
              />
            )
          })}
        </div> 
        <Slider
          min={selectedOption.range.min}
          max={selectedOption.range.max}
          value={selectedOption.value}
          handleChange={handleSliderChange}
        /> 
      </div>
      {/* screenshot component */}
      <div className="screenshot">
        <button style={{ marginBottom: '10px' }} onClick={getImage}>
          Save copy to cloud!
        </button>
        <img width={'50%'} src={screenshot} alt={'Screenshot'} />
        <div>
          Share this custom picture with your friends: <a href={imageURL}>Image URL</a>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [imageURL, setImageURL] = useState(defaultImageURL);
  const [image, setImage] = useState(null);

  const handleUpload = () => {
    // const storageRef = ref(storage);
    // console.log(storageRef, typeof storageRef, typeof function(){})  
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
      <div className="title">
        <h1>Pix Editor</h1>
        <img src={`${process.env.PUBLIC_URL}/images/camera_logo1.jpeg`} width='80px' heigh='40px' alt="logo" />
      </div>
      <ImageUploader setImageURL={setImageURL} setImage={setImage} />
      <ImageEditor imageURL={imageURL} handleUpload={handleUpload} />
    </div>
  )
}

export default App;
