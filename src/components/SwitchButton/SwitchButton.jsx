import PropTypes from "prop-types";
import s from "./SwitchButton.module.css"


export default function SwitchButton({ state = false, caption = "", changeCb }) {
  return (
    <>
      <input
        className={s.checkbox}
        checked={state}
        type="checkbox"
        onChange={changeCb}
        id={"SwitchButton"}
      />
      <label className={s.label} htmlFor={"SwitchButton"}>
        <span className={s.buttonField}>
          <span className={s.button}></span>
        </span>
        {caption}
      </label>
    </>
  )
}

SwitchButton.propTypes = {
  state: PropTypes.bool,
  caption: PropTypes.string,
  changeCb: PropTypes.func.isRequired,
}