import { combineReducers } from "redux";

import ui from "./ui";
import search from "./search";

export default combineReducers({
  ui,
  search,
});
