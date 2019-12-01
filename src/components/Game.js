import React, { useState } from 'react'
import '../index.scss'
import Board from './Board'
import { circlesDefault, gameBackgroundImages } from '../utils'
import SelectTheme from './operate-area/SelectTheme'


function Game () {
  let [layout, setLayout] = useState({
    r: 20, // 棋子半径
    a: 20, // 棋子与同轴线上相邻棋子边缘的最短距离
  })
  
  // 主题
  let [theme, setTheme] = useState(0)
  
  function handleSelectTheme (index) {
    setTheme(index)
  }
  
  
  return (
    <div className="game">
      <div
        className="show-theme"
        style={{
          backgroundImage: gameBackgroundImages[theme]
        }}
      >
      
      </div>
      <Board
        r={layout.r}
        a={layout.a}
        circles={circlesDefault}
        theme={theme}
      />
      <div className="btns-area">
        <SelectTheme
          theme={theme}
          handleSelectTheme={(index) => handleSelectTheme(index)}
        />
      </div>
    </div>
  )
}

export default Game