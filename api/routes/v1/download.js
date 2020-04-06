const router             = require('express').Router();
const request            = require('request');
const ZipStream          = require('zip-stream');

router.get('/pixcollector.zip', (req, res) => {
    const zip = new ZipStream();
    zip.pipe(res);
    function addNextFile() {
        const elem = req.session.user.pixArray.shift();
        const stream = request(elem.url);
        const name = elem.url.slice(elem.url.lastIndexOf('/'));
        zip.entry(stream, { name: name }, err => {
            if (err)
                throw err;
            if (req.session.user.pixArray.length > 0)
                addNextFile();
            else
                zip.finalize();
        });
    }
    addNextFile();
});

module.exports = router;