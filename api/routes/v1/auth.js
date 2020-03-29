const router        = require('express').Router();
const state         = req.app.get('state');

app.post('/', (req, res, next) => {
    const { body: { link } } = req;
    request(link, function (error0, response0, body0) {
        const bodyParsed = JSON.parse(body0);
        state.access_token = bodyParsed.access_token;
        state.user_id = bodyParsed.user_id;
        const albumLink = `https://api.vk.com/` +
            `method/photos.getAlbums` +
            `?owner_id=${state.user_id}` +
            `&access_token=${state.access_token}` +
            `&need_system=1` +
            `&v=${state.vkApiVersion}`;
        request(albumLink, function (error1, response1, body1) {
            state.albumSize = JSON.parse(body1).response.items.find((item) => {return item.id === -15}).size;
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