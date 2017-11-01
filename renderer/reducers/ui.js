import * as types from "./../types";

const initialState = {
  language: "eng",
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.SET_LANGUAGE:
      return {
        ...state,
        language: action.payload.language,
      };
    default:
      return state;
  }
}
