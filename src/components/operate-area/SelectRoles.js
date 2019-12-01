import React from 'react'
import { backgroundImageArr } from "../../utils";

function SelectRoles (props) {
  let {theme, selectedRoles, handleSelectRole, history} = props
  
  return (
    <div className="select-roles">
      <h4>请选择角色：</h4>
      <div className="roles">
        {
          backgroundImageArr[theme].map((roleImage, index) => {
            let selectedClassName = ''
            if (selectedRoles.includes(index)) {
              selectedClassName = 'selected'
            }
            // 已经开始走出一步后，不可点击
            let disabled = false
            if (history.length > 1) {
              disabled = true
              selectedClassName += ' disabled'
            }
            return (
              <button
                key={index}
                className={selectedClassName}
                style={{
                  backgroundImage: roleImage,
                }}
                onClick={() => handleSelectRole(index)}
                disabled={disabled}
              />
            )
          })
        }
      </div>
    </div>
  )
}

export default SelectRoles