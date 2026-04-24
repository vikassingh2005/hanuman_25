const express = require('express');
const router = express.Router();
// const adminController = require('../controllers/adminController'); 

// Placeholder route
router.get('/stats', (req, res) => {
    res.json({ message: "Admin stats active" });
});

module.exports = router; // <--- MUST HAVE THIS LINE