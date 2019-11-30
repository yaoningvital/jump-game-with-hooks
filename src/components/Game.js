import React, { useState } from 'react'
import '../index.scss'
import Board from './Board'
import { circlesDefault } from '../utils'
import SelectTheme from './operate-area/SelectTheme'


function Game () {
  let [layout, setLayout] = useState({
    r: 20, // 棋子半径
    a: 20, // 棋子与同轴线上相邻棋子边缘的最短距离
  })
  
  // 主题
  let [theme, setTheme] = useState(4)
  
  
  return (
    <div className="game">
      <Board
        r={layout.r}
        a={layout.a}
        circles={circlesDefault}
        theme={theme}
      />
      <div className="btns-area">
        <SelectTheme
        
        />
      </div>
    </div>
  )
}

export default Game