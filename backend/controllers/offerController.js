const { Offer } = require('../models');

// @desc    Get all offers
// @route   GET /api/offers
// @access  Private
exports.getOffers = async (req, res) => {
  try {
    const { active } = req.query;
    let query = {};
    
    if (active === 'true') {
      const now = new Date();
      query = {
        isActive: true,
        validFrom: { $lte: now },
        validUntil: { $gte: now }
      };
    }

    const offers = await Offer.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: offers.length,
      data: offers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single offer
// @route   GET /api/offers/:id
// @access  Private
exports.getOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    res.json({
      success: true,
      data: offer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create offer
// @route   POST /api/offers
// @access  Private/Admin
exports.createOffer = async (req, res) => {
  try {
    const offer = await Offer.create(req.body);

    res.status(201).json({
      success: true,
      data: offer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update offer
// @route   PUT /api/offers/:id
// @access  Private/Admin
exports.updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    res.json({
      success: true,
      data: offer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete offer
// @route   DELETE /api/offers/:id
// @access  Private/Admin
exports.deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    await offer.deleteOne();

    res.json({
      success: true,
      message: 'Offer deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Validate offer code
// @route   POST /api/offers/validate
// @access  Public
exports.validateOffer = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;

    const offer = await Offer.findOne({ code: code.toUpperCase() });

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Invalid offer code'
      });
    }

    if (!offer.isValid()) {
      return res.status(400).json({
        success: false,
        message: 'This offer has expired or is no longer valid'
      });
    }

    if (orderAmount < offer.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${offer.minOrderAmount} required`
      });
    }

    const discount = offer.calculateDiscount(orderAmount);

    res.json({
      success: true,
      data: {
        code: offer.code,
        description: offer.description,
        discountType: offer.discountType,
        discountValue: offer.discountValue,
        calculatedDiscount: discount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Toggle offer status
// @route   PATCH /api/offers/:id/toggle
// @access  Private/Admin
exports.toggleOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    offer.isActive = !offer.isActive;
    await offer.save();

    res.json({
      success: true,
      data: offer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
