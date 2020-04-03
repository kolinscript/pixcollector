const router             = require('express').Router();
const secure             = require('./secure');
const mongoose           = require('mongoose');
const Users              = mongoose.model('Users');

router.get('/', secure.optional, (req, res, next) => {
    res.send({
        user: req.session.user
    });
});

router.get('/testDB', secure.optional, (req, res, next) => {
    Users.find(function (err, sensors) {
        if (err) return console.error(err);
        return res.status(200).json( { OK: { sensors: sensors } } );
    });
});

module.exports = router;