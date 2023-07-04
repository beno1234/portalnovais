import axios from "axios";

const api = axios.create({
    baseURL: "http://vps43892.publiccloud.com.br",
    timeout: 20000
});

export default api;