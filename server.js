const express = require("express");
const app = express();
const {
    conn,
    seed,
    models: {
        Customer,
        Order
    } 
} = require('./db');

app.get('/api/orders', async (req, res, next) => {
    try {
        res.send(await Customer.findAll({ 
            include: [ Order ]
        }))
    }
    catch(ex) {
        next(ex);
    }
})


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