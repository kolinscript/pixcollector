const express       = require('express');
const router        = express.Router();
const auth          = require('./auth.js');
const photos        = require('./photos.js');
const download      = require('./download.js');

router.use('/auth', auth);
router.use('/photos', photos);
router.use('/download', download);

module.exports = router;