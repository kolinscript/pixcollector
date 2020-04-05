const express            = require('express');
const router             = express.Router();
const auth               = require('./auth.js');
const stock              = require('./stock.js');
const user               = require('./user.js');
const photos             = require('./photos.js');
const download           = require('./download.js');

router.use('/auth', auth);
router.use('/stock', stock);
router.use('/user', user);
router.use('/photos', photos);
router.use('/download', download);

module.exports = router;