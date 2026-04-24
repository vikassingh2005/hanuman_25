const Order = require('../models/Order');
const Cart = require('../models/cart');

exports.checkout = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
        if (!cart) return res.status(400).json({ msg: 'Cart is empty' });

        const total = cart.items.reduce((acc, item) => acc + (item.productId.price * item.quantity), 0);

        const newOrder = new Order({
            userId: req.user.id,
            items: cart.items.map(item => ({
                productId: item.productId._id,
                name: item.productId.name,
                quantity: item.quantity,
                priceAtPurchase: item.productId.price
            })),
            totalAmount: total
        });

        await newOrder.save();
        await Cart.findOneAndDelete({ userId: req.user.id });
        res.status(201).json(newOrder);
    } catch (err) { res.status(500).send('Server Error'); }
};