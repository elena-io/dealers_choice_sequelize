const express = require("express");

// stitches the path together /../..../
const path = require('path');
const app = express();

// parses incoming requests, based on body parser 
const { urlencoded } = require('express');
app.use(urlencoded({ extended: false }));

//adding router
app.use(require('./router.js'));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

const {
    conn,
    seed,
    models: {
        Customer,
        Order
    } 
} = require('./db');

const run = async() => {
    try {
        await conn.authenticate();
        seed();
        const port = 3000;
        app.listen(port, () => console.log(`listening on port ${port}`));
    }
    catch(ex) {
        console.log(ex);
    }
}

run();