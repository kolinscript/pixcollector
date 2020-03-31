const express            = require('express');
const path               = require('path');
const bodyParser         = require('body-parser');
const session            = require('express-session');
const MongoStore         = require('connect-mongo')(session);
const apiV1              = require('./routes/v1');
const port               = process.env.PORT || 5000;
const app                = express();

app.use('/', express.static(path.join(__dirname, '../client/build')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/v1', apiV1);
app.use(session({ secret: 'pixcoll', resave: false, saveUninitialized: true, cookie: { secure: true } }));

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(port, () => console.log('Api live on port', + port));