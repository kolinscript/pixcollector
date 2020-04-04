const router             = require('express').Router();
const secure             = require('./secure');

router.get('/', secure.optional, (req, res, next) => {
    console.log('req.session.user', req.session.user);
    res.status(200).json( { body: { user: req.session.user } });
});

module.exports = router;