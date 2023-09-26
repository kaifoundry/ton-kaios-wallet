export const saveAddress = (address) => {
  return { type: "SAVE_ADDRESS", payload: address };
};
export const saveMnmonic = (mnmonic) => {
  return { type: "SAVE_MNMONIC", payload: mnmonic };
};
export const savePassword = (password) => {
  return { type: "SAVE_PASSWORD", payload: password };
};
export const savePrivateKey = (privateKey) => {
  return { type: "SAVE_PRIVATE_KEY", payload: privateKey };
};
export const saveTransactionDetails = (details) => {
  return { type: "SAVE_TRANSACTION_DETAILS", payload: details };
};
