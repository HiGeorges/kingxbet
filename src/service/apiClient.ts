import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://api.spid.cash',
    timeout: 600000,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    async config => {
        const token = localStorage.getItem('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    },
);

export default apiClient;
