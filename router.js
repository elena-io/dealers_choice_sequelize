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
        const customers = await Customer.findAll()

  
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
                        <h1> Sup </h1>
                        <ul>
                        
                            ${
                                customers.map( customer => customer.name)
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
    