import s from "./ImageGallery.module.css";
import PropTypes from "prop-types";
import ImageGalleryItem from "./ImageGalleryItem";

export default function ImageGallery({ items, showModalCb }) {
  if (items.length === 0) return;

  const buildItem = ({ id, ...props }) => {
    return < ImageGalleryItem key={id} {...props} showModalCb={showModalCb} />;
  }

  return (
    <ul id="gallery" className={s.gallery}>
      { items.map(buildItem) }
    </ul>
  );
}

ImageGallery.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
  })).isRequired,
  showModalCb: PropTypes.func,
}

