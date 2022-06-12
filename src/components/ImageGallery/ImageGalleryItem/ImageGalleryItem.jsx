import pixabay from "services/pixabayApi";
import PropTypes from "prop-types";
import s from "./ImageGalleryItem.module.css";

const f = pixabay.api.fields;

export default function ImageGalleryItem(props) {
  const {
    [f.previewURL]: previewURL,
    [f.largeImageURL]: largeImageURL = previewURL,
    [f.tags]: tags = "",
    showModalCb
  } = props;

  return (
    <li className={s.item} onClick={e => showModalCb(largeImageURL, tags)}>
      <img className={s.itemImage} src={previewURL} alt={tags} />
    </li>
  );
}

ImageGalleryItem.propTypes = {
  [f.previewURL]: PropTypes.string.isRequired,
  [f.largeImageURL]: PropTypes.string,
  [f.tags]: PropTypes.string,
  showModalCb: PropTypes.func,
}

