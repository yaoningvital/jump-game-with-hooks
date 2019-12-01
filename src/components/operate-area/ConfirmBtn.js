import React from 'react'

function ConfirmBtn (props) {
  let {cashCirclesArr,handleConfirm} = props
  return (
    <button
      className="confirm-btn"
      disabled={cashCirclesArr.length <= 1}
      onClick={handleConfirm}
    >确定</button>
  )
}

export default ConfirmBtn