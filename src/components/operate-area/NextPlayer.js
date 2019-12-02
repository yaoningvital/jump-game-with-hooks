import React from 'react'
import { backgroundImageArr, getNotCompleteRoles } from "../../utils";

function NextPlayer (props) {
  let {theme, selectedRoles, ranking, currentRole} = props
  let notCompleteRoles = getNotCompleteRoles(selectedRoles, ranking)
  
  return (
    <React.Fragment>
      {
        notCompleteRoles.length > 0 &&
        <div className="next-player">
          <h4>下一步：</h4>
          <div className="players">
            {
              notCompleteRoles.map((role, index) => {
                // 设置当前玩家角色的样式
                let btnClassName = ''
                if (role === currentRole) {
                  btnClassName = 'current-role'
                }
                return (
                  <button
                    key={index}
                    className={btnClassName}
                    style={{
                      backgroundImage: backgroundImageArr[theme][role],
                    }}
                  />
                )
              })
            }
          </div>
        </div>
      }
    </React.Fragment>
  )
}

export default NextPlayer