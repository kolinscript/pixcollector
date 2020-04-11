const router             = require('express').Router();
const secure             = require('./secure');

router.get('/', secure.required, (req, res, next) => {
    // todo запрос новой информации из вк (альбом, etc) на основании текущего токена, обновление в базе

    if (req.session.user) {
        const user = req.session.user;
        const safeUser = ({ _id, vkToken, token, ...rest }) => rest;
        res.status(200).json( { body: { user: safeUser(user) } });
    } else {
        res.status(200).json( { body: { error: 'found no user' } });
    }
});

router.get('/:id', secure.optional, (req, res, next) => {
    // отдача галереи по айди (вк айди)
});

module.exports = router;