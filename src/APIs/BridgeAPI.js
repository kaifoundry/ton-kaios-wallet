import axios from "axios";


export default axios.create({
  baseURL: "https://bridge.tonapi.io/bridge",
});