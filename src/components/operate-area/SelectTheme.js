import React from 'react'
import { themes } from '../../utils'


function SelectTheme (props) {
  let {theme, handleSelectTheme} = props
  
  
  return (
    <div className="theme">
      <h4>请选择主题</h4>
      <div className="themes-wrap">
        {
          themes.map((themeImage, index) => {
            let btnClassName = ''
            if (theme === index) {
              btnClassName = 'current-theme'
            }
            return (
              <button
                key={index}
                className={btnClassName}
                style={{
                  backgroundImage: themeImage,
                }}
                onClick={() => handleSelectTheme(index)}
              />
            )
          })
        }
      </div>
    </div>
  )
}

export default SelectTheme