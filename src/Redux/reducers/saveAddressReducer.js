const initialState = ``;
const saveAddressReducer = (state = initialState, action) => {
  if (action.type === "SAVE_ADDRESS") {
    state = action.payload;
    return action.payload;
  }
  return state;
};

export default saveAddressReducer;
