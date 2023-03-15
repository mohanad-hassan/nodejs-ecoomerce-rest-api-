const express = require("express");
const router = express.Router();
const { authenticationMiddleWare, authorizationMiddleware } = require("../middleware/authentication");

const {
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    createOrder,
    updateOrder,
} = require("../controllers/orderController");

router
    .route("/")
    .post(authenticationMiddleWare, createOrder)
    .get(authenticationMiddleWare, authorizationMiddleware("admin"), getAllOrders);

router.route("/showAllMyOrders").get(authenticationMiddleWare, getCurrentUserOrders);

router
    .route("/:id")
    .get(authenticationMiddleWare, getSingleOrder)
    .patch(authenticationMiddleWare, updateOrder);

module.exports = router;
