import axios from "axios";


const axiosInstance = axios.create({
    baseURL: "https://breakfast-louisiana-attorneys-work.trycloudflare.com"
})

axiosInstance.interceptors.request.use(
    async config => {
        config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
        return config;
    },
    error => {
        Promise.reject(error);
    }
)

export {axiosInstance};