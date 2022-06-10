import React from "react";
import Searchbar from "./Searchbar";
import axios from "axios";
import ImageGallery from "./ImageGallery";
import Modal from "./Modal";
import Button from "./Button";
import Loader from "./Loader"
import s from "./App.module.css";

export class App extends React.Component {

  static api = {
    url: "https://pixabay.com/api/",
    fields: {
      total: "totalHits",
      items: "hits",
      query: "q",
      page: "page",
      perPage: "per_page",
      previewURL: "webformatURL",
    },
    defaultQuery: {
      key: process.env.REACT_APP_SEARCH_KEY,
      image_type: "photo",
      orientation: "horizontal",
      per_page: 12,
    },
  }

  static modalBase = document.getElementById("modal");

  state = {
    items: [],
    itemsAvailable: 0,
    page: 1,
    modal: { visible: false },
    isLoading: false,
    error: null,
  };

  get requestParams() {
    const api = this.constructor.api;
    const { searchString, page } = this.state;
    return {
      ...api.defaultQuery,
      [api.fields.query]: searchString,
      [api.fields.page]: page,
    };
  }

  get nextPageAvailable() {
    const [api, { items, page, itemsAvailable }] = [this.constructor.api, this.state];
    return items.length!==0 && page * api.defaultQuery[api.fields.perPage] < itemsAvailable;
  }

  async fetchImages() {
    const api = this.constructor.api;
    // Get images list
    const { data } = await axios.get(api.url, { params: this.requestParams });
    const items = data ? data[api.fields.items] : [];
    // For each entrie predownload image and obtain local url
    const promises = items.map(item => axios.get(item[api.fields.previewURL], { responseType: 'blob' }));
    const responces = await Promise.allSettled(promises);
    const localURLs = responces.map(r => r.value && URL.createObjectURL(r.value.data));
    // Substitude remote urls to local ones
    items.forEach((item, idx) => item[api.fields.previewURL] = localURLs[idx] || "");

    return [ items, data[api.fields.total] ];
  };

  doSearch = async () => {
    this.setState({ isLoading: true });

    const [items, itemsAvailable] = await this.fetchImages();

    const scrollTo = document.getElementById("gallery")?.scrollHeight || 0;
    this.setState(
      {
        isLoading: false,
        items: [...this.state.items, ...items],
        itemsAvailable
      },
      () => window.scrollTo({ top: scrollTo + 8, behavior: scrollTo === 0 ? "instant" : "smooth" }),
    );
  }


  showModal = (url, tags) => {
    const modal = { visible: true, url, tags };
    this.setState({modal});
  }

  hideModal = () => {
    const modal = { visible: false };
    this.setState({modal});
  }

  advancePage = () => {
    this.setState( oldState => ({ page: oldState.page + 1 }),
    );
  }

  onSubmit = (searchString) => {
    this.setState({ searchString, items: [], itemsAvailable: 0, page: 1 });
  }

  componentDidUpdate(_, prevState) {
    const state = this.state;
    if (
      state.searchString !== prevState.searchString ||
      state.page !== prevState.page ||
      state.items.length < prevState.items.length
    ) this.doSearch().catch( e => this.setState({error: e}) );
  }

  render() {
    const { items, modal, isLoading, error } = this.state;
    return (
      <div className={s.app}>
        <Searchbar onSubmit={this.onSubmit} />
        { error && <><h2>Something went wrong. Please, reload page.</h2><p>{error}</p></> }
        { !error && <ImageGallery items={items} showModalCb={this.showModal} /> }
        { isLoading && <Loader /> }
        { !isLoading && this.nextPageAvailable && <Button onClickCb={this.advancePage}>Load more</Button> }
        <Modal base={this.constructor.modalBase} {...modal} hideCb={this.hideModal} />
      </div>
    );
  }
}
