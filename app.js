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

var access_token;
var user_id;
var pixArray;
const vkApiVersion = '5.103';

app.post('/auth', (req, res, next) => {
    const { body: { link } } = req;
    request(link, function (error, response, body) {
        const bodyParsed = JSON.parse(body);
        access_token = bodyParsed.access_token;
        user_id = bodyParsed.user_id;
        res.send({
            body: body,
            response: response
        });
    });
});

app.get('/photos', (req, res, next) => {
    const link = `https://api.vk.com/` +
    `method/photos.get` +
    `?owner_id=${user_id}` +
    `&access_token=${access_token}` +
    `&album_id=saved` +
    `&photo_sizes=1` +
    `&count=20` +
    `&v=${vkApiVersion}`;
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
                arr.push(sizeW.url);
            } else if (sizeZ) {
                arr.push(sizeZ.url);
            } else if (sizeY) {
                arr.push(sizeY.url);
            } else if (sizeX) {
                arr.push(sizeX.url);
            } else if (sizeM) {
                arr.push(sizeM.url);
            } else if (sizeS) {
                arr.push(sizeS.url);
            }
            pixArray = arr;
        });
        res.send({
            body: arr
        });
    });
});

// app.post('/download', (req, res) => {
//     const { body: { linkArr } } = req;
//     var zip = new ZipStream();
//     res.writeHead(200, {
//         'Content-Type': 'application/zip',
//         'Content-disposition': 'attachment; filename=myFile.zip'
//     });
//     zip.pipe(res);
//
//     var queue = [
//         { name: 'one.jpg', url: 'https://loremflickr.com/640/480' },
//         { name: 'two.jpg', url: 'https://loremflickr.com/640/480' },
//         { name: 'three.jpg', url: 'https://loremflickr.com/640/480' }
//     ];
//
//     function addNextFile() {
//         var elem = queue.shift();
//         var stream = request(elem.url);
//         zip.entry(stream, { name: elem.name }, (err) => {
//             if (err) {
//                 throw err;
//             }
//             if (linkArr.length > 0) {
//                 addNextFile();
//             }
//             else {
//                 zip.finalize();
//             }
//         });
//     }
//
//     addNextFile();
// });

app.get('/download', (req, res) => {
    var zip = new ZipStream();
    zip.pipe(res);

    // var queue = [
    //     { name: 'one.jpg', url: 'https://loremflickr.com/640/480' },
    //     { name: 'two.jpg', url: 'https://loremflickr.com/640/480' },
    //     { name: 'three.jpg', url: 'https://loremflickr.com/640/480' }
    // ]

    function addNextFile() {
        var elem = pixArray.shift();
        var stream = request(elem);
        zip.entry(stream, { name: `${elem}.png` }, err => {
            if (err)
                throw err;
            if (pixArray.length > 0)
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