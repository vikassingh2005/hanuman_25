const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './uploads/profiles/',
    filename: (req, file, cb) => {
        cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });

router.post('/update-profile', upload.single('profileImg'), (req, res) => {
    res.json({ success: true, message: "Image uploaded" });
});

module.exports = router; // <--- MUST HAVE THIS LINE