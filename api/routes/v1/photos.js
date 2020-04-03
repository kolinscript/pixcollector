const router = require('express').Router();
const axios = require('axios');

router.get('/', (req, res, next) => {
    // totalCount = 2700
    // totalFloat = 2.7
    // integerPart = 2
    // floatPart = 0.700;

    // totalCount = 3
    // totalFloat = 0.003
    // integerPart = 0
    // floatPart = 0.003;

    const totalCount = req.query.count; // 2700
    let pixArray = [];
    const totalFloat = totalCount / 1000;   // 2.7
    const integerPart = Math.floor(totalFloat); // 2
    const floatPart = integerPart === 0 ? totalCount : (Math.abs(+(totalFloat - Math.floor(totalFloat)).toFixed(3))); // 0.7
    const reqFloatPart = integerPart === 0 ? floatPart : floatPart * 1000; // 700
    const reqIntegerPart = integerPart * 1000; // 2000
    const reqOffset = 0;

    console.log('totalCount:', totalCount);
    console.log('totalFloat:', totalFloat);
    console.log('integerPart:', integerPart);
    console.log('floatPart:', floatPart);
    console.log('reqFloatPart:', reqFloatPart);
    console.log('reqIntegerPart:', reqIntegerPart);

    if (integerPart === 0) {
        // single request
        const link = `https://api.vk.com/` +
            `method/photos.get` +
            `?owner_id=${req.session.user_id}` +
            `&access_token=${req.session.access_token}` +
            `&album_id=saved` +
            `&photo_sizes=1` +
            `&offset=${reqOffset}` +
            `&count=${reqFloatPart}` +
            `&v=5.103`;
        axios.get(link)
            .then(function (response) {
                console.log('response: ', response);
                const arr = [];
                if (response.data.response) {
                    response.data.response.items.forEach((item) => {
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
                        pixArray = arr;
                        req.session.pixArray = pixArray;
                    });
                }
                res.send({
                    body: pixArray
                });
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(function () {
                // always executed
            });
    } else if (integerPart > 0) {
        // multiple requests
        // handling integerPart
        let offsetLast;
        let urlArray = [];
        for (let offset = reqOffset, count = 1000; offset < reqIntegerPart; offset = offset + 1000) {
            const link = `https://api.vk.com/` +
                `method/photos.get` +
                `?owner_id=${req.session.user_id}` +
                `&access_token=${req.session.access_token}` +
                `&album_id=saved` +
                `&photo_sizes=1` +
                `&offset=${offset}` +
                `&count=${count}` +
                `&v=5.103`;
            urlArray.push(link);
            offsetLast = offset + 1000;
        }
        const linkLast = `https://api.vk.com/` +
            `method/photos.get` +
            `?owner_id=${req.session.user_id}` +
            `&access_token=${req.session.access_token}` +
            `&album_id=saved` +
            `&photo_sizes=1` +
            `&offset=${offsetLast}` +
            `&count=${reqFloatPart}` +
            `&v=5.103`;

        urlArray.push(linkLast);

        const urlArrayPromises = urlArray.map((url) => {
            return axios.get(url);
        });

        async function photosFetcher() {
            try {
                const result = await axios.all(urlArrayPromises);
                const resDataArray = result.map(r => r.data);
                const responseArray = resDataArray.map(r => r.response);
                const itemsArray = responseArray.map(r => r.items);
                console.log('itemsArray: ', itemsArray);
                const arr = [];
                if (responseArray) {
                    itemsArray.forEach((item) => {
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
                        pixArray = arr;
                        req.session.pixArray = pixArray;
                    });
                }
                res.send({
                    body: pixArray
                });
            } catch (error) {
                console.error(error);
            }
        }

        photosFetcher();
    }
});

router.get('/albumSize', (req, res, next) => {
    res.send({
        albumSize: req.session.albumSize
    });
});

module.exports = router;