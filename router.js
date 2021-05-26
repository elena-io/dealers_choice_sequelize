const router = require('express').Router();
const db = require('./db');
const { app, conn, seed, models: {
    Customer,
    Order,
    Item
}  } = db;


router.get('/api/raw-data', async (req, res, next) => {
    try {
        
        res.send(   
            await Customer.findAll({
                include: [
                    { model: Order }
                ]
            })
        )
    }
    catch(ex) {
        next(ex);
    }
})

router.get('/api/customers', async (req, res, next) => {
    try {
        const customers = await Customer.findAll();
        const items = await Item.findAll();
        const orders = await Order.findAll();
        
        res.send(   
            ` 
            <html>
            <head>
                <link rel="stylesheet" href='/assets/styles.css' />
            </head>
                <nav>
                    <a href = "/api/customers" class="logo"><img src="/assets/images/guitar.png">  </a>
                    <a href = "/api/raw-data"> Raw data </a>
                </nav>
                <body>
                    <main>
                        <h1> Our Guitar Shop Customers </h1>
                        <section>
                            <h3> Customers</h3>
                            <ul>
                                ${
                                    customers.map( customer => {
                                        return `
                                            <li>
                                                ${ customer.name }
                                            </li>
                                        `
                                    }).join("")
                                }
                            <ul>
                        </section>
                        <section>    
                            <h3> Products </h3>
                            <ul>
                                ${
                                    items.map( item => {
                                        return `
                                            <li>
                                                ${ item.name }
                                            </li>
                                        `
                                    }).join("")
                                }
                            <ul>

                        </section>
                        <section>    
                            <h3> Orders </h3>
                            <ul>
                                ${
                                    customers.map( customer => {
                                        return `
                                            <li>
                                                ${ customer.name }
                                                
                                            </li>
                                        `
                                    }).join("")
                                }
                            <ul>

                    </main>
                </body>

            
            </html>

            `

        )
    }
    catch(ex) {
        next(ex);
    }
})



module.exports = router;


///${
    //      customers.map( customer => {
    //          return `
             
    //             ${ customer.name }
             
    //          `
    //      })
    //  }
    