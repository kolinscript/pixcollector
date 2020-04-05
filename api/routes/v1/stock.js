const router             = require('express').Router();
const secure             = require('./secure');

router.get('/', secure.optional, (req, res, next) => {
    const user = req.session.user;
    const safeUser = ({ _id, vkToken, ...rest }) => rest;
    res.status(200).json( { body: { user: safeUser(user) } });
});

module.exports = router;