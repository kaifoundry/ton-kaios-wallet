const initialState = ``;
const saveMnmonicReducer = (state = initialState, action) => {
  if (action.type === "SAVE_MNMONIC") {
    state = action.payload;
    return action.payload;
  }
  return state;
};

export default saveMnmonicReducer;
