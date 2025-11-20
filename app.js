const express = require('express');
const session = require('express-session');
const path = require('node:path');
const pool = require('./db/pool');
const passport = require('passport');
require('dotenv').config();
const pgStore = require('connect-pg-simple')(session)
const indexRouter = require('./routes/indexRouter');

// General Setup
const PORT = 3000;
const app = express();

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Session setup
const sessionStore = new pgStore({
    pool: pool,
    tableName: 'session'
});

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// Passport Setup
require('./config/passport'); 
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);


app.listen(PORT, (error) => {
    if (error) {
        console.error(error);
    }

    console.log(`Express app running on port ${PORT}.`);
})