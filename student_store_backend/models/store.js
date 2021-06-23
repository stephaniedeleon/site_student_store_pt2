const db = require("../db");

class Store {

    static async listProducts() {
        const results = db.query(`
            SELECT * FROM products;
        `)

        return results;
    }
}

module.exports = Store;