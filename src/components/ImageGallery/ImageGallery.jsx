import { forwardRef } from "react";
import s from "./ImageGallery.module.css";
import PropTypes from "prop-types";
import ImageGalleryItem from "./ImageGalleryItem";

const ImageGallery = forwardRef(({ items, showModalCb }, galleryRef) => {
  if (items.length === 0) return;

  const buildItem = ({ id, ...props }) => {
    return < ImageGalleryItem key={id} {...props} showModalCb={showModalCb} />;
  }

  return (
    <ul id="gallery" className={s.gallery} ref={galleryRef}>
      {items.map(buildItem)}
    </ul>
  );
});

export default ImageGallery;

ImageGallery.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
  })).isRequired,
  showModalCb: PropTypes.func,
}

