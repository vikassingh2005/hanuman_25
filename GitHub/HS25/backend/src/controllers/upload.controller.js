const asyncHandler = require('../middleware/async.middleware');
const ErrorResponse = require('../utils/errorResponse');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/fileUpload');
const Product = require('../models/product.model');

/**
 * @desc    Upload product image
 * @route   PUT /api/products/:id/image
 * @access  Private (Admin)
 */
exports.uploadProductImage = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  // Check if product belongs to user or user is admin
  if (product.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this product`, 401));
  }

  if (!req.files || Object.keys(req.files).length === 0 || !req.files.image) {
    return next(new ErrorResponse('Please upload an image file', 400));
  }

  const file = req.files.image;

  // Delete previous image if exists
  if (product.image && product.image.public_id) {
    await deleteFromCloudinary(product.image.public_id);
  }

  // Upload new image
  const result = await uploadToCloudinary(file, 'products');

  // Update product with new image
  product.image = {
    url: result.url,
    public_id: result.public_id
  };

  await product.save();

  res.status(200).json({
    success: true,
    data: product
  });
});

/**
 * @desc    Upload multiple product images
 * @route   PUT /api/products/:id/images
 * @access  Private (Admin)
 */
exports.uploadProductImages = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  // Check if product belongs to user or user is admin
  if (product.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this product`, 401));
  }

  if (!req.files || Object.keys(req.files).length === 0 || !req.files.images) {
    return next(new ErrorResponse('Please upload image files', 400));
  }

  const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];

  // Upload each image
  const uploadPromises = files.map(file => uploadToCloudinary(file, 'products'));
  const results = await Promise.all(uploadPromises);

  // Add new images to product
  results.forEach(result => {
    product.images.push({
      url: result.url,
      public_id: result.public_id
    });
  });

  await product.save();

  res.status(200).json({
    success: true,
    data: product
  });
});

/**
 * @desc    Delete product image
 * @route   DELETE /api/products/:id/images/:imageId
 * @access  Private (Admin)
 */
exports.deleteProductImage = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  // Check if product belongs to user or user is admin
  if (product.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this product`, 401));
  }

  // Find image in product.images array
  const imageIndex = product.images.findIndex(img => img._id.toString() === req.params.imageId);

  if (imageIndex === -1) {
    return next(new ErrorResponse(`Image not found with id of ${req.params.imageId}`, 404));
  }

  // Delete image from Cloudinary
  if (product.images[imageIndex].public_id) {
    await deleteFromCloudinary(product.images[imageIndex].public_id);
  }

  // Remove image from product.images array
  product.images.splice(imageIndex, 1);
  await product.save();

  res.status(200).json({
    success: true,
    data: product
  });
});