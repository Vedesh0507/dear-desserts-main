const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  cafeName: {
    type: String,
    default: 'Dear Desserts'
  },
  tagline: {
    type: String,
    default: 'Sweet Moments Start Here'
  },
  phone: {
    type: String,
    default: '+91 98765 43210'
  },
  email: {
    type: String,
    default: 'hello@deardesserts.com'
  },
  address: {
    type: String,
    default: '123 Sweet Street, Dessert Lane, DL 110001'
  },
  logo: {
    type: String,
    default: 'logo.png'
  },
  currency: {
    type: String,
    default: '₹'
  },
  taxRate: {
    type: Number,
    default: 0 // percentage
  },
  deliveryCharge: {
    type: Number,
    default: 0
  },
  minOrderAmount: {
    type: Number,
    default: 0
  },
  openingHours: {
    monday: { open: String, close: String, isClosed: Boolean },
    tuesday: { open: String, close: String, isClosed: Boolean },
    wednesday: { open: String, close: String, isClosed: Boolean },
    thursday: { open: String, close: String, isClosed: Boolean },
    friday: { open: String, close: String, isClosed: Boolean },
    saturday: { open: String, close: String, isClosed: Boolean },
    sunday: { open: String, close: String, isClosed: Boolean }
  },
  socialMedia: {
    instagram: String,
    facebook: String,
    twitter: String
  },
  orderNotificationSound: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);
