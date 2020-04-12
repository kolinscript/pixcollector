const axios              = require('axios');
const mongoose           = require('mongoose');
const Users              = mongoose.model('Users');

module.exports = {
    vkUserFetchSaveSend: function(req, res, next) {
        const albumLink = `https://api.vk.com/` +
            `method/photos.getAlbums` +
            `?owner_id=${response1.data.user_id}` +
            `&access_token=${response1.data.access_token}` +
            `&need_system=1` +
            `&v=5.103`;
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
        next();
    }
};