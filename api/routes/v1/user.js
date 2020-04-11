const router             = require('express').Router();
const secure             = require('./secure');
const mongoose           = require('mongoose');
const Users              = mongoose.model('Users');

router.get('/:id', secure.optional, (req, res, next) => {
    // todo запрос новой информации из вк (альбом, etc) на основании текущего токена, обновление в базе
    const userID = req.params.id;
    Users.findOne({
        vkId: userID
    }, (err, user) => {
        if (err) {
            res.status(200).json( { body: { error: err } });
            return console.error(err);
        }
        if (user) {
            const safeUser = ({ _id, vkToken, token, ...rest }) => rest;
            res.status(200).json( { body: { user: safeUser(user) } });
        } else {
            res.status(200).json( { body: { error: 'found no user' } });
        }
    });
});

module.exports = router;