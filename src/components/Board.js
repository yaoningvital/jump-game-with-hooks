import React from 'react'
import Circle from './Circle'

function Board (props) {
  let {circles, r, a,theme} = props
  return (
    <div className="board-area">
      <div
        className="board"
        style={{
          width: `${29.44486 * (r + a / 2)}px`,
          height: `${29.44486 * (r + a / 2)}px`,
          borderRadius: `${14.7224 * (r + a / 2)}px`
        }}
      >
        {
          circles.map((rowArr, rowIndex) => {
            return (
              <div
                className="board-row"
                key={rowIndex}
                style={{
                  height: `${1.732 * (r + a / 2)}px`
                }}
              >
                {
                  rowArr.map((circleItem, columnIndex) => {
                    return (
                      <Circle
                        key={columnIndex}
                        circleData={circleItem}
                        r={r}
                        a={a}
                        theme={theme}
                      />
                    )
                  })
                }
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default Board