import PropTypes from "prop-types";
import SearchForm from "components/SearchForm";
import s from "./Searchbar.module.css";
import SwitchButton from "components/SwitchButton";

export default function Searchbar({ onSubmit, preloadImagesState, onPreloadImagesChange }) {
  return (
    <header className={s.searchbar}>
      <SearchForm onSubmit={onSubmit} />
      <SwitchButton state={preloadImagesState} caption="Preload images" changeCb={onPreloadImagesChange} />
    </header>
  );
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  preloadImagesState: PropTypes.bool.isRequired,
  onPreloadImagesChange: PropTypes.func.isRequired,
}