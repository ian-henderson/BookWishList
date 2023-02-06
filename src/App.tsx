import { useEffect, useState } from "react";

import BookGrid from "./Components/BookGrid/BookGrid";
import usePagination, { PaginationActionType } from "./hooks/usePagination";
import formatNames from "./utils/formatNames";
import "./App.sass";
import { Work } from "./types";

const PAGE_SIZE = 45;

export default function App() {
  const [
    pagination,
    dispatchFailure,
    dispatchInit,
    dispatchRequest,
    dispatchSuccess,
  ] = usePagination<Work & { isInWishList?: boolean }>();

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
      .then((result) => dispatchSuccess(result.works))
      .catch((error) => {
        console.error(error);
        dispatchFailure();
      });
  }, [dispatchFailure, dispatchRequest, dispatchSuccess, pagination]);

  function renderItem({
    authors,
    isInWishList,
    key,
    title,
  }: Work & { isInWishList?: boolean }) {
    function handleAddOrRemoveClick() {
      setWishListMap((previousWishListMap) => {
        // removes key to trigger refresh (as opposed to just changing value)
        if (isInWishList)
          return Object.fromEntries(
            Object.entries(previousWishListMap).filter(([k]) => k !== key)
          );

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
            {isInWishList ? "Remove" : "Add"}
          </button>
        </div>
      </div>
    );
  }

  const books = pagination.keys.map((key) => ({
    ...pagination.entities[key],
    isInWishList: wishListMap[key],
  }));

  return (
    <main className="App">
      <div className="Page">
        <div className="Info">
          <div className="ViewBox">
            <b>View ({Object.values(wishListMap).length})</b>
          </div>
        </div>
        <div className="MessageArea">
          &#123; loading: {pagination.isFetching ? "true" : "false"}, page:{" "}
          {pagination.pageCount} &#125;
        </div>
        <BookGrid loadMoreItems={dispatchInit} {...{ books, renderItem }} />
      </div>
    </main>
  );
}
