const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const { requireAuthenticatedUser } = require("../middleware/security.js");


router.get("/", requireAuthenticatedUser, async (req, res, next) => {

    try {
        const user = res.locals.user;
        const orders = await Order.listOrdersForUser(user);
        res.status(200).json({ orders });

    } catch(err) {
        next(err);
    }
});


//Creating a new order
router.post("/", requireAuthenticatedUser, async (req, res, next) => {

    try {
        const user = res.locals.user;
        const order = await Order.createOrder( { user, order: req.body.order });
        res.status(201).json({ order });

    } catch(err) {
        next(err);
    }
});


module.exports = router;
