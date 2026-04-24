const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
    destination: './uploads/profiles/',
    filename: (req, file, cb) => {
        cb(null, 'profile-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Route to update profile (including image)
router.post('/update-profile', upload.single('profileImg'), authController.updateProfile);