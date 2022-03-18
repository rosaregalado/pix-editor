import React, { useState } from 'react';
import './App.css';
import ImageUploader from './ImageUploader'
import Slider from './Slider'
import SidebarItem from './SidebarItem'
// set photo editor default options
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
const defaultImageURL = "https://firebasestorage.googleapis.com/v0/b/pix-editor-7e027.appspot.com/o/images%2F17E57C65-1D03-4D99-BA44-ED0001D6256F.jpg?alt=media&token=f2086127-3278-4f7b-8d80-614d0816699b"
function ImageEditor({imageURL = ''}) {
  // use  state to select options AND set default options
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0)
  const [options, setOptions] = useState(default_options)
  const selectedOption = options[selectedOptionIndex]

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
    <div className='container'>
      <div><h1>Pix Editor</h1></div>
      <div className='main-image' style={getImageStyle()}></div>
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
  );
}

function App() {
  const [imageURL, setImageURL] = useState(defaultImageURL);
  return (
    <div>
      <ImageEditor imageURL={imageURL} />
      <ImageUploader setImageURL={setImageURL} />
    </div>
  )
}

export default App;
