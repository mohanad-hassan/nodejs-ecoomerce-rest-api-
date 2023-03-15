const Product = require("../models/Product")
const Order = require("../models/Order")
const { StatusCodes } = require("http-status-codes")
const CustomApiError = require("../errors")
const { checkPermissions } = require("../utils/index")

const fakeStripeAPI = async ({ amount, currency }) => {
    const client_secret = 'someRandomValue';
    return { client_secret, amount };
};


const getAllOrders = async (req, res) => {

    const orders = await Order.find({});
    res.status(StatusCodes.OK).json({ orders, count: orders.length });
}


const getSingleOrder = async (req, res) => {
    const { id: orderId } = req.params;
    const order = await Order.findOne({ _id: orderId });
    if (!order) {
        throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
    }
    //may cause error and need to edit the intries 
    checkPermissions(req.user, order.user);
    res.status(StatusCodes.OK).json({ order });
}


const getCurrentUserOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user.userId });
    res.status(StatusCodes.OK).json({ orders, count: orders.length });
}


const createOrder = async (req, res) => {
    const { items: cartItems, shippingFee, tax } = req.body
    if (!cartItems || cartItems.length < 1) {
        throw new CustomApiError.BadRequestError("no products to add to cart ")
    }

    if (!shippingFee || !tax) {
        throw new CustomApiError.BadRequestError("please provide tax and shippingFee")
    }

    let subtotal = 0
    let orderItems = []
    //we used await in this loop with no problems 
    for (item of cartItems) {
        const dbProduct = await Product.findOne({ _id: item.product })

        if (!dbProduct) {
            throw new CustomApiError.BadRequestError(`no product with id ${item.product}`)
        }
        //get the proprites from the database , dont trust the frontend , we just take the amount and the id of product from frontend
        const { name, price, image, _id } = dbProduct;

        const singleOrderItem = {
            amount: item.amount,
            name,
            price,
            image,
            product: _id,
        };

        // add item to order
        orderItems = [...orderItems, singleOrderItem];
        // calculate subtotal
        subtotal += item.amount * price;
    }

    // calculate total
    const total = tax + shippingFee + subtotal;
    // get client secret
    const paymentIntent = await fakeStripeAPI({
        amount: total,
        currency: 'usd',
    });

    const order = await Order.create({
        orderItems,
        total,
        subtotal,
        tax,
        shippingFee,
        clientSecret: paymentIntent.client_secret,
        user: req.user.userId,
    });

    res
        .status(StatusCodes.CREATED)
        .json({ order, clientSecret: order.clientSecret });




    res.send("createOrder")
}


const updateOrder = async (req, res) => {
    const { id: orderId } = req.params;
    const { paymentIntentId } = req.body;

    const order = await Order.findOne({ _id: orderId });
    if (!order) {
        throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
    }
    checkPermissions(req.user, order.user);

    order.paymentIntentId = paymentIntentId;
    order.status = 'paid';
    await order.save();

    res.status(StatusCodes.OK).json({ order });
}


module.exports = {
    getAllOrders, getSingleOrder, getCurrentUserOrders,
    createOrder, updateOrder
}