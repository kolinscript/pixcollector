import fetchIntercept from 'fetch-intercept';

const getToken = () => {
    const token = localStorage.getItem('token');
    return token;
};

export const unregister = fetchIntercept.register({
    request: function (url, config) {
        config.headers.Authorization = `x-csrf-token ${getToken()}`;
        return [url, config];
    },

    requestError: function (error) {
        // Called when an error occured during another 'request' interceptor call
        // Handle an fetch error
        console.log('requestError: ', error);
        return Promise.reject(error);
    },

    response: function (response) {
        // Modify the reponse object
        return response;
    },

    responseError: function (error) {
        // Handle an fetch error
        console.log('responseError: ', error);
        return Promise.reject(error);
    }
});

// Unregister your interceptor
// unregister();