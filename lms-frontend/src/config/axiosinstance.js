import axios from "axios";

//const BASE_URL = "http://localhost:5000/api/v1";
// baseURL: 'http://localhost:5000/api/v1', // your base URL
//     headers: {
//     'Content-Type': 'application/json',
//   },
const axiosInstance = axios.create({
    baseURL: 'https://vercel.com/pampari-nareshs-projects/learning-management-system/api/v1',
    // headers: {
    //     'Content-Type': 'multipart/form-data', // for handling form data including files
    // },
    withCredentials: true,
});

// axiosInstance.defaults.baseURL = BASE_URL;
//axiosInstance.defaults.timeout = 2500;
axiosInstance.defaults.withCredentials = true;

export default axiosInstance;