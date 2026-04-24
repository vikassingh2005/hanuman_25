const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

// 1. Create the pool immediately
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log("📥 Login request received for:", email);

    try {
        // 2. Test query to ensure DB is alive
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        
        if (rows.length === 0) {
            console.log("❌ User not found");
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log("❌ Password mismatch");
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'hanuman_secret',
            { expiresIn: '24h' }
        );

        console.log("✅ Login successful for:", user.name);
        return res.status(200).json({
            token,
            role: user.role,
            user: { name: user.name, email: user.email }
        });

    } catch (error) {
        console.error("🔥 DATABASE ERROR:", error.message);
        // CRITICAL: Always send a response even if it fails
        return res.status(500).json({ message: "Internal Server Error: " + error.message });
    }
};

exports.register = async (req, res) => {
    // Keep your registration logic here...
};