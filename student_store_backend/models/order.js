const db = require("../db");
const { BadRequestError } = require("../utils/errors");

class Order {

    static async listOrdersForUser(user) {
        //return all orders that the authenticated user has created
        const query = `
            SELECT orders.id AS "orderId",
                    orders.customer_id AS "customerId",
                    order_details.quantity AS "quantity",
                    products.name AS "name",
                    products.price AS "price"
            FROM orders
                JOIN order_details ON orders.id = order_details.order_id
                JOIN products ON products.id = order_details.product_id
            WHERE orders.customer_id = (SELECT id FROM users WHERE email=$1)
        `

        const result = await db.query(query, [user.email]);

        return result.rows;
    }


    static async createOrder({ user, order }) {

        if (!order || !Object.keys(order).length) {
            throw new BadRequestError("No order info provided")
        }
        if (!user) {
            throw new BadRequestError("No user provided")
        }

        //take a user order and store in database

        //Subquery = (SELECT id FROM users WHERE email=$1)
        //create anew order
        const results = await db.query(`
            INSERT INTO orders (customer_id)
            VALUES ((SELECT id FROM users WHERE email=$1)) 
            RETURNING id;
        `, [user.email] 
        )

        //get orderId
        const orderId = results.rows[0].id;

        //add items to order detaisl table
        // In order = key: productId, value: quantity
        Object.keys(order).forEach(async (productId) => {

            const quantity = order[productId]; //gets the value

            await db.query(`
                INSERT INTO order_details (order_id, product_id, quantity)
                VALUES ($1, $2, $3)
            `, [orderId, productId, quantity])
        });

        //return something....

    }
}

module.exports = Order;