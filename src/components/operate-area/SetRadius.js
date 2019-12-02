import React from 'react'

function SetRadius (props) {
  let {setRadius, setDistance} = props
  return (
    <div className="set-radius">
      <h4>设置棋子半径、棋子间距：</h4>
      <div>
        <div>
          <span>半径（默认20px）：</span>
          <input
            type="number"
            onKeyUp={setRadius}
          />
          <span>px</span>
        </div>
        <div>
          <span>间距（默认20px）：</span>
          <input
            type="number"
            onKeyUp={setDistance}
          />
          <span>px</span>
        </div>
      </div>
    </div>
  )
}

export default SetRadius