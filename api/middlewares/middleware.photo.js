const axios              = require('axios');

module.exports = {
    photosFetcher: function(count_to) {
        const countFrom = 1;
        const countTo = count_to;

        const countTotal = countTo - countFrom;
        const countTotalFloat = countTotal / 1000;
        const integerPart = Math.floor(countTotalFloat);
        const floatPart = integerPart === 0
            ? countTotal
            : (Math.abs(+(countTotalFloat - (Math.floor(countTotalFloat)).toFixed(3))) * 1000);

        const reqFloatPart = floatPart;
        const reqIntegerPart = integerPart * 1000;
        const reqOffset = countFrom;

        let pixArray = [];

        if (integerPart === 0) {
            // single request
            const link = `https://api.vk.com/` +
                `method/photos.get` +
                `?owner_id=${req.session.user.vkId}` +
                `&access_token=${req.session.user.vkToken}` +
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
                        // todo move to middleware
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
                            req.session.user.pixArray = pixArray;
                        });
                    }
                    return pixArray;
                    // res.status(200).json( { body: { pixArray: pixArray } });
                })
                .catch(function (error) {
                    console.log(error);
                    return pixArray;
                })
                .finally(function () {
                    // always executed
                });
        } else if (integerPart > 0) {
            // multiple requests
            let offsetLast;
            let urlArray = [];
            for (let offset = reqOffset, count = 1000; offset < reqIntegerPart; offset = offset + 1000) {
                const link = `https://api.vk.com/` +
                    `method/photos.get` +
                    `?owner_id=${req.session.user.vkId}` +
                    `&access_token=${req.session.user.vkToken}` +
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
                `?owner_id=${req.session.user.vkId}` +
                `&access_token=${req.session.user.vkToken}` +
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
                    const arrays = result.map(r => r.data).map(r => r.response).map(r => r.items);
                    let photos = [];
                    arrays.forEach((array) => {
                        photos = photos.concat(array)
                    });
                    const arr = [];
                    if (photos) {
                        photos.forEach((item) => {
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
                            req.session.user.pixArray = pixArray;
                        });
                    }
                    return pixArray;
                    // res.status(200).json( { body: { pixArray: pixArray } });
                } catch (error) {
                    console.error(error);
                    return pixArray;
                }
            }

            photosFetcher();
        }
    }
};