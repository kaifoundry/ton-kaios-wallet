import axios from "axios";
import CryptoJS from "crypto-js";
var userAgent = navigator.userAgent;
const secretKey = "ton-wallet-create-hash-of-password"; //this secret key use encrytion for password.


// Handle Save Data
export const saveData = (name, data) => {
  localStorage.setItem(name, JSON.stringify(data));
};

// Convertt Password into Hash
export const passwordHash = (password) => {
  let passwordHash = password;
  for (let i = 0; i < 5; i++) {
    passwordHash = String(CryptoJS.MD5(passwordHash));
  }
  return passwordHash;
}

// Handle Encryption
export const encryptData = (password, data) => {
  let secretKey = CryptoJS.SHA256(passwordHash(passwordHash(password) + passwordHash(userAgent)));
  let encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    secretKey.toString()
  ).toString();
  return encrypted;
};

// Handle Decryption
export const decryptData = (password, data) => {
  let secretKey = CryptoJS.SHA256(passwordHash(passwordHash(password) + passwordHash(userAgent)));
  let bytes = CryptoJS.AES.decrypt(data, secretKey.toString());
  let decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decrypted;
};

// Handle encryption of password
export const encryptPassword = (password) => {
  let passwordHash = CryptoJS.AES.encrypt(password, secretKey).toString();
  return passwordHash;
};

// Handle decryption of password
export const decryptPassword = (passwordHash) => {
  let bytes = CryptoJS.AES.decrypt(passwordHash, secretKey);
  let password = bytes.toString(CryptoJS.enc.Utf8);
  return password;
};

// Handle Copy
export const copyToClipboard = (linkToGo) => {
  if (typeof navigator.clipboard == "undefined") {
    var textArea = document.createElement("textarea");
    textArea.value = linkToGo;
    textArea.style.position = "fixed"; //avoid scrolling to bottom
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand("copy");
      var msg = successful ? "successful" : "unsuccessful";
    } catch (err) {
      console.warning("Was not possible to copy te text: ", err);
    }

    document.body.removeChild(textArea);
    return;
  }
  navigator.clipboard.writeText(linkToGo).then(
    function () {
      console.log(`successful!`);
    },
    function (err) {
      console.warning("unsuccessful!", err);
    }
  );
};