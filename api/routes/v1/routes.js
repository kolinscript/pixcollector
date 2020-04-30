const express            = require('express');
const router             = express.Router();
const secure             = require('../../middlewares/secure');
const auth               = require('../../middlewares/auth');
const user               = require('../../middlewares/user');
const download           = require('../../middlewares/download');

router.get('/auth', secure.optional, auth.login);
router.get('/auth/success', secure.optional, auth.success);
router.get('/user', secure.optional, user.getUser);
router.get('/users', secure.required, user.getUsers);
router.get('/download/pixcollector.zip', download.download);

module.exports = router;