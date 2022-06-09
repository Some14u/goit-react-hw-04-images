import PropTypes from "prop-types";
import SearchForm from "components/SearchForm";
import s from "./Searchbar.module.css";

export default function Searchbar({ onSubmit }) {
  return (
    <header className={s.searchbar}>
      <SearchForm onSubmit={onSubmit}/>
    </header>
  );
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}