const express            = require('express');
const path               = require('path');
const bodyParser         = require('body-parser');
const state              = require('./state');
const apiV1              = require('./routes/v1');
const port               = process.env.PORT || 5000;
const app                = express();

app.use('/static', express.static(path.join(__dirname, '../client/build//static')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/v1', apiV1);
app.set('state', state);

app.get('*', (req, res) => {
    res.sendFile('index.html', {root: path.join(__dirname, '../client/build/')});
});

app.listen(port, () => console.log('Api live on port', + port));