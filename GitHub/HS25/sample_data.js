// Sample data for MongoDB database
// Run this script with: node sample_data.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./backend/src/models/user.model');
const Product = require('./backend/src/models/product.model');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Sample users
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'admin',
    createdAt: new Date()
  },
  {
    name: 'Regular User',
    email: 'user@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'user',
    createdAt: new Date()
  }
];

// Sample products
const products = [
  {
    name: 'Laptop Pro',
    description: 'High-performance laptop with 16GB RAM and 512GB SSD',
    price: 1299.99,
    category: 'Electronics',
    inStock: true,
    createdAt: new Date()
  },
  {
    name: 'Smartphone X',
    description: 'Latest smartphone with 6.5" display and 128GB storage',
    price: 899.99,
    category: 'Electronics',
    inStock: true,
    createdAt: new Date()
  },
  {
    name: 'Wireless Headphones',
    description: 'Noise-cancelling wireless headphones with 20-hour battery life',
    price: 199.99,
    category: 'Audio',
    inStock: true,
    createdAt: new Date()
  },
  {
    name: 'Smart Watch',
    description: 'Fitness tracker with heart rate monitor and GPS',
    price: 249.99,
    category: 'Wearables',
    inStock: false,
    createdAt: new Date()
  }
];

// Import data function
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    
    // Insert users
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;
    
    // Add user reference to products
    const sampleProducts = products.map(product => {
      return { ...product, user: adminUser };
    });
    
    // Insert products
    await Product.insertMany(sampleProducts);
    
    console.log('Data imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Delete data function
const destroyData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    
    console.log('Data destroyed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run script based on command line argument
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}