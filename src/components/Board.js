import React from 'react'
import Circle from './Circle'
import { isAbleReceiveCell } from '../utils'

function Board (props) {
  let {circles, r, a, theme, handleClickCircle, currentSelectedCell, ableReceiveCells} = props
  
  return (
    <div
      className="board-area"
    >
      <div
        className="board"
        style={{
          width: `${29.44486 * (r + a / 2)}px`,
          height: `${29.44486 * (r + a / 2)}px`,
          borderRadius: `${14.7224 * (r + a / 2)}px`,
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
                    let ableReceive = isAbleReceiveCell(ableReceiveCells, circleItem)
                    return (
                      <Circle
                        key={columnIndex}
                        circleData={circleItem}
                        r={r}
                        a={a}
                        theme={theme}
                        handleClickCircle={handleClickCircle}
                        currentSelectedCell={currentSelectedCell}
                        ableReceive={ableReceive}
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