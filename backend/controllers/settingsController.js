const { Settings } = require('../models');
const fs = require('fs');
const path = require('path');
const cloudinary = require('../config/cloudinary');

/**
 * Upload a buffer to Cloudinary
 */
const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

/**
 * Extract public_id from a Cloudinary URL
 */
const extractPublicId = (url) => {
  try {
    const splits = url.split('/upload/');
    if (splits.length > 1) {
      const withoutVersion = splits[1].replace(/^v\d+\//, '');
      return withoutVersion.split('.')[0];
    }
    return null;
  } catch (error) {
    return null;
  }
};

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
      // Upload new logo to Cloudinary
      const result = await uploadToCloudinary(req.file.buffer, 'dear_desserts/settings');
      req.body.logo = result.secure_url;

      // Delete old logo if exists
      if (settings.logo && settings.logo !== 'logo.png') {
        if (settings.logo.startsWith('http') && settings.logo.includes('cloudinary')) {
          const publicId = extractPublicId(settings.logo);
          if (publicId) {
            await cloudinary.uploader.destroy(publicId).catch(err => console.error('Cloudinary destroy error:', err));
          }
        } else if (!settings.logo.startsWith('http')) {
          const oldLogoPath = path.join(__dirname, '../uploads', settings.logo);
          if (fs.existsSync(oldLogoPath)) {
            fs.unlinkSync(oldLogoPath);
          }
        }
      }
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
