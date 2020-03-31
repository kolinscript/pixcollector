const router             = require('express').Router();
const request            = require('request');

router.get('/', (req, res, next) => {
    const link = `https://api.vk.com/` +
        `method/photos.get` +
        `?owner_id=${req.session.state.user_id}` +
        `&access_token=${req.session.state.access_token}` +
        `&album_id=saved` +
        `&photo_sizes=1` +
        `&count=${req.query.count}` +
        `&v=5.103`;
    request(link, function (error, response, body) {
        const bodyParsed = JSON.parse(body);
        const arr = [];
        if (bodyParsed.response) {
            bodyParsed.response.items.forEach((item) => {
                // ascending flow
                // S -> M -> X -> Y -> Z -> W
                const sizeW = item.sizes.find(size => size.type === 'w');
                const sizeZ = item.sizes.find(size => size.type === 'z');
                const sizeY = item.sizes.find(size => size.type === 'y');
                const sizeX = item.sizes.find(size => size.type === 'x');
                const sizeM = item.sizes.find(size => size.type === 'm');
                const sizeS = item.sizes.find(size => size.type === 's');
                if (sizeW) {
                    arr.push(sizeW);
                } else if (sizeZ) {
                    arr.push(sizeZ);
                } else if (sizeY) {
                    arr.push(sizeY);
                } else if (sizeX) {
                    arr.push(sizeX);
                } else if (sizeM) {
                    arr.push(sizeM);
                } else if (sizeS) {
                    arr.push(sizeS);
                }
                req.session.state.pixArray = arr;
                req.app.set('state', {state});
            });
        }
        res.send({
            body: arr
        });
    });
});

router.get('/albumSize', (req, res, next) => {
    res.send({
        albumSize: req.session.state.albumSize
    });
});

module.exports = router;