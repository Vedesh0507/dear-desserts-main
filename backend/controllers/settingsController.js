const { Settings } = require('../models');
const fs = require('fs');
const path = require('path');

// @desc    Get settings
// @route   GET /api/settings
// @access  Public
exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private/Admin
exports.updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings();
    }

    // Handle logo upload
    if (req.file) {
      // Delete old logo if exists
      if (settings.logo && settings.logo !== 'logo.png') {
        const oldLogoPath = path.join(__dirname, '../uploads', settings.logo);
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
        }
      }
      req.body.logo = req.file.filename;
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (key === 'openingHours' || key === 'socialMedia') {
        settings[key] = { ...settings[key], ...req.body[key] };
      } else {
        settings[key] = req.body[key];
      }
    });

    await settings.save();

    // Emit socket event
    if (req.io) {
      req.io.emit('settingsUpdated', settings);
    }

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
