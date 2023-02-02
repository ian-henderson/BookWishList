import FlatList from "flatlist-react/lib";
import { useMemo } from "react";

import { Work } from "../../types";
import "./BookGrid.sass";

interface IBookGrid {
  books: Work[];
  loadMoreItems: () => void;
  renderItem: (item: Work & { inWishList: boolean }) => JSX.Element;
  wishListMap: { [key: string]: boolean };
}

export default function BookGrid({
  books,
  loadMoreItems,
  renderItem,
  wishListMap,
}: IBookGrid) {
  const list: (Work & { inWishList: boolean })[] = useMemo(
    () => books.map((b) => ({ ...b, inWishList: !!wishListMap[b.key] })),
    [books, wishListMap]
  );

  return (
    <div className="BookGrid">
      <div className="BookGridContainer">
        <FlatList
          display={{ grid: true, gridGap: "0.5rem" }}
          hasMoreItems
          {...{ list, loadMoreItems, renderItem }}
        />
      </div>
    </div>
  );
}
