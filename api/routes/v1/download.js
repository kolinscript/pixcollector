const router        = require('express').Router();
const state         = req.app.get('state');

app.get('/pixcollector.zip', (req, res) => {
    const zip = new ZipStream();
    zip.pipe(res);
    function addNextFile() {
        const elem = state.pixArray.shift();
        const stream = request(elem.url);
        const name = elem.url.slice(elem.url.lastIndexOf('/'));
        zip.entry(stream, { name: name }, err => {
            if (err)
                throw err;
            if (state.pixArray.length > 0)
                addNextFile();
            else
                zip.finalize();
        });
    }
    addNextFile();
});

module.exports = router;