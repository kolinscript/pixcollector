const router             = require('express').Router();
const axios              = require('axios');
const secure             = require('./secure');
const mongoose           = require('mongoose');
const Users              = mongoose.model('Users');

router.get('/', secure.required, (req, res, next) => {
    Users.find((err, userRoot) => {
        if (err) {
            res.status(200).json( { body: { error: err } });
            return console.error(err);
        }
        if (userRoot) {
            const safeUser = ({ vkToken, ...rest }) => rest;
            res.status(200).json( { body: { users: userRoot.forEach(user => (safeUser(user.toAuthJSON()))) } });
        } else {
            res.status(200).json( { body: { error: 'found no users' } });
        }
    });
});

module.exports = router;