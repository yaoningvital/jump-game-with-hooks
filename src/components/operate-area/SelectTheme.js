import React from 'react'
import { themes } from '../../utils'


function SelectTheme (props) {
  let {theme, handleSelectTheme, history} = props
  
  return (
    <div className="theme">
      <h4>请选择主题：</h4>
      <div className="themes-wrap">
        {
          themes.map((themeImage, index) => {
            let btnClassName = ''
            if (theme === index) {
              btnClassName = 'current-theme'
            }
            // 已经开始走出一步后，不可点击
            let disabled = false
            if (history.length > 1) {
              disabled = true
              btnClassName += ' disabled'
            }
            return (
              <button
                key={index}
                className={btnClassName}
                style={{
                  backgroundImage: themeImage,
                }}
                onClick={() => handleSelectTheme(index)}
                disabled={disabled}
              />
            )
          })
        }
      </div>
    </div>
  )
}

export default SelectTheme