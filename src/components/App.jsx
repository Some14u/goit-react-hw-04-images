import React from "react";
import Searchbar from "./Searchbar";
import ImageGallery from "./ImageGallery";
import Modal from "./Modal";
import Button from "./Button";
import Loader from "./Loader"
import s from "./App.module.css";
import pixabay from "services/pixabayApi";


export class App extends React.Component {
  static modalBase = document.getElementById("modal");

  state = {
    items: [],
    itemsAvailable: 0,
    page: 1,
    modal: { visible: false },
    isLoading: false,
    error: null,
    preloadImages: false,
  };

  get nextPageAvailable() {
    const [api, { items, page, itemsAvailable }] = [pixabay.api, this.state];
    return items.length!==0 && page * api.defaultQuery[api.fields.perPage] < itemsAvailable;
  }

  componentDidUpdate(_, prevState) {
  if (
      this.state.searchString !== prevState.searchString ||
      this.state.page !== prevState.page ||
      this.state.items.length < prevState.items.length
    ) this.doSearch().catch( e => this.setState({error: e.message}) );
  }

  doSearch = async () => {
    this.setState({ isLoading: true, error: null });

    const [items, itemsAvailable] = await pixabay.fetchImages(this.state);

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

  togglePreloadImages = () => {
    this.setState(oldState => ({ preloadImages: !oldState.preloadImages }));
  }

  render() {
    const { items, modal, isLoading, error, preloadImages } = this.state;
    return (
      <div className={s.app}>
        <Searchbar onSubmit={this.onSubmit} preloadImagesState={preloadImages} onPreloadImagesChange={this.togglePreloadImages} />
        { error && <><h2>Something went wrong. Please, reload the page.</h2><p>{error}</p></> }
        {!error && (
          <>
            <ImageGallery items={items} showModalCb={this.showModal} />
            { isLoading && <Loader /> }
            { !isLoading && this.nextPageAvailable && <Button onClickCb={this.advancePage}>Load more</Button> }
            <Modal base={this.constructor.modalBase} {...modal} hideCb={this.hideModal} />
          </>
        )}
      </div>
    );
  }
}
