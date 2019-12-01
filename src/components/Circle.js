import React from 'react'
import { backgroundImageArr } from '../utils'

function Circle (props) {
  let {circleData, r, a, theme, handleClickCircle, currentSelectedCell, ableReceive} = props
  
  let buttonWidth = r * 2
  let buttonMargin = `0 ${a / 2}px`
  
  // 设置空格的样式
  let backgroundImage = 'radial-gradient(at 80px 80px, rgba(0, 0, 0, 0), #ddd)'
  let boxShadow = '2px 2px 2px #888888 inset'
  // 设置棋子的样式
  if (circleData.role !== null) {
    backgroundImage = backgroundImageArr[theme][circleData.role]
    boxShadow = '2px 2px 2px #888888'
  }
  // 设置选中棋子的样式
  if (circleData.rowIndex === currentSelectedCell.rowIndex && circleData.columnIndex === currentSelectedCell.columnIndex) {
    buttonWidth += r / 2   // 选中的棋子宽度要增加半径的一半
    buttonMargin = `0 ${a / 2 - r / 4}px`
    boxShadow = '6px 6px 2px rgba(0,0,0,0.4)'
  }
  // 设置落子点的样式
  let circleClassName = 'circle-item'
  if (ableReceive) {
    circleClassName = 'circle-item able-receive'
  }
  
  return (
    <div
      className={circleClassName}
      style={{
        width: `${buttonWidth}px`,
        height: `${buttonWidth}px`,
        borderRadius: `${buttonWidth / 2}px`,
        margin: buttonMargin,
        backgroundSize: `${buttonWidth}px ${buttonWidth}px`,
        backgroundImage: backgroundImage,
        boxShadow: boxShadow
      }}
      onClick={() => handleClickCircle(circleData, ableReceive)}
    />
  )
}

export default Circle