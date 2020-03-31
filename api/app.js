const express            = require('express');
const path               = require('path');
const bodyParser         = require('body-parser');
const cors               = require('cors');
const session            = require('express-session');
const mongoose           = require('mongoose');
const MongoStore         = require('connect-mongo')(session);
const apiV1              = require('./routes/v1');
const port               = process.env.PORT || 5000;
const db                 = process.env.MONGO;
const app                = express();

const connectDB          = async () => {
    try {
        await mongoose.connect(db, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        console.log("MongoDB is Connected...");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

app.use(cors());
app.use(session({
    secret: "SOME_SECRET_KEY",
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use('/', express.static(path.join(__dirname, '../client/build')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/v1', apiV1);
app.use(session({ secret: 'pixcoll', resave: false, saveUninitialized: true, cookie: { secure: true } }));

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(port, () => console.log('Api live on port', + port));