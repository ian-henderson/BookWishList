import FlatList from "flatlist-react/lib";

import { Work } from "../../types";
import "./BookGrid.sass";

interface IBookGrid {
  books: (Work & { isInWishList: boolean })[];
  loadMoreItems: () => void;
  renderItem: (item: Work & { isInWishList: boolean }) => JSX.Element;
}

export default function BookGrid({
  books,
  loadMoreItems,
  renderItem,
}: IBookGrid) {
  return (
    <div className="BookGrid">
      <div className="BookGridContainer">
        <FlatList
          display={{ grid: true, gridGap: "0.5rem" }}
          hasMoreItems
          list={books}
          {...{ loadMoreItems, renderItem }}
        />
      </div>
    </div>
  );
}
