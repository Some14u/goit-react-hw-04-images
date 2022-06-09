import React from "react";
import PropTypes from "prop-types";
import s from "./SearchForm.module.css";

export default class SearchForm extends React.Component {
  state = { text: "" };

  handleInput = e => {
    const newText = e.target.value;
    this.setState({ text: newText });
  }

  handleSubmit = e => {
    e.preventDefault();
    const searchString = this.state.text.trim();
    if (!searchString) return;
    this.props.onSubmit(searchString);
  }
  
  render() {
    return (
      <form className={s.form} onSubmit={this.handleSubmit}>
        <button type="submit" className={s.button}>
          <span className={s.buttonLabel}>Search</span>
        </button>

        <input
          className={s.input}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          onChange={this.handleInput}
          value={this.state.text}
        />
      </form>
    )
  }
}

SearchForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}