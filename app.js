const express            = require('express');
const path               = require('path');
const bodyParser         = require('body-parser');
const request            = require('request');
const ZipStream          = require('zip-stream');
const port               = process.env.PORT || 5000;
const app                = express();

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const state = {
    vkApiVersion: '5.103',
    access_token: null,
    user_id: null,
    album: null,
    count: 100,
    pixArray: null
};

app.post('/auth', (req, res, next) => {
    const { body: { link } } = req;
    request(link, function (error, response, body) {
        const bodyParsed = JSON.parse(body);
        state.access_token = bodyParsed.access_token;
        state.user_id = bodyParsed.user_id;

    });
    const albumLink = `https://api.vk.com/` +
        `method/photos.getAlbums` +
        `?owner_id=${state.user_id}` +
        `&access_token=${state.access_token}` +
        `&album_ids=saved` +
        `&v=${state.vkApiVersion}`;
    request(albumLink, function (error, response, body) {
        state.album = JSON.parse(body);
        res.send({
            body: {
                auth: 'Successfully authorized.',
                album: state.album
            }
        });
    });
});

app.get('/photos', (req, res, next) => {
    const link = `https://api.vk.com/` +
    `method/photos.get` +
    `?owner_id=${state.user_id}` +
    `&access_token=${state.access_token}` +
    `&album_id=saved` +
    `&photo_sizes=1` +
    `&count=${req.query.count}` +
    `&v=${state.vkApiVersion}`;
    request(link, function (error, response, body) {
        const bodyParsed = JSON.parse(body);
        const arr = [];
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
            state.pixArray = arr;
        });
        res.send({
            body: arr
        });
    });
});

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

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.listen(port, () => console.log('Api live on port', + port));