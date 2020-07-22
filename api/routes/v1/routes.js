const express            = require('express');
const router             = express.Router();
const secure             = require('../../middlewares/secure');
const auth               = require('../../middlewares/auth');
const user               = require('../../middlewares/user');
const download           = require('../../middlewares/download');

router.get('/auth', secure.optional, auth.login);

router.get('/user', secure.optional, user.getUser);

router.get('/user/is_self_stock', secure.optional, user.isSelfStock);

router.put('/user/update', secure.required, user.updateUser);

router.get('/users', secure.required, user.getUsers);

router.post('/download/pixcollector.zip', download.download);

module.exports = router;
