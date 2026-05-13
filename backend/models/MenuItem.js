const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['brownies', 'savories', 'bubble_waffles', 'popsicles', 'special_daily', 'special_weekend'],
    lowercase: true
  },
  image: {
    type: String,
    default: 'default-food.jpg'
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  isSpecial: {
    type: Boolean,
    default: false
  },
  preparationTime: {
    type: Number,
    default: 15 // minutes
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Index for faster queries
menuItemSchema.index({ category: 1, isAvailable: 1 });
menuItemSchema.index({ isBestSeller: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);
