import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

// Middleware
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";

// Root reducer
import rootReducer from "./../reducers";

const initStore = (initialState = {}) => {
  const loggerMiddleware = createLogger();
  
  return createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware, loggerMiddleware))
  );
};

export default initStore;
