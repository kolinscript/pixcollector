const router             = require('express').Router();
const request            = require('request');
const axios              = require('axios');
const secure             = require('./secure');
const mongoose           = require('mongoose');
const Users              = mongoose.model('Users');

router.get('/', secure.optional, (req, res, next) => {
    const code = req.query.code;
    const link = `https://oauth.vk.com/access_token` +
        `?client_id=7372433` +
        `&client_secret=XgglLIZcB7qB3nNryc8y` +
        `&redirect_uri=https://pixcollector.herokuapp.com/api/v1/auth` +
        `&code=${code}`;
    request(link, function (error0, response0, body0) {
        const bodyParsed = JSON.parse(body0);
        req.session.access_token = bodyParsed.access_token;
        req.session.user_id = bodyParsed.user_id;
        // save user to DB
        const user = new Users({
            vkId: bodyParsed.user_id,
            vkToken: bodyParsed.access_token
        });
        user.setVkToken(bodyParsed.access_token);
        user.save()
            .then(() => {
                    req.session.user = user.toAuthJSON();
                }
            );
        //
        const albumLink = `https://api.vk.com/` +
            `method/photos.getAlbums` +
            `?owner_id=${req.session.user_id}` +
            `&access_token=${req.session.access_token}` +
            `&need_system=1` +
            `&v=5.103`;
        axios.get(albumLink)
            .then(function (response) {
                console.log('axiosResponse: ', response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
        request(albumLink, function (error1, response1, body1) {
            req.session.albumSize = JSON.parse(body1).response.items.find((item) => {return item.id === -15}).size;
            console.log(req.session.albumSize);
            console.log('requestResponse: ', JSON.parse(body1).response.items);
            res.redirect('/stock');
        });
    });
});

module.exports = router;