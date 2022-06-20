import axios from "axios";
import { useEffect, useState } from "react";

class PixabayApi {
  api = {
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


  searchString = "dog";
  page = 1;
  preloadImages = false;

  requestParams(searchString, page) {
    return {
      ...this.api.defaultQuery,
      [this.api.fields.query]: searchString,
      [this.api.fields.page]: page,
    };
  }

  async doPreloadImages(items) {
    // For each entrie predownload image and obtain local url
    const promises = items.map(item => axios.get(item[this.api.fields.previewURL], { responseType: 'blob' }));
    const responces = await Promise.allSettled(promises);
    const localURLs = responces.map(r => r.value && URL.createObjectURL(r.value.data));
    // Substitude remote urls to local onesd
    items.forEach(
      (item, idx) => (item[this.api.fields.previewURL] = localURLs[idx] || '')
    );
  }

  async fetchImages(
    { searchString, page, preloadImages: doPreloadImages } =
    { searchString: this.searchString, page: this.page, preloadImages: this.preloadImages }) {
    // Get images list
    const { data } = await axios.get(this.api.url, { params: this.requestParams(searchString, page) });
    const items = data ? data[this.api.fields.items] : [];

    if (doPreloadImages) await this.doPreloadImages(items);

    return [items, data[this.api.fields.total]];
  };

}

const pixabayApi = new PixabayApi();

export const usePixabay = (stateName, initialState) => {
  const [state, setState] = useState(initialState);
  useEffect(() => {
    pixabayApi[stateName] = state;
  }, [state, stateName]);
  return [state, setState];
}


export default pixabayApi;
