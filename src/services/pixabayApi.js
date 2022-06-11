import axios from "axios";

const api = {
  url: "https://pixabay.com/api/",
  fields: {
    total: "totalHits",
    items: "hits",
    query: "q",
    page: "page",
    perPage: "per_page",
    previewURL: "webformatURL",
    largeImageURL: "largeImageURL",
    tags: "tags",
  },
  defaultQuery: {
    key: process.env.REACT_APP_SEARCH_KEY,
    image_type: "photo",
    orientation: "horizontal",
    per_page: 12,
  },
}

function requestParams(searchString, page) {
  return {
    ...api.defaultQuery,
    [api.fields.query]: searchString,
    [api.fields.page]: page,
  };
}

async function preloadImages(items) {
  // For each entrie predownload image and obtain local url
  const promises = items.map(item => axios.get(item[api.fields.previewURL], { responseType: 'blob' }));
  const responces = await Promise.allSettled(promises);
  const localURLs = responces.map(r => r.value && URL.createObjectURL(r.value.data));
  // Substitude remote urls to local ones
  items.forEach((item, idx) => item[api.fields.previewURL] = localURLs[idx] || "");
}

async function fetchImages({ searchString, page, preloadImages: doPreloadImages }) {
  // Get images list
  const { data } = await axios.get(api.url, { params: requestParams(searchString, page) });
  const items = data ? data[api.fields.items] : [];

  if (doPreloadImages) await preloadImages(items);

  return [ items, data[api.fields.total] ];
};

const pixabay = { api, fetchImages };

export default pixabay;
