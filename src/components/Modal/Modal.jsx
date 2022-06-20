import { useEffect } from "react";
import ReactDOM from "react-dom";
import s from "./Modal.module.css";
import PropTypes from "prop-types";

const closeKey = "Escape";

export default function Modal({ base, visible, url, tags, hideCb }) {
  useEffect(() => {
    function keyboardListener(event) {
      if (event.key === closeKey) hideCb();
    }
    document.addEventListener("keydown", keyboardListener);
    return () => document.removeEventListener("keydown", keyboardListener);
  }, [hideCb]);

  function handleOverlayClick(event) {
    if (event.target === event.currentTarget) hideCb();
  }

  if (!visible) return;

  return ReactDOM.createPortal(
      <div className={s.overlay} onClick={ handleOverlayClick }>
        <div className={s.modal}>
          <img src={url} alt={tags}/>
        </div>
      </div>
    , base
  );
}

Modal.propTypes = {
  base: PropTypes.object.isRequired,
  visible: PropTypes.bool.isRequired,
  url: PropTypes.string,
  tags: PropTypes.string,
  hideCb: PropTypes.func.isRequired,
}