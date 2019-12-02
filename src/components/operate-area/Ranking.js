import React from 'react'
import { backgroundImageArr } from '../../utils'

function Ranking (props) {
  let {theme, ranking} = props
  return (
    <>
      {
        ranking.length > 0 &&
        <div className="ranking">
          <h4>当前排名：</h4>
          <div>
            {
              ranking.map((role, index) => {
                return (
                  <p key={index}>
                    <span>第 {index + 1} 名：</span>
                    <button
                      style={{
                        backgroundImage: backgroundImageArr[theme][role]
                      }}
                    />
                  </p>
                )
              })
            }
          </div>
        </div>
      }
    </>
  
  )
}

export default Ranking