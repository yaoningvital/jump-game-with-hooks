import React from 'react'
import circle_bg_0_0 from '../../assets/images/circle_bg_0_0.jpg'
import circle_bg_1_0 from "../../assets/images/circle_bg_1_0.jpg";
import circle_bg_2_0 from "../../assets/images/circle_bg_2_0.jpg";
import circle_bg_3_0 from "../../assets/images/circle_bg_3_0.jpg";
import circle_bg_4_0 from "../../assets/images/circle_bg_4_0.jpg";


function SelectTheme (props) {
  return (
    <div className="theme">
      <h4>请选择主题</h4>
      <div className="themes-wrap">
        <button
          style={{
            backgroundImage: `url(${circle_bg_0_0})`,
          }}
        />
        <button
          style={{
            backgroundImage: `url(${circle_bg_1_0})`,
          }}
        />
        <button
          style={{
            backgroundImage: `url(${circle_bg_2_0})`,
          }}
        />
        <button
          style={{
            backgroundImage: `url(${circle_bg_3_0})`,
          }}
        />
        <button
          style={{
            backgroundImage: `url(${circle_bg_4_0})`,
          }}
        />
      </div>
    </div>
  )
}

export default SelectTheme