import { combineReducers } from "redux";
import saveAddressReducer from "./saveAddressReducer.js";
import saveMnmonicReducer from "./saveMnmonicReducer.js";
import savePasswordReducer from "./savePasswordReducer.js";
import savePrivateKeyReducer from "./savePrivateKeyReducer.js";

const rootReducer = combineReducers({
  saveAddressReducer,
  saveMnmonicReducer,
  savePasswordReducer,
  savePrivateKeyReducer,
});

export default rootReducer;
