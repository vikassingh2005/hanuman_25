const path = require('path');
const cloudinary = require('cloudinary').v2;
const ErrorResponse = require('./errorResponse');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload file to Cloudinary
 * @param {Object} file - File object from multer
 * @param {String} folder - Folder name in Cloudinary
 * @returns {Promise} - Cloudinary upload result
 */
exports.uploadToCloudinary = async (file, folder = 'products') => {
  try {
    if (!file) {
      throw new ErrorResponse('Please upload a file', 400);
    }

    // Check file type
    const fileTypes = /jpeg|jpg|png|webp/;
    const mimetype = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

    if (!mimetype || !extname) {
      throw new ErrorResponse('Please upload an image file (jpeg, jpg, png, webp)', 400);
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new ErrorResponse('Image size should be less than 5MB', 400);
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder,
      resource_type: 'auto',
      transformation: [
        { width: 1000, crop: 'limit' }, // Resize to max width 1000px
        { quality: 'auto:good' } // Optimize quality
      ]
    });

    return {
      url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    throw new ErrorResponse(error.message || 'Error uploading image', error.statusCode || 500);
  }
};

/**
 * Delete file from Cloudinary
 * @param {String} publicId - Public ID of the image
 * @returns {Promise} - Cloudinary delete result
 */
exports.deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;
    
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new ErrorResponse(error.message || 'Error deleting image', error.statusCode || 500);
  }
};