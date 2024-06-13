import axios from "axios"
import { BASE_URL } from "./constants"

const axiosIns = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
})

axiosIns.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token")
        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

export default axiosIns