import { Reducer, useReducer } from "react";

export enum PaginationActionType {
  Failure = "Failure",
  Init = "Init",
  Request = "Request",
  Success = "Success",
}

export type PaginationState<Entity> = {
  entities: Entity[];
  isFetching: boolean;
  pageCount: number;
  type: PaginationActionType;
};

export type PaginationAction<Entity> = {
  payload?: Entity[];
  type: PaginationActionType;
};

export const initialState = {
  entities: [],
  isFetching: false,
  pageCount: 0,
  type: PaginationActionType.Init,
};

type DispatchFailure = () => void;
type DispatchInit = () => void;
type DispatchRequest = () => void;
type DispatchSuccess<Entity> = (payload: Entity[]) => void;

export default function usePagination<Entity>(): [
  PaginationState<Entity>,
  DispatchFailure,
  DispatchInit,
  DispatchRequest,
  DispatchSuccess<Entity>
] {
  const [state, dispatch] = useReducer<
    Reducer<PaginationState<Entity>, PaginationAction<Entity>>
  >(paginationReducer, initialState);

  function dispatchFailure() {
    dispatch({ type: PaginationActionType.Failure });
  }

  function dispatchInit() {
    dispatch({ type: PaginationActionType.Init });
  }

  function dispatchRequest() {
    dispatch({ type: PaginationActionType.Request });
  }

  function dispatchSuccess(payload: Entity[]) {
    dispatch({ payload, type: PaginationActionType.Success });
  }

  return [
    state,
    dispatchFailure,
    dispatchInit,
    dispatchRequest,
    dispatchSuccess,
  ];
}

export function paginationReducer<Entity>(
  state: PaginationState<Entity> = initialState,
  { payload, type }: PaginationAction<Entity>
) {
  if (type === PaginationActionType.Failure)
    return { ...state, isFetching: false, type };

  if (type === PaginationActionType.Init) return { ...state, type };

  if (type === PaginationActionType.Request)
    return { ...state, isFetching: true, type };

  if (type === PaginationActionType.Success) {
    return {
      ...state,
      entities: [...state.entities, ...(payload || [])],
      isFetching: false,
      pageCount: state.pageCount + 1,
      type,
    };
  }

  return state;
}
