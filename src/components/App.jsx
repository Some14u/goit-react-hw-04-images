import { useState, useRef, useEffect } from "react";
import React from "react";
import Searchbar from "./Searchbar";
import ImageGallery from "./ImageGallery";
import Modal from "./Modal";
import Button from "./Button";
import Loader from "./Loader"
import s from "./App.module.css";
import pixabayApi, { usePixabay } from "services/pixabayApi";


export function App() {
  const [items, setItems] = useState([]);

  const [searchString, setSearchString] = usePixabay("searchString", "");
  const [page, setPage] = usePixabay("page", 1);
  const [preloadImages, setPreloadImages] = usePixabay("preloadImages", false);

  const [itemsAvailable, setItemsAvailable] = useState(0);

  const [modal, setModal] = useState({ visible: false });

  const [isLoading, setIsLoading] = useState();
  const [isError, setIsError] = useState(false);

  const modalBase = useRef(document.getElementById("modal"));
  const isMounted = useRef(false);
  const oldItemsAvailable  = useRef(itemsAvailable);
  const scrollPos = useRef(0);
  const galleryNode = useRef(undefined);


  // Invokes search on searchString/page change. itemsAvaliable might also trigger this once, if it was set to null
  useEffect(() => {
    if (isMounted.current && oldItemsAvailable.current !== null) {
      doSearch().catch(e => setIsError(e.message));
    }
    oldItemsAvailable.current = itemsAvailable;
  }, [searchString, page, itemsAvailable]);

  // Scrolls when amount of items was changed
  useEffect(() => {
    if (!isMounted.current) return;
    window.scrollTo({ top: scrollPos.current + 8, behavior: scrollPos.current === 0 ? "instant" : "smooth" });
  }, [items]);

  // This should go last. Handles initial triggering flaw
  useEffect(() => { isMounted.current = true }, []);


  async function doSearch() {
    setIsLoading(true);
    setIsError(false);

    const [newItems, available] = await pixabayApi.fetchImages();

    scrollPos.current = galleryNode.current?.scrollHeight || 0;
    setItems(oldItems => [...oldItems, ...newItems]);
    setItemsAvailable(() => available);

    setIsLoading(false);
  }

  function onSubmit(searchString) {
    setItems([]);
    setItemsAvailable(null); // This ensures that useEffect will provide a new request
    setSearchString(searchString);
    setPage(1);
  }

  function nextPageAvailable() {
    const api = pixabayApi.api
    return items.length !== 0 && page * api.defaultQuery[api.fields.perPage] < itemsAvailable;
  }

  function showModal(url, tags) {
    setModal({ visible: true, url, tags });
  }

  function hideModal() {
    setModal({ visible: false });
  }

  function advancePage() {
    setPage(oldPageIdx => oldPageIdx + 1);
  }

  const togglePreloadImages = () => {
    setPreloadImages(oldState => !oldState);
  }

  return (
    <div className={s.app}>
      <Searchbar onSubmit={onSubmit} preloadImagesState={preloadImages} onPreloadImagesChange={togglePreloadImages} />
      { isError && <><h2>Something went wrong. Please, reload the page.</h2><p>{isError}</p></> }
      {!isError && (
        <>
          <ImageGallery items={items} showModalCb={showModal} ref={galleryNode} />
          { isLoading && <Loader /> }
          { !isLoading && nextPageAvailable() && <Button onClickCb={advancePage}>Load more</Button> }
          <Modal base={modalBase.current} {...modal} hideCb={hideModal} />
        </>
      )}
    </div>
  );
}

