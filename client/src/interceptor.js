import fetchInterceptor from 'fetch-interceptor';
import fetchIntercept from 'fetch-intercept';

const getToken = () => {
    const token = localStorage.getItem('token');
    return token;
};

// Register interceptor hooks
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
export const interceptorErr = fetchIntercept.register({
    requestError: function (error) {
        // Called when an error occured during another 'request' interceptor call
        console.log('** interceptor ** requestError: ', error);
        return Promise.reject(error);
    },
});

export const interceptor = fetchIntercept.register({
    requestError: function (error) {
        // Called when an error occured during another 'request' interceptor call
        console.log('** interceptor ** requestError: ', error);
        return Promise.reject(error);
    },

    request: function (url, config) {
        // Modify the url or config here
        if (getToken()) {
            config.headers.Authorization = `x-csrf-token ${getToken()}`;
        }
        return [url, config];
    },

    response: function (response) {
        // Modify the reponse object
        return response;
    },

    responseError: function (error) {
        // Handle an fetch error
        console.log('** interceptor ** responseError: ', error);
        return Promise.reject(error);
    }
});