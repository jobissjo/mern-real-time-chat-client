import axios from "axios";


const axiosInstance = axios.create({
    baseURL: "http://192.168.1.40:5000"
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