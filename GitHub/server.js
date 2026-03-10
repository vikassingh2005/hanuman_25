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
        console.log(" Connected to MongoDB");
        createAdminUser();
    })
    .catch(err => console.error(" Connection Error:", err));

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
            console.log(" Admin user created successfully!");
        } else {
            console.log(" Admin user already exists.");
        }
    } catch (err) {
        console.error("Error creating admin:", err);
    }
}

// --- 5. API Routes ---

// Login
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

// Register
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

// Get logged-in user profile
app.get('/api/profile', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token" });

        const user = await User.findById(decoded.id).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    });
});

app.put('/api/profile', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: "No token" });

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token" });

        const { firstname, lastname, phone } = req.body;

        await User.findByIdAndUpdate(decoded.id, {
            firstname,
            lastname,
            phone
        });

        res.json({ message: "Profile updated" });
    });
});

// Add Stock
app.post('/api/admin/add-stock', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: "No token provided" });

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err || decoded.role !== 'admin') return res.status(403).json({ message: "Forbidden" });
        try {
            const newProduct = new Product(req.body);
            await newProduct.save();
            res.status(200).json({ message: "Stock updated successfully" });
        } catch (e) {
            res.status(500).json({ message: "Database save failed" });
        }
    });
});

// --- 6. Start Server ---
app.listen(3000, () => console.log(' Server active on http://localhost:8080'));