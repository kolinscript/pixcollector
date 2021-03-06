const axios = require('axios');
const helpers = require('./helpers')

const auth = {
    login: ((req, res, next) => {
        const code = req.query.code;
        const authLink = `https://oauth.vk.com/access_token` +
            `?client_id=7372433` +
            `&client_secret=XgglLIZcB7qB3nNryc8y` +
            `&redirect_uri=https://pixcollector.herokuapp.com/auth` +
            `&code=${code}`;

        axios.get(authLink)
            .then((responseAuth) => {
                helpers.UserGetVkData(req, res, next, responseAuth.data.access_token, responseAuth.data.user_id);
            })
            .catch((error) => {
                res.status(200).json({body: {error: {text: error, code: 5}}});
            });
    }),
};

module.exports = auth;
