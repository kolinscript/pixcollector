import axios from "axios";

const getToken = () => {
    const token = localStorage.getItem('token');
    return token;
};

// export default axios.create({
//     baseURL: "/",
//     responseType: "json",
//     headers: {
//         Authorization: `x-csrf-token ${getToken()}`
//     }
// });
//
// import axios from 'axios';

export default {
    setupInterceptors: () => {
        axios.defaults.headers.Authorization = `x-csrf-token ${getToken()}`;
        axios.interceptors.response.use(response => {
            return response;
        }, error => {

            if (error.response.status === 401) {
                console.log('** interceptor ** error response: ', error);
                // localStorage.clear();
//             // window.location = 'https://pixcollector.herokuapp.com/auth'; // redirect to AUTH
            }

            if (error.response.status === 404) {
                history.push('/not-found');
            }

            return Promise.reject(error);
        });
    },
};

// import fetchInterceptor from 'fetch-interceptor';
// import fetchIntercept from 'fetch-intercept';
//
// const getToken = () => {
//     const token = localStorage.getItem('token');
//     return token;
// };
//
// // Register interceptor hooks
// export const interceptor = fetchInterceptor.register({
//     onBeforeRequest(request, controller) {
//         console.log('** interceptor ** request: ', request);
//         console.log('** interceptor ** controller: ', controller);
//         if (getToken()) {
//             request.headers.Authorization = `x-csrf-token ${getToken()}`;
//         }
//     },
//     onRequestSuccess(response, request) {
//         // Hook on response success
//     },
//     onRequestFailure(response, request) {
//         console.log('** interceptor ** error response: ', response);
//         if (response.status === 401) {
//             // localStorage.clear();
//             // window.location = 'https://pixcollector.herokuapp.com/auth'; // redirect to AUTH
//         }
//     }
// });