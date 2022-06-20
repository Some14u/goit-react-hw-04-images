import { useState } from "react";
import PropTypes from "prop-types";
import s from "./SearchForm.module.css";

export default function SearchForm({ onSubmit }) {
  const [text, setText] = useState("");

  function handleInput(event) {
    setText(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const searchString = text.trim();
    if (!searchString) return;
    onSubmit(searchString);
  }

  return (
    <form className={s.form} onSubmit={handleSubmit}>
      <button type="submit" className={s.button}>
        <span className={s.buttonLabel}>Search</span>
      </button>

      <input
        className={s.input}
        type="text"
        autoComplete="off"
        autoFocus
        placeholder="Search images and photos"
        onChange={handleInput}
        value={text}
      />
    </form>
  )
}

SearchForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}