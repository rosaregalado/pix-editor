import React, { useState } from 'react';
import './App.css';
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

function App() {
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
    return {filter: filters.join(' ')}
  }

  return (
    <div className='container'>
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

export default App;
