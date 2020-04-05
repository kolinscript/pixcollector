const jwt                = require('express-jwt');

const getTokenFromHeaders = (req) => {
    const { headers: { authorization } } = req;
    if(authorization && authorization.split(' ')[0] === 'x-csrf-token') {
        return authorization.split(' ')[1];
    }
    return null;
};

const secure = {
    required: jwt({
        secret: 'pix',
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
    }),
    optional: jwt({
        secret: 'pix',
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
        credentialsRequired: false,
    }),
};

module.exports = secure;