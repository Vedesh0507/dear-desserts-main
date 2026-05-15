const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true
  },
  name: String,
  price: Number,
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  subtotal: Number
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true
  },
  tokenNumber: {
    type: Number
  },
  customer: {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    address: {
      type: String,
      trim: true
    }
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  discountCode: {
    type: String
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'preparing', 'ready', 'completed', 'cancelled'],
    default: 'new'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'online'],
    default: 'cash'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'cash_received', 'online_verified'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true
  },
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
}, {
  timestamps: true
});

// Generate order number and daily token number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber || !this.tokenNumber) {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    // Find the latest order of the day to determine the next token number
    const latestOrder = await this.constructor.findOne({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    }).sort({ tokenNumber: -1 });

    const nextToken = latestOrder ? latestOrder.tokenNumber + 1 : 1;

    // Generate order number (e.g. DD202605160001) using local date
    if (!this.orderNumber) {
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}${mm}${dd}`;
      this.orderNumber = `DD${dateStr}${String(nextToken).padStart(4, '0')}`;
    }

    // Generate daily token number (resets to 1 every day)
    if (!this.tokenNumber) {
      this.tokenNumber = nextToken;
    }
  }
  next();
});

// Index for queries
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ tokenNumber: 1, createdAt: -1 });
orderSchema.index({ 'customer.phone': 1 });
module.exports = mongoose.model('Order', orderSchema);
