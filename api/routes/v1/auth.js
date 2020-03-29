const router             = require('express').Router();
const request            = require('request');

router.get('/', (req, res, next) => {
    const state = req.app.get('state').state;
    const { code: { code } } = req;
    console.log(code);
    const link = `https://oauth.vk.com/access_token` +
        `?client_id=7372433` +
        `&client_secret=XgglLIZcB7qB3nNryc8y` +
        `&redirect_uri=https://pixcollector.herokuapp.com/api/v1/auth` +
        `&code=${code}`;
    request(link, function (error0, response0, body0) {
        const bodyParsed = JSON.parse(body0);
        state.access_token = bodyParsed.access_token;
        state.user_id = bodyParsed.user_id;
        req.app.set('state', {state});
        const albumLink = `https://api.vk.com/` +
            `method/photos.getAlbums` +
            `?owner_id=${state.user_id}` +
            `&access_token=${state.access_token}` +
            `&need_system=1` +
            `&v=${state.vkApiVersion}`;
        request(albumLink, function (error1, response1, body1) {
            state.albumSize = JSON.parse(body1).response.items.find((item) => {return item.id === -15}).size;
            req.app.set('state', {state});
            res.send({
                body: {
                    auth: 'Successfully authorized.',
                    size: state.albumSize
                }
            });
        });
    });
});

router.post('/', (req, res, next) => {
    const state = req.app.get('state').state;
    const { body: { link } } = req;
    request(link, function (error0, response0, body0) {
        const bodyParsed = JSON.parse(body0);
        state.access_token = bodyParsed.access_token;
        state.user_id = bodyParsed.user_id;
        req.app.set('state', {state});
        const albumLink = `https://api.vk.com/` +
            `method/photos.getAlbums` +
            `?owner_id=${state.user_id}` +
            `&access_token=${state.access_token}` +
            `&need_system=1` +
            `&v=${state.vkApiVersion}`;
        request(albumLink, function (error1, response1, body1) {
            state.albumSize = JSON.parse(body1).response.items.find((item) => {return item.id === -15}).size;
            req.app.set('state', {state});
            res.send({
                body: {
                    auth: 'Successfully authorized.',
                    size: state.albumSize
                }
            });
        });
    });
});

module.exports = router;