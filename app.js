const express = require('express');
const session = require('express-session');
const path = require('node:path');
const pool = require('./db/pool');
require('dotenv').config();
const pgStore = require('connect-pg-simple')(session)

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

app.get('/', async (req, res) => {
    console.log(req.session);
    res.send("<h1>Check your application cookie.</h1>");
})


app.listen(PORT, (error) => {
    if (error) {
        console.error(error);
    }

    console.log(`Express app running on port ${PORT}.`);
})