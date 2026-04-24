const db = require('../config/db'); // Your MySQL connection

exports.getStats = async (req, res) => {
    try {
        const [users] = await db.execute('SELECT COUNT(*) as count FROM users');
        const [stock] = await db.execute('SELECT SUM(stock) as total FROM products');
        // Add more queries for revenue and pending orders as you build them
        
        res.json({
            userCount: users[0].count,
            stockCount: stock[0].total || 0,
            revenue: 0, 
            pendingOrders: 0
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching stats" });
    }
};

exports.addStock = async (req, res) => {
    const { name, category, price, stock, sku, image } = req.body;
    try {
        await db.execute(
            'INSERT INTO products (name, category, price, stock, sku, image) VALUES (?, ?, ?, ?, ?, ?)',
            [name, category, price, stock, sku, image]
        );
        res.status(201).json({ message: "Product added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Database insertion failed" });
    }
};