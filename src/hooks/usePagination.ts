import { Reducer, useReducer } from "react";

export enum PaginationActionType {
  Failure = "Failure",
  Init = "Init",
  Request = "Request",
  Success = "Success",
}

export type PaginationState<Entity> = {
  entities: { [key: string]: Entity };
  keys: string[];
  isFetching: boolean;
  pageCount: number;
  type: PaginationActionType;
};

export const initialState = {
  keys: [],
  entities: {},
  isFetching: false,
  pageCount: 0,
  type: PaginationActionType.Init,
};

export type PaginationAction<Entity> = {
  entities?: Entity[];
  type: PaginationActionType;
};

type MapEntityToKey<Entity> = (e: Entity) => string;

// Dispatch Function Types
type DispatchFailure = () => void;
type DispatchInit = () => void;
type DispatchRequest = () => void;
type DispatchSuccess<Entity> = (entities: Entity[]) => void;

interface IUsePagination<Entity> {
  mapEntityToKey?: MapEntityToKey<Entity>;
}

export default function usePagination<Entity extends { key: string }>({
  mapEntityToKey = (e: Entity) => e.key,
}: IUsePagination<Entity> = {}): [
  PaginationState<Entity>,
  DispatchFailure,
  DispatchInit,
  DispatchRequest,
  DispatchSuccess<Entity>
] {
  const [state, dispatch] = useReducer<
    Reducer<PaginationState<Entity>, PaginationAction<Entity>>
  >(paginationReducer(mapEntityToKey), initialState);

  function dispatchFailure() {
    dispatch({ type: PaginationActionType.Failure });
  }

  function dispatchInit() {
    dispatch({ type: PaginationActionType.Init });
  }

  function dispatchRequest() {
    dispatch({ type: PaginationActionType.Request });
  }

  function dispatchSuccess(entities: Entity[]) {
    dispatch({ entities, type: PaginationActionType.Success });
  }

  return [
    state,
    dispatchFailure,
    dispatchInit,
    dispatchRequest,
    dispatchSuccess,
  ];
}

export const paginationReducer =
  <Entity>(mapEntityToKey: MapEntityToKey<Entity>) =>
  (
    state: PaginationState<Entity> = initialState,
    { entities = [], type }: PaginationAction<Entity>
  ) => {
    if (type === PaginationActionType.Failure)
      return { ...state, isFetching: false, type };

    if (type === PaginationActionType.Init) return { ...state, type };

    if (type === PaginationActionType.Request)
      return { ...state, isFetching: true, type };

    if (type === PaginationActionType.Success) {
      return {
        ...state,
        entities: {
          ...state.entities,
          ...Object.fromEntries(
            entities.map((e: Entity) => [mapEntityToKey(e), e])
          ),
        },
        isFetching: false,
        keys: [...state.keys, ...entities.map(mapEntityToKey)],
        pageCount: state.pageCount + 1,
        type,
      };
    }

    return state;
  };
