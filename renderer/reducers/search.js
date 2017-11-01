import * as types from "./../types";

const initialState = {
  files: [],
  results: [],
  loading: false,
  searchCompleted: true,
  searchQuery: "",
  placeholder: "Search for a show...",
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.RESET_SEARCH:
      return {
        ...state,
        placeholder: "Search for a show...",
        searchQuery: "",
        files: [],
        results: [],
        loading: false,
        searchCompleted: true,
      };
    case types.SHOW_SEARCH_PLACEHOLDER:
      return {
        ...state,
        placeholder: "Search for a show...",
      };
    case types.HIDE_SEARCH_PLACEHOLDER:
      return {
        ...state,
        placeholder: "",
      };
    case types.UPDATE_SEARCH_QUERY:
      return {
        ...state,
        files: [],
        results: [],
        searchQuery: action.payload.query,
      };
    case types.SHOW_SEARCH_SPINNER:
      return {
        ...state,
        loading: true,
        searchCompleted: false,
      };
    case types.DOWNLOAD_COMPLETE:
      return {
        ...state,
        loading: false,
        searchCompleted: true,
      };
    case types.UPDATE_SEARCH_RESULTS:
      return {
        ...state,
        loading: false,
        results: action.payload.results,
        searchCompleted: action.payload.searchCompleted,
      };
    case types.DROP_FILES:
      return {
        ...state,
        files: action.payload.files,
      };
    default:
      return state;
  }
}
