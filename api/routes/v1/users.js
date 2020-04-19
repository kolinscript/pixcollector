const router             = require('express').Router();
const axios              = require('axios');
const secure             = require('./secure');
const mongoose           = require('mongoose');
const Users              = mongoose.model('Users');

router.get('/', secure.required, (req, res, next) => {
    Users.find(function (err, usersRaw) {
        if (err) {
            res.status(200).json( { body: { error: err } });
            return console.error(err);
        }
        if (usersRaw) {
            const users = usersRaw.map((user) => {
                const safeUser = ({ vkToken, ...rest }) => rest;
                return safeUser(user);
            });
            console.log('users: ', users);
            res.status(200).json( { body: { users: users } });
        } else {
            res.status(200).json( { body: { error: 'found no users' } });
        }
    });
});

module.exports = router;