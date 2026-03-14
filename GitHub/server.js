const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');

// --- 1. Initialize App ---
const app = express();
app.use(express.json());
app.use(cors());

// serve static files (html, css, js)
app.use(express.static(path.join(__dirname)));

const JWT_SECRET = 'hanuman_secret_key_2024';
const mongoURI = 'mongodb+srv://doesntmatter200527_db_user:HS01VIKAS@hscluster25.gxfp0wl.mongodb.net/?appName=HSCluster25';

// --- 2. MongoDB Connection ---
mongoose.connect(mongoURI)
    .then(() => {
        console.log("Connected to MongoDB");
        createAdminUser();
    })
    .catch(err => console.error("Connection Error:", err));

// --- 3. Schemas ---
const ProductSchema = new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    stock: Number
});
const Product = mongoose.model('Product', ProductSchema);

const UserSchema = new mongoose.Schema({
    firstname: { type: String, trim: true },
    lastname: { type: String, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    phone: { type: String },
});
const User = mongoose.model('User', UserSchema);

// Order Schema
const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    orderItems: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true, default: 1 },
            image: { type: String },
            price: { type: Number, required: true },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product'
            }
        }
    ],
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    paymentMethod: {
        type: String,
        required: true,
        default: 'Stripe'
    },
    paymentResult: {
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String }
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    },
    paidAt: {
        type: Date
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false
    },
    deliveredAt: {
        type: Date
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Order = mongoose.model('Order', OrderSchema);

// --- 4. Helper Functions ---
async function createAdminUser() {
    try {
        const adminEmail = 'pradyus431@gmail.com';
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('Pr@dyu$1604', 10);
            await User.create({
                firstname: 'Admin',
                lastname: 'User',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin'
            });
            console.log("Admin user created successfully!");
        } else {
            console.log("Admin user already exists.");
        }
    } catch (err) {
        console.error("Error creating admin:", err);
    }
}

// Custom Error Response Class
class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

// Async Handler Middleware
const asyncHandler = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Auth Middleware
const protect = asyncHandler(async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }
});

// Authorize Middleware
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: `User role ${req.user.role} is not authorized to access this route` 
            });
        }
        next();
    };
};

// Advanced Results Middleware
const advancedResults = (model, populate) => async (req, res, next) => {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = model.find(JSON.parse(queryStr));

    // Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    if (populate) {
        query = query.populate(populate);
    }

    // Executing query
    const results = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        };
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        };
    }

    res.advancedResults = {
        success: true,
        count: results.length,
        pagination,
        data: results
    };

    next();
};

// Stripe utility functions (mock for now - replace with actual Stripe integration)
const createPaymentIntent = async (amount, currency, metadata) => {
    // Mock payment intent creation
    return {
        id: 'pi_' + Math.random().toString(36).substring(7),
        client_secret: 'pi_secret_' + Math.random().toString(36).substring(7),
        status: 'succeeded',
        amount,
        currency
    };
};

const retrievePaymentIntent = async (paymentIntentId) => {
    // Mock payment intent retrieval
    return {
        id: paymentIntentId,
        status: 'succeeded'
    };
};

// Email Service (mock)
const emailService = {
    sendOrderConfirmationEmail: async (order, user) => {
        console.log(`Order confirmation email sent to ${user.email} for order ${order._id}`);
        return true;
    }
};

// --- 5. Order Controller Functions ---

// @desc    Create new order
// @access  Private
const createOrder = asyncHandler(async (req, res, next) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        return next(new ErrorResponse('No order items', 400));
    }

    // Create order
    const order = await Order.create({
        orderItems,
        user: req.user.id,
        shippingAddress,
        paymentMethod,
        taxPrice,
        shippingPrice,
        totalPrice
    });

    // Send order confirmation email
    try {
        await emailService.sendOrderConfirmationEmail(order, req.user);
    } catch (err) {
        console.error('Order confirmation email could not be sent', err);
        // Don't stop order creation if email fails
    }

    res.status(201).json({
        success: true,
        data: order
    });
});

// @desc    Get order by ID
// @access  Private
const getOrderById = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email firstname lastname');

    if (!order) {
        return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is order owner or admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to access this order`, 401));
    }

    res.status(200).json({
        success: true,
        data: order
    });
});

// @desc    Update order to paid
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
    }

    // Verify payment with Stripe
    const { paymentIntentId } = req.body;
    
    if (!paymentIntentId) {
        return next(new ErrorResponse('Payment intent ID is required', 400));
    }

    const paymentIntent = await retrievePaymentIntent(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
        return next(new ErrorResponse('Payment not successful', 400));
    }

    // Update order
    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = 'Processing';
    order.paymentResult = {
        id: paymentIntent.id,
        status: paymentIntent.status,
        update_time: new Date().toISOString(),
        email_address: req.user.email
    };

    const updatedOrder = await order.save();

    res.status(200).json({
        success: true,
        data: updatedOrder
    });
});

// @desc    Update order to delivered
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = 'Delivered';

    const updatedOrder = await order.save();

    res.status(200).json({
        success: true,
        data: updatedOrder
    });
});

// @desc    Get logged in user orders
// @access  Private
const getMyOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id });

    res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
    });
});

// @desc    Get all orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res, next) => {
    // If advancedResults middleware is used
    if (res.advancedResults) {
        return res.status(200).json(res.advancedResults);
    }

    const orders = await Order.find().populate('user', 'id name email firstname lastname');

    res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
    });
});

// @desc    Create payment intent
// @access  Private
const createPaymentIntentForOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is order owner
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to pay for this order`, 401));
    }

    // Create payment intent
    const paymentIntent = await createPaymentIntent(
        order.totalPrice,
        'usd',
        {
            orderId: order._id.toString(),
            userId: req.user.id
        }
    );

    res.status(200).json({
        success: true,
        clientSecret: paymentIntent.client_secret
    });
});

// --- 6. API Routes ---

// Auth Routes
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select('+password');
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
            res.json({
                token,
                user: { email: user.email, role: user.role }
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, firstname, lastname } = req.body;
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            email,
            password: hashedPassword,
            firstname: firstname || 'New',
            lastname: lastname || 'User'
        });

        res.json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: "Registration failed", error: err.message });
    }
});

// Profile Routes
app.get('/api/profile', protect, async (req, res) => {
    res.json(req.user);
});

app.put('/api/profile', protect, async (req, res) => {
    const { firstname, lastname, phone } = req.body;

    await User.findByIdAndUpdate(req.user.id, {
        firstname,
        lastname,
        phone
    });

    res.json({ message: "Profile updated" });
});

// Admin Routes
app.post('/api/admin/add-stock', protect, authorize('admin'), async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(200).json({ message: "Stock updated successfully" });
    } catch (e) {
        res.status(500).json({ message: "Database save failed" });
    }
});

// --- 7. Order Routes ---
// All order routes are protected
app.use('/api/orders', protect);

// User order routes
app.get('/api/orders/myorders', getMyOrders);
app.post('/api/orders/:id/payment-intent', createPaymentIntentForOrder);
app.put('/api/orders/:id/pay', updateOrderToPaid);
app.post('/api/orders', createOrder);
app.get('/api/orders/:id', getOrderById);

// Admin order routes
app.get('/api/orders', protect, authorize('admin'), advancedResults(Order, 'user'), getOrders);
app.put('/api/orders/:id/deliver', protect, authorize('admin'), updateOrderToDelivered);

// --- 8. Error Handler ---
app.use((err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    console.error(err);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new ErrorResponse(message, 400);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
});

// --- 9. Start Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server active on http://localhost:${PORT}`));
