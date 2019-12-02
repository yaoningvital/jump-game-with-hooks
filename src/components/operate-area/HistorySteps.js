import React from 'react'

function HistorySteps (props) {
  let {history, handleBackTo} = props
  return (
    <React.Fragment>
      {
        history.length > 1 &&
        <div className="history-steps">
          <h4>历史记录：</h4>
          <div>
            {
              history.map((stepObj, stepNum) => {
                let desc = stepNum ? `回退到第 ${stepNum} 步` : `重新开始游戏`
                return (
                  <button
                    key={stepNum}
                    onClick={() => handleBackTo(stepNum)}
                  >{desc}</button>
                )
              })
            }
          </div>
        </div>
      }
    </React.Fragment>
  )
}

export default HistorySteps