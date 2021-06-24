const express = require("express")
const User = require("../models/user")
const Order = require("../models/order")
const router = express.Router()
const { createUserJwt } = require("../utils/tokens"); //used to generate web tokens
const { requireAuthenticatedUser } = require("../middleware/security.js");

router.post("/login", async (req, res, next) => {
  try {
    const user = await User.login(req.body)
    const token = createUserJwt(user);
    return res.status(200).json({ user, token })

  } catch (err) {
    next(err)
  }
})

router.post("/register", async (req, res, next) => {
  try {
    const user = await User.register({ ...req.body, isAdmin: false })
    const token = createUserJwt(user);
    return res.status(201).json({ user, token })

  } catch (err) {
    next(err)
  }
})

// requireAuthenticatedUser is added to the chain of middleware that happens 
//      before our route handler is called. (you can do this for any function)
// requireAuthenticatedUser - if user does not exist, it will throw an error
router.get("/me", requireAuthenticatedUser, async (req, res, next) => {
  try {
    const { email } = res.locals.user;
    const user = await User.fetchUserByEmail(email);
    const publicUser = User.makePublicUser(user);
    const orders = await Order.listOrdersForUser(user);
    return res.status(200).json({ user: publicUser, orders })

  } catch (error) {
    next(error);
  }
})

module.exports = router
