const axios = require('axios');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Users = mongoose.model('Users');

// add photo to vk saved folder
const photo = {
    vkSave: (req, res, next) => {
        const owner_id = req.body.owner_id;
        const photo_id = req.body.photo_id;
        const {headers: {authorization}} = req;
        let token;
        let tokenVkId;
        if (authorization && authorization.split(' ')[0] === 'token') {
            token = authorization.split(' ')[1];
            tokenVkId = jwt.verify(token, 'collector_secret').vkId;
        }
        Users.findOne({vkId: tokenVkId}, (err, userDbFromToken) => {
            if (err) {
                res.status(200).json({body: {error: err}});
            }
            if (userDbFromToken) {
                const link = `https://api.vk.com/` +
                    `method/photos.copy` +
                    `?access_token=${userDbFromToken.vkToken}` +
                    `&owner_id=${owner_id}` +
                    `&photo_id=${photo_id}` +
                    `&v=5.120`;
                axios.get(link)
                    .then(function (response) {
                        if (response.data) {
                            res.status(200).json({body: {data: response.data}});
                        }
                    })
                    .catch(function (error) {
                        res.status(200).json({body: {error: {text: error, code: 5}}});
                    });
            } else {
                res.status(200).json({body: {error: {text: 'found no userDbFromToken', code: 0}}});
            }
        });
    },

    vkLike: (req, res, next) => {
        const owner_id = req.body.owner_id;
        const photo_id = req.body.photo_id;
        const vkTokenIF = req.body.vkTokenIF;
        const origin = req.body.origin;
        const link = `https://api.vk.com/` +
            `method/likes.add` +
            `?owner_id=${owner_id}` +
            `&item_id=${photo_id}` +
            `&type=photo` +
            `&access_token=${vkTokenIF}` +
            `&v=5.120`;
        const config = {
            headers: {
                Origin: origin,
            }
        }
        axios.get(link, config)
            .then((response) => {
                console.log('______response______', response);
                if (response.data) {
                    res.status(200).json({body: {data: response.data}});
                }
            })
            .catch((error) => {
                res.status(200).json({body: {error: {text: error, code: 5}}});
            });
    }
}

module.exports = photo;
