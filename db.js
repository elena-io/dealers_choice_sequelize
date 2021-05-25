const Sequelize = require('sequelize');
const { STRING, UUID, UUIDV4, DECIMAL } = Sequelize;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/dealers_choice_sequelize_db');

const customers = ["Elena", "Dan", "Erick", "Josh"];
const orders = ["Guitar Strap", "Guitar Strings", "Tuner", "Guitar Mat"];
const prices = [16.15, 17.45, 18.34, 56.14];
//console.log(typeof prices);



const Customer = conn.define('customer', {
    name: { type: STRING, alowNull: false, unique: true },
    id: {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4
        }
    });
const Order = conn.define('order', {
    name: { type: STRING, allowNull: false, unique: true },
    id: {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
    },
    price: { 
        type: DECIMAL(10, 2)   
    }
});

// Customer.belongsTo(Order);
// Order.hasMany(Customer);

Customer.hasMany(Order);
Order.belongsTo(Customer);

Order.hasMany(Order, { foreignKey: "setId" })
//Order.belongsTo(Order, { as: "partOfTheSet" })


const seed = async() => {
    await conn.sync({ force: true });
    const [Elena, Dan, Erick, Josh] = await Promise.all(
        customers.map((name) => Customer.create({ name }))
    );

    //can't assign prices based using map, breaks the whole thing
    //const [sixteen, seventeen, eighteen, fivty_six] = await Promise.all( prices.map(price => Order.create( { price } )));
    const [Guitar_Strap, Guitar_Strings, Tuner, Guitar_Mat] = await Promise.all(
        orders.map((name) => Order.create({ name }))
    );

    Tuner.price = prices[0];
    Guitar_Mat.price = prices[1];
    Guitar_Strings.price = prices[2];
    Guitar_Strap.price = prices[3];
    Tuner.customerId = Dan.id;
    Guitar_Strap.customerId = Dan.id;
    Tuner.customerId = Elena.id;
    Guitar_Mat.customerId = Dan.id;//

    //Guitar straps and Guitar Mat comes as a set 
    Guitar_Strap.setId = Guitar_Strap.id;
    Guitar_Mat.setId = Guitar_Strap.id;




    await Promise.all([Tuner.save(), Guitar_Strap.save(), Guitar_Mat.save(), Guitar_Strings.save()]);

}

module.exports = {
    conn,
    seed, 
    models: {
        Customer,
        Order
    }
}

