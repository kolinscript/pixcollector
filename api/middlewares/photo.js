const axios = require('axios');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Users = mongoose.model('Users');

// add photo to vk saved folder
const photo = {
    vkSave: (req, res, next) => {
        const owner_id = req.body.owner_id;
        const photo_id = req.body.photo_id;
        const vkTokenIF = req.body.vkTokenIF;
        const link = `https://api.vk.com/` +
            `method/photos.copy` +
            `?access_token=${vkTokenIF}` +
            `&owner_id=${owner_id}` +
            `&photo_id=${photo_id}` +
            `&v=5.120`;
        axios.get(link)
            .then((response) => {
                console.log('______response______', response);
                if (response.data) {
                    res.status(200).json({body: {data: response.data}});
                }
            })
            .catch((error) => {
                res.status(200).json({body: {error: {text: error, code: 5}}});
            });
    },

    vkLike: (req, res, next) => {
        const owner_id = req.body.owner_id;
        const photo_id = req.body.photo_id;
        const vkTokenIF = req.body.vkTokenIF;
        let token;
        let tokenVkId;
        const {headers: {authorization}} = req;
        if (authorization && authorization.split(' ')[0] === 'token') {
            token = authorization.split(' ')[1];
            tokenVkId = jwt.verify(token, 'collector_secret').vkId;
        }
        Users.findOne({
            vkId: tokenVkId
        }, (err, user) => {
            if (user && user.vkToken) {
                const link = `https://api.vk.com/` +
                    `method/likes.add` +
                    `?owner_id=${owner_id}` +
                    `&item_id=${photo_id}` +
                    `&type=photo` +
                    `&access_token=${user.vkToken}` +
                    `&v=5.120`;
                axios.get(link)
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
        });
    }
}

module.exports = photo;
