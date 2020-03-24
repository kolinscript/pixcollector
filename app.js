const express            = require('express');
const path               = require('path');
const bodyParser         = require('body-parser');
const request            = require('request');
const port               = process.env.PORT || 5000;
const app                = express();

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/auth', (req, res, next) => {
    const { body: { link } } = req;
    request(link, function (error, response, body) {
        res.send(body);
    });
});

app.get('/photos', (req, res, next) => {
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

app.listen(port, () => console.log('Api live on port', + port));