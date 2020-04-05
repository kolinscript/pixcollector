import fetchIntercept from 'fetch-intercept';

export const token = () => {
    const token = localStorage.getItem('token');
    return token;
};

export const unregister = fetchIntercept.register({
    request: function (url, config) {
        // Modify the url or config here
        config.headers.token = token();
        return [url, config];
    },

    requestError: function (error) {
        // Called when an error occured during another 'request' interceptor call
        return Promise.reject(error);
    },

    response: function (response) {
        // Modify the reponse object
        return response;
    },

    responseError: function (error) {
        // Handle an fetch error
        return Promise.reject(error);
    }
});

// Unregister your interceptor
// unregister();