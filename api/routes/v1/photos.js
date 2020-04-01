const router             = require('express').Router();
const request            = require('request');

router.get('/', (req, res, next) => {
    // totalCount = 2700
    // totalFloat = 2.7
    // integerPart = 2
    // floatPart = 0.700;

    // totalFloat = 0.7
    // integerPart = 0
    // floatPart = 0.700;

    // reqArray = [
    //     {
    //     count: 1000,
    //     offset: 0
    //     },
    //     {
    //     count: 1000,
    //     offset: 1000
    //     },
    //     {
    //     count: 700,
    //     offset: 2000
    //     }
    // ]
    const totalCount = req.query.count;
    let pixArray = [];
    if (totalCount > 1000) {
        const totalFloat = totalCount / 1000;   // 2.7
        const integerPart = Math.floor(totalFloat); // 2
        const floatPart = (integerPart - Math.floor(integerPart)).toFixed(3); // 0.700
        const reqIntegerPart = integerPart * 1000; // 2000
        const reqFloatPart = floatPart * 1000; // 700
        const reqOffset = 0;
        if (integerPart === 0) {
            // single request
            const link = `https://api.vk.com/` +
                `method/photos.get` +
                `?owner_id=${req.session.user_id}` +
                `&access_token=${req.session.access_token}` +
                `&album_id=saved` +
                `&photo_sizes=1` +
                `&count=${reqFloatPart}` +
                `&offset=${reqOffset}` +
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
                        pixArray = pixArray.concat(arr);
                    });
                }
            });
        } else {
            // multiple requests
            // handling integerPart
            for (let offset = reqOffset, count = 1000; count <= reqIntegerPart; offset = offset + 1000, count = count + 1000) {
                const link = `https://api.vk.com/` +
                    `method/photos.get` +
                    `?owner_id=${req.session.user_id}` +
                    `&access_token=${req.session.access_token}` +
                    `&album_id=saved` +
                    `&photo_sizes=1` +
                    `&count=${count}` +
                    `&offset=${offset}` +
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
                            pixArray = pixArray.concat(arr);
                        });
                    }
                });
            }
        }
        req.session.pixArray = pixArray;
        res.send({
            body: pixArray
        });
    }
});

router.get('/albumSize', (req, res, next) => {
    res.send({
        albumSize: req.session.albumSize
    });
});

module.exports = router;