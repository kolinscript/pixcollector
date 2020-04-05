const router             = require('express').Router();
const axios              = require('axios');
const secure             = require('./secure');
const mongoose           = require('mongoose');
const Users              = mongoose.model('Users');

router.get('/', secure.optional, (req, res, next) => {
    const code = req.query.code;
    const authLink = `https://oauth.vk.com/access_token` +
        `?client_id=7372433` +
        `&client_secret=XgglLIZcB7qB3nNryc8y` +
        `&redirect_uri=https://pixcollector.herokuapp.com/api/v1/auth` +
        `&code=${code}`;
    axios.get(authLink)
        .then(function (response1) {
            const albumLink = `https://api.vk.com/` +
                `method/photos.getAlbums` +
                `?owner_id=${response1.data.user_id}` +
                `&access_token=${response1.data.access_token}` +
                `&need_system=1` +
                `&v=5.103`;
            // todo вынести на роут стока
            axios.get(albumLink)
                .then(function (response2) {
                    const albumSize = response2.data.response.items.find(item => item.id === -15).size;
                    const userNew = new Users({
                        vkId: response1.data.user_id,
                        vkToken: response1.data.access_token,
                        albumSize: albumSize
                    });
                    // save new or update existed user to db
                    Users.findOne({vkId: response1.data.user_id}, (err, user) => {
                        if (user) {
                            user.vkToken = userNew.vkToken;
                            user.albumSize = userNew.albumSize;
                            user.markModified('vkToken');
                            user.markModified('albumSize');
                            user.save()
                                .then(() => {
                                        req.session.user = user.toAuthJSON();
                                        res.redirect('/auth/success');
                                    }
                                );
                        }
                        if (!user) {
                            userNew.save()
                                .then(() => {
                                        req.session.user = userNew.toAuthJSON();
                                        res.redirect('/auth/success');
                                    }
                                );
                        }
                        if (err) return console.error(err);
                    });
                })
                .catch(function (error) {
                    console.log(error);
                });
        })
        .catch(function (error) {
            console.log(error);
        });
});

router.get('/success', secure.optional, (req, res, next) => {
    if (req.session.user) {
        res.status(200).json( { body: { token: req.session.user.token } });
    } else {
        res.status(200).json( { body: { error: 'unauthorized' } });
    }
});

module.exports = router;