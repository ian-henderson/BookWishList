import { renderHook } from "@testing-library/react";
import { act } from "react-dom/test-utils";

import { Work } from "../types";
import usePagination, {
  initialState,
  PaginationActionType,
} from "./usePagination";

describe("hooks/usePagination", () => {
  test("initial state", () => {
    const { result } = renderHook(() => usePagination<Work>());
    expect(result.current[0]).toBe(initialState);
    expect(typeof result.current[1] === "function").toBeTruthy();
    expect(typeof result.current[2] === "function").toBeTruthy();
    expect(typeof result.current[3] === "function").toBeTruthy();
    expect(typeof result.current[4] === "function").toBeTruthy();
  });

  test("dispatchFailure", () => {
    const { result } = renderHook(() => usePagination<Work>());
    act(() => result.current[1]());
    expect(result.current[0]).toEqual({
      ...initialState,
      isFetching: false,
      type: PaginationActionType.Failure,
    });
  });

  test("dispatchInit", () => {
    const { result } = renderHook(() => usePagination<Work>());
    act(() => result.current[2]());
    expect(result.current[0]).toEqual({
      ...initialState,
      type: PaginationActionType.Init,
    });
  });

  test("dispatchRequest", () => {
    const { result } = renderHook(() => usePagination<Work>());
    act(() => result.current[3]());
    expect(result.current[0]).toEqual({
      ...initialState,
      isFetching: true,
      type: PaginationActionType.Request,
    });
  });

  test("dispatchSuccess", () => {
    const { result } = renderHook(() => usePagination<Work>());
    act(() => result.current[4]([]));
    expect(result.current[0]).toEqual({
      ...initialState,
      entities: [],
      isFetching: false,
      pageCount: 1,
      type: PaginationActionType.Success,
    });
  });
});
