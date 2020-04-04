const router             = require('express').Router();
const secure             = require('./secure');
const mongoose           = require('mongoose');
const Users              = mongoose.model('Users');

router.get('/', secure.optional, (req, res, next) => {
    console.log('req.session.user.vkId', req.session.user.vkId);
    Users.find({
        vkId: req.session.user.vkId
    }, (err, user) => {
        if (err) return console.error(err);
        return res.status(200).json( { body: { user: user } });
    });
});

module.exports = router;