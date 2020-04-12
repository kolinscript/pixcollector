const router             = require('express').Router();
const axios              = require('axios');
const secure             = require('./secure');
const photosFetcher      = require('../../middlewares/middleware.photo');

// todo create route to selective downloads (ex:  42, 43, 50)

router.get('/', secure.required, (req, res, next) => {
    const pixArray = photosFetcher.photosFetcher(req, req.query.countFrom, req.query.countTo);
    res.status(200).json( { body: { pixArray: pixArray } });
});

module.exports = router;