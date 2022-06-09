import PropTypes from "prop-types";
import s from "./Button.module.css";

export default function Button({onClickCb, children}) {
  return (
    <div className={s.wrapper}>
      <button className={s.button} type="button" onClick={onClickCb}>{children}</button>
    </div>
  )
}

Button.propTypes = {
  onClickCb: PropTypes.func.isRequired,
}