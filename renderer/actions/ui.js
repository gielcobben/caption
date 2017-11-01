import * as types from "./../types";
import { ipcRenderer } from "electron";

export const setLanguage = language => dispatch => {
  dispatch({
    type: types.SET_LANGUAGE,
    payload: {
      language
    }
  });

  // Store current language in settings
  ipcRenderer.send("setStore", "language", language);
};
