import axios from "axios";
import { BASE_URL } from "./apiPaths.js";


export const axiosInstance = axios.create({
    baseURL : BASE_URL,
    timeout : 10000,
    headers : {
        "Content-Type" : "application/json",
        Accept : "application/json",
    },
});


// Request Interceptor

axiosInstance.interceptors.request.use(
    (config) => {
        const acessToken = localStorage.getItem("token");
        if(acessToken) {
            config.headers.Authorization = `Bearer ${acessToken}`
        }
        return config;
    },
    (error) =>{
        return Promise.reject(error)
    }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // handle common errors globally
        if(error.response){
            if(error.response.status === 401){
                // Redirect to login page
                window.location.href = "/login"
            }
            else if(error.response.status === 500){
                console.error("server error. Please try again later.")
            }
        }
            else if(error.code === "ECONNABORTED"){
                console.error("Request timeout. Please try again")
            }
            return Promise.reject(error);
    }
);
