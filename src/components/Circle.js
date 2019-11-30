import React from 'react'
import { backgroundImageArr } from '../utils'

function Circle (props) {
  let {circleData, r, a, theme} = props
  
  let backgroundImage = 'radial-gradient(at 80px 80px, rgba(0, 0, 0, 0), #ddd)'
  let boxShadow = '2px 2px 2px #888888 inset'
  if (circleData.role !== null) {
    backgroundImage = backgroundImageArr[theme][circleData.role]
    boxShadow = '2px 2px 2px #888888'
  }
  
  return (
    <div
      className="circle-item"
      style={{
        width: ` ${r * 2}px`,
        height: ` ${r * 2}px`,
        borderRadius: ` ${r}px`,
        margin: `0 ${a / 2}px`,
        backgroundSize: `${r * 2}px ${r * 2}px`,
        backgroundImage: backgroundImage,
        boxShadow: boxShadow
      }}
    />
  )
}

export default Circle