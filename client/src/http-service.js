import axios from "axios";

const getToken = () => {
    return localStorage.getItem('token');
};

export default {
    setupInterceptors: () => {
        axios.interceptors.request.use(request => {
            if (getToken()) {
                request.headers.Authorization = `x-csrf-token ${getToken()}`;
            }
            return request;
        }, function(error) {
            return Promise.reject(error);
        });

        axios.interceptors.response.use(response => {
            return response;
        }, error => {

            console.log('** interceptor ** error response: ', error);
            if (error.response.status === 401) {
                console.log('** interceptor ** error response: ', error);
                // localStorage.clear();
                // window.location = 'https://pixcollector.herokuapp.com/auth'; // redirect to AUTH
            }

            return Promise.reject(error);
        });
    },
};