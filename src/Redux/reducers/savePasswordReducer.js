const initialState = ``;
const savePasswordReducer = (state = initialState, action) => {
  if (action.type === "SAVE_PASSWORD") {
    state = action.payload;
    return action.payload;
  }
  return state;
};

export default savePasswordReducer;
