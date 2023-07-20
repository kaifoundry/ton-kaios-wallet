const initialState = ``;
const savePrivateKeyReducer = (state = initialState, action) => {
  if (action.type === "SAVE_PRIVATE_KEY") {
    state = action.payload;
    return action.payload;
  }
  return state;
};

export default savePrivateKeyReducer;
