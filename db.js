const Sequelize = require('sequelize');
const { STRING, UUID, UUIDV4, DECIMAL } = Sequelize;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/dealers_choice_sequelize_db');

const customers = ["Elena", "Dan", "Erick", "Josh"];
const items = ["Guitar Strap", "Guitar Strings", "Tuner", "Guitar Mat"];
const prices = [16.15, 17.45, 18.34, 56.14];
//console.log(typeof prices);


// many to many relationship between Customers and Items 
const Customer = conn.define('customer', {
    name: { type: STRING, alowNull: false, unique: true },
    id: {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4
        }
    });
const Item = conn.define('item', {
    name: { type: STRING, allowNull: false, unique: true },
    id: {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4,
    },

})
const Order = conn.define('order', {

});


Customer.hasMany(Item);
Item.belongsTo(Customer);
Order.belongsTo(Customer);
Customer.hasMany(Order);
Order.belongsTo(Item);

Item.hasMany(Item, { foreignKey: "setId" })


const seed = async() => {
    await conn.sync({ force: true });
    const [Elena, Dan, Erick, Josh] = await Promise.all(
        customers.map((name) => Customer.create({ name }))
    );

    const [Guitar_Strap, Guitar_Strings, Tuner, Guitar_Mat] = await Promise.all(
        items.map((name) => Item.create({ name }))
    );

    const orders = await Promise.all([
        Order.create({ customerId: Elena.id, itemId: Tuner.id }),
        Order.create({ customerId: Erick.id, itemId: Tuner.id }),
        Order.create({ customerId: Erick.id, itemId: Guitar_Mat.id })
    ])

    Tuner.price = prices[0];
    Guitar_Mat.price = prices[1];
    Guitar_Strings.price = prices[2];
    Guitar_Strap.price = prices[3];
    // Tuner.customerId = Dan.id;
    // Guitar_Strap.customerId = Dan.id;
    // Tuner.customerId = Elena.id;
    // Guitar_Mat.customerId = Dan.id;//

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
        Item,
        Order

    }
}

