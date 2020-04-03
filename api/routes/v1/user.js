const router             = require('express').Router();
const secure             = require('./secure');
const Users              = mongoose.model('Users');

router.get('/', secure.optional, (req, res, next) => {
    res.send({
        user: req.session.user
    });
});

// router.get('/testDB', secure.optional, (req, res, next) => {
//     const { payload: { id } } = req;
//
//     return Users.findById(id)
//         .then((user) => {
//             if(!user) {
//                 return res.sendStatus(400);
//             }
//
//             return res.json({ user: user.toAuthJSON() });
//         });
// });

module.exports = router;