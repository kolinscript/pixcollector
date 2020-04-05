import fetchInterceptor from 'fetch-interceptor';

const getToken = () => {
    const token = localStorage.getItem('token');
    return token;
};

// Register interceptor hooks
export const interceptor = fetchInterceptor.register({
    onBeforeRequest(request, controller) {
        if (getToken()) {
            request.headers.Authorization = `x-csrf-token ${getToken()}`;
        }
    },
    onRequestSuccess(response, request) {
        // Hook on response success
    },
    onRequestFailure(response, request) {
        console.log('** interceptor ** error response: ', response);
        if (response.status === 401) {
            // localStorage.clear();
            // window.location = 'https://pixcollector.herokuapp.com/auth'; // redirect to AUTH
        }
    }
});