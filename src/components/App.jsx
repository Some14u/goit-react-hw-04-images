import React from "react";
import Searchbar from "./Searchbar";
import axios from "axios";
import ImageGallery from "./ImageGallery";
import Modal from "./Modal";
import Button from "./Button";
import Loader from "./Loader";
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
    },
    defaultQuery: {
      key: process.env.REACT_APP_SEARCH_KEY,
      image_type: "photo",
      orientation: "horizontal",
      per_page: 12,
    },
    loading: false,
  }

  static modalBase = document.getElementById("modal");

  state = {
    items: [],
    itemsAvailable: 0,
    page: 1,
    modal: { visible: false },
  };

  async fetchImages (list) {
    var promises, responces
    // form and request urls
    promises = list.map(item => fetch((Math.random() > 1 ? "asdf" : "") + item.webformatURL));
    responces = await Promise.allSettled(promises);
    // form and request blobs
    promises = responces.map(r => r.value?.blob());
    responces = await Promise.allSettled(promises);
    // form and return local url's
    return responces.map(r => r.value && URL.createObjectURL(r.value));
  };

  doSearch = async (searchString) => {
    const api = this.constructor.api;

    var items = searchString ? [] : this.state.items;
    const page = searchString ? 1 : this.state.page;
    
    this.setState({ loading: true, items });

    const query = {
      ...api.defaultQuery,
      [api.fields.query]: searchString || this.state.searchString,
      [api.fields.page]: page,
    };
    
    const { data } = await axios.get(api.url, { params: query });
    const newItems = data ? data[api.fields.items] : [];

    const localImgURLs = await this.fetchImages(data[api.fields.items]);
    newItems.forEach((item, idx) => item.webformatURL = localImgURLs[idx] || "");

    items = [...items, ...newItems];

    const scrollTo = searchString ? 0 : (document.getElementById("gallery")?.scrollHeight || 0);

    this.setState(
      {
        loading: false,
        searchString: searchString || this.state.searchString,
        items,
        page,
        itemsAvailable: data[api.fields.total],
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
    this.setState(
      oldState => ({ page: oldState.page + 1 }),
      () => this.doSearch()
    );
  }

  get nextPageAvailable() {
    const [api, { items, page, itemsAvailable }] = [this.constructor.api, this.state];
    return items.length!==0 && page * api.defaultQuery[api.fields.perPage] < itemsAvailable;
  }


  render() {
    const { items, modal, loading } = this.state;
    return (
      <div className={s.app}>
        <Searchbar onSubmit={this.doSearch} />
        <ImageGallery items={items} showModalCb={this.showModal} />

        {loading && <Loader />}
        {this.nextPageAvailable && !loading && <Button onClickCb={this.advancePage}>Load more</Button>}
        
        <Modal base={this.constructor.modalBase} {...modal} hideCb={this.hideModal} />
      </div>
    );
  }
}
