const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['accessories', 'Badminton', 'ball_badminton', 'balls', 'cricket']
  },
  inStock: {
    type: Boolean,
    default: true
  },
  image: {
    url: {
      type: String,
      default: 'https://res.cloudinary.com/demo/image/upload/v1/placeholder-image.jpg'
    },
    public_id: {
      type: String,
      default: null
    }
  },
  images: [
    {
      url: {
        type: String
      },
      public_id: {
        type: String
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Product', ProductSchema);