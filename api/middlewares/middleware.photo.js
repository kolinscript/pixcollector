module.exports = {
    photosFetcher: function(user_id, access_token, offset, count) {
        const link = `https://api.vk.com/` +
            `method/photos.get` +
            `?owner_id=${user_id}` +
            `&access_token=${access_token}` +
            `&album_id=saved` +
            `&photo_sizes=1` +
            `&offset=${offset}` +
            `&count=${count}` +
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
                    return arr;
                });
            }
        });
    }
};