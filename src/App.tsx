import { useEffect, useState } from "react";

import "./App.sass";
import BookGrid from "./Components/BookGrid/BookGrid";
import usePagination, { PaginationActionType } from "./hooks/usePagination";
import { Work } from "./types";
import formatNames from "./utils/formatNames";

const PAGE_SIZE = 10;

export default function App() {
  const [
    pagination,
    dispatchFailure,
    dispatchInit,
    dispatchRequest,
    dispatchSuccess,
  ] = usePagination<Work>();
  const [wishListMap, setWishListMap] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    if (pagination.isFetching || pagination.type !== PaginationActionType.Init)
      return undefined;

    dispatchRequest();

    const offset = PAGE_SIZE * pagination.pageCount;
    const url = `https://openlibrary.org/subjects/health.json?limit=${PAGE_SIZE}&offset=${offset}`;

    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        dispatchSuccess(result.works);
      })
      .catch((error) => {
        console.error(error);
        dispatchFailure();
      });
  }, [dispatchFailure, dispatchRequest, dispatchSuccess, pagination]);

  function renderItem({
    authors,
    inWishList,
    key,
    title,
  }: Work & { inWishList: boolean }) {
    function handleAddOrRemoveClick() {
      setWishListMap((previousWishListMap) => {
        // remove from state
        if (previousWishListMap[key])
          return Object.fromEntries(
            Object.entries(previousWishListMap).filter(([k]) => k !== key)
          );

        // add to state
        return { ...previousWishListMap, [key]: true };
      });
    }

    return (
      <div className="BookGridItem" {...{ key }}>
        <div className="Content">
          <div className="Title">{title}</div>
          <div className="Authors">
            {formatNames(authors.map((author) => author.name))}
          </div>
        </div>
        <div className="ActionsContainer">
          <button
            className="AddOrRemoveButton"
            onClick={handleAddOrRemoveClick}
          >
            {inWishList ? "Remove" : "Add"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="App">
      <div className="Page">
        <div className="Info">
          <div className="ViewBox">
            <b>View ({Object.values(wishListMap).length})</b>
          </div>
        </div>
        <div className="MessageArea">
          &#123; isFetching: {pagination.isFetching ? "true" : "false"}, page:{" "}
          {pagination.pageCount} &#125;
        </div>
        <BookGrid
          books={pagination.entities}
          loadMoreItems={dispatchInit}
          {...{ renderItem, wishListMap }}
        />
      </div>
    </main>
  );
}
