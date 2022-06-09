import PropTypes from "prop-types";
import s from "./ImageGalleryItem.module.css";

export default function ImageGalleryItem({largeImageURL, webformatURL, tags, showModalCb}) {

  return (
    <li className={s.item} onClick={e => showModalCb(largeImageURL, tags)}>
      <img className={s.itemImage} src={webformatURL} alt={tags} />
    </li>
  );
}

ImageGalleryItem.propTypes = {
  largeImageURL: PropTypes.string.isRequired,
  webformatURL: PropTypes.string.isRequired,
  tags: PropTypes.string.isRequired,
  showModalCb: PropTypes.func,
}

