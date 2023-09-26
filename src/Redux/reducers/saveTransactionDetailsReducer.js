const initialState = {};
const  saveTransactionDetailsReducer = (state = initialState, action) => {
  if (action.type === "SAVE_TRANSACTION_DETAILS") {
    state = action.payload;
    return action.payload;
  }
  return state;
};

export default saveTransactionDetailsReducer;
