import React from 'react'

function RotateBoard (props) {
  let {handleRotate} = props
  return (
    <div className="rotate-board">
      <h4>旋转棋盘：</h4>
      <div>
        <button onClick={() => handleRotate(60)}>顺时针旋转60°</button>
        <button onClick={() => handleRotate(120)}>顺时针旋转120°</button>
        <button onClick={() => handleRotate(180)}>顺时针旋转180°</button>
      </div>
    </div>
  )
}

export default RotateBoard