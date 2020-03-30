const express            = require('express');
const path               = require('path');
const bodyParser         = require('body-parser');
const state              = require('./state');
const apiV1              = require('./routes/v1');
const port               = process.env.PORT || 5000;
const app                = express();

// old
// app.use(express.static(path.join(__dirname, '../client/build')));
// new
// app.use('/static', express.static(path.join(__dirname, '../client/build//static')));
// the newest
app.use('/', express.static(path.join(__dirname, '../client/build')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/v1', apiV1);
app.set('state', state);

// old
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname+'../client/build/index.html'));
// });
// new
// app.get('*', (req, res) => {
//     res.sendFile('index.html', {root: path.join(__dirname, '../client/build/')});
// });
// the newest
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(port, () => console.log('Api live on port', + port));