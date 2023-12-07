import axios from "axios";

const api = axios.create({
    baseURL: "http://85.31.234.11:3000",
    timeout: 20000
});

export default api;