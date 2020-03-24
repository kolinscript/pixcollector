const express            = require('express');
const path               = require('path');
const bodyParser         = require('body-parser');
const request            = require('request');
const port               = process.env.PORT || 5000;
const app                = express();

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const data = {
    access_token: '',
    user_id: ''
};
const vkApiVersion = '5.103';

app.post('/auth', (req, res, next) => {
    const { body: { link } } = req;
    request(link, function (error, response, body) {
        data.access_token = body.access_token;
        data.user_id = body.user_id;
        res.send(body);
    });
});

app.get('/photos', (req, res, next) => {
    const link = `https://api.vk.com/method/photos.getAlbums?owner_id=${data.user_id}&access_token=${data.access_token}&v=${vkApiVersion}`;
    request(link, function (error, response, body) {
        res.send({
            body: body,
            link: link
        });
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.listen(port, () => console.log('Api live on port', + port));