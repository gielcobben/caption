import { ipcRenderer } from "electron";

import * as types from "./../types";

export const hideSearchPlaceholder = () => (dispatch) => {
  dispatch({
    type: types.HIDE_SEARCH_PLACEHOLDER,
  });
};

export const showSearchPlaceholder = () => (dispatch) => {
  dispatch({
    type: types.SHOW_SEARCH_PLACEHOLDER,
  });
};

export const resetSearch = () => (dispatch) => {
  dispatch({
    type: types.RESET_SEARCH,
  });

  dispatch(showSearchPlaceholder());
};

export const updateSearchQuery = query => (dispatch) => {
  dispatch({
    type: types.UPDATE_SEARCH_QUERY,
    payload: {
      query,
    },
  });
};

export const showSearchSpinner = () => (dispatch) => {
  dispatch({
    type: types.SHOW_SEARCH_SPINNER,
  });
};

export const downloadComplete = () => (dispatch) => {
  dispatch({
    type: types.DOWNLOAD_COMPLETE,
  });
};

export const searchByQuery = () => (dispatch, getState) => {
  const state = getState();
  const { language } = state.ui;
  const { searchQuery } = state.search;

  dispatch({
    type: types.SEARCH_BY_QUERY,
  });

  ipcRenderer.send("textSearch", searchQuery, language);
};

export const searchByFiles = () => (dispatch, getState) => {
  const state = getState();
  const { language } = state.ui;
  const { files } = state.search;

  dispatch({
    type: types.SEARCH_BY_FILES,
  });

  ipcRenderer.send("fileSearch", files, language);
};

export const increaseSearchAttempts = () => (dispatch, getState) => {
  const state = getState();
  const previousSearchAttempts = state.search.searchAttempts;

  dispatch({
    type: types.INCREASE_SEARCH_ATTEMPTS,
    payload: {
      attempts: previousSearchAttempts + 1,
    },
  });
};

export const startSearch = () => (dispatch, getState) => {
  const state = getState();
  const { searchQuery, files } = state.search;

  dispatch(showSearchSpinner());
  dispatch(increaseSearchAttempts());

  if (searchQuery !== "") {
    return dispatch(searchByQuery());
  }

  if (files.length > 0) {
    return dispatch(searchByFiles());
  }

  return dispatch(resetSearch());
};

export const dropFiles = files => (dispatch) => {
  dispatch({
    type: types.DROP_FILES,
    payload: {
      files,
    },
  });

  dispatch(startSearch());
};

export const updateSearchResults = ({
  results,
  searchCompleted,
}) => (dispatch) => {
  dispatch({
    type: types.UPDATE_SEARCH_RESULTS,
    payload: {
      searchCompleted,
      results,
    },
  });
};