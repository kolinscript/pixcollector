import fetchIntercept from 'fetch-intercept';

const getToken = () => {
    const token = localStorage.getItem('token');
    return token;
};

export const interceptorError = fetchIntercept.register({
    responseError: function (error) {
        // Handle an fetch error
        console.log('responseError: ', error);
        localStorage.clear();
        // window.location = 'https://pixcollector.herokuapp.com/auth'; // redirect to AUTH
        return Promise.reject(error);
    }
});

export const interceptor = fetchIntercept.register({
    request: function (url, config) {
        if (getToken()) {
            config.headers.Authorization = `x-csrf-token ${getToken()}`;
        }
        return [url, config];
    },

    requestError: function (error) {
        // Called when an error occurred during another 'request' interceptor call
        // Handle an fetch error
        console.log('requestError: ', error);
        return Promise.reject(error);
    },

    response: function (response) {
        if (response.code >= 400) throw new Error('Request error');
        return response;
    }
});

// Unregister your interceptor
// unregister();