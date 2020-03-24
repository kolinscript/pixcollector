const express            = require('express');
const path               = require('path');
const bodyParser         = require('body-parser');
const request            = require('request');
const port               = process.env.PORT || 5000;
const app                = express();

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var access_token;
var user_id;
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
    `&count=200` +
    `&v=${vkApiVersion}`;
    request(link, function (error, response, body) {
        res.send({
            body: JSON.parse(body),
            link: link
        });
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.listen(port, () => console.log('Api live on port', + port));