import React from "react";
import ReactDOM from "react-dom";
import s from "./Modal.module.css";
import PropTypes from "prop-types";


export default class Modal extends React.Component {
  static closeKey = "Escape";

  componentDidMount() {
    document.addEventListener("keydown", this.keyboardListener);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keyboardListener);
  }

    keyboardListener = e => {
    if (e.key === this.constructor.closeKey) this.props.hideCb();
  }

  handleOverlayClick = e => e.target === e.currentTarget && this.props.hideCb();

  render() {
    const { base, visible, url, tags } = this.props;
    if (!visible) return;

    return ReactDOM.createPortal(
      <div className={s.overlay} onClick={ this.handleOverlayClick }>
        <div className={s.modal}>
          <img src={url} alt={tags}/>
        </div>
      </div>
    , base);
  }
}

Modal.propTypes = {
  base: PropTypes.object.isRequired,
  visible: PropTypes.bool.isRequired,
  url: PropTypes.string,
  tags: PropTypes.string,
  hideCb: PropTypes.func.isRequired,
}