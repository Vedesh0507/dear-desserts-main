const { MenuItem } = require('../models');
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

/**
 * Transform a menu item's `image` field into a full URL.
 * Handles: already-full URLs, default placeholder, and normal filenames.
 */
const withFullImageUrl = (item, req) => {
  if (!item) return item;
  const obj = item.toJSON ? item.toJSON() : { ...item };
  if (obj.image && !obj.image.startsWith('http')) {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.get('host');
    obj.image = `${protocol}://${host}/uploads/${obj.image}`;
  }
  return obj;
};


// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
exports.getMenuItems = async (req, res) => {
  try {
    const { category, available, bestSeller, special } = req.query;
    
    let query = {};
    
    if (category) query.category = category.toLowerCase();
    if (available !== undefined) query.isAvailable = available === 'true';
    if (bestSeller !== undefined) query.isBestSeller = bestSeller === 'true';
    if (special !== undefined) query.isSpecial = special === 'true';

    const menuItems = await MenuItem.find(query).sort({ category: 1, name: 1 });
    const data = menuItems.map(item => withFullImageUrl(item, req));
    
    res.json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single menu item
// @route   GET /api/menu/:id
// @access  Public
exports.getMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      data: withFullImageUrl(menuItem, req)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create menu item
// @route   POST /api/menu
// @access  Private/Admin
exports.createMenuItem = async (req, res) => {
  try {
    console.log("createMenuItem REQ.BODY:", req.body);
    console.log("createMenuItem REQ.FILE:", req.file);

    const itemData = { ...req.body };
    
    if (req.file) {
      console.log("Uploading file to Cloudinary...");
      const result = await uploadToCloudinary(req.file.buffer, 'dear_desserts/menu');
      console.log("Cloudinary result:", result);
      itemData.image = result.secure_url;
      console.log("itemData.image set to:", itemData.image);
    }

    console.log("Creating MenuItem with itemData:", itemData);
    const menuItem = await MenuItem.create(itemData);
    console.log("MenuItem created successfully:", menuItem._id);

    // Emit socket event for real-time update
    if (req.io) {
      req.io.emit('menuUpdated', { action: 'create', item: withFullImageUrl(menuItem, req) });
    }

    res.status(201).json({
      success: true,
      data: withFullImageUrl(menuItem, req)
    });
  } catch (error) {
    console.error("createMenuItem ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Private/Admin
exports.updateMenuItem = async (req, res) => {
  try {
    let menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    const updateData = { ...req.body };

    // Handle image upload
    if (req.file) {
      // Upload new image to Cloudinary
      const result = await uploadToCloudinary(req.file.buffer, 'dear_desserts/menu');
      updateData.image = result.secure_url;

      // Delete old image if exists
      if (menuItem.image && menuItem.image !== 'default-food.jpg') {
        if (menuItem.image.startsWith('http') && menuItem.image.includes('cloudinary')) {
          const publicId = extractPublicId(menuItem.image);
          if (publicId) {
            await cloudinary.uploader.destroy(publicId).catch(err => console.error('Cloudinary destroy error:', err));
          }
        } else if (!menuItem.image.startsWith('http')) {
          // Old local file
          const oldImagePath = path.join(__dirname, '../uploads', menuItem.image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
      }
    }

    menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    // Emit socket event for real-time update
    if (req.io) {
      req.io.emit('menuUpdated', { action: 'update', item: withFullImageUrl(menuItem, req) });
    }

    res.json({
      success: true,
      data: withFullImageUrl(menuItem, req)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
// @access  Private/Admin
exports.deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    // Delete image if exists
    if (menuItem.image && menuItem.image !== 'default-food.jpg') {
      if (menuItem.image.startsWith('http') && menuItem.image.includes('cloudinary')) {
        const publicId = extractPublicId(menuItem.image);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId).catch(err => console.error('Cloudinary destroy error:', err));
        }
      } else if (!menuItem.image.startsWith('http')) {
        const imagePath = path.join(__dirname, '../uploads', menuItem.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }

    await menuItem.deleteOne();

    // Emit socket event for real-time update
    if (req.io) {
      req.io.emit('menuUpdated', { action: 'delete', itemId: req.params.id });
    }

    res.json({
      success: true,
      message: 'Menu item deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get menu by categories
// @route   GET /api/menu/categories
// @access  Public
exports.getMenuByCategories = async (req, res) => {
  try {
    // Read categories from the schema enum so they always stay in sync
    const categories = MenuItem.schema.path('category').enumValues;
    const menu = {};

    for (const category of categories) {
      const items = await MenuItem.find({ 
        category, 
        isAvailable: true 
      }).sort({ name: 1 });
      menu[category] = items.map(item => withFullImageUrl(item, req));
    }

    res.json({
      success: true,
      data: menu
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Toggle item availability
// @route   PATCH /api/menu/:id/availability
// @access  Private/Admin
exports.toggleAvailability = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    menuItem.isAvailable = !menuItem.isAvailable;
    await menuItem.save();

    // Emit socket event for real-time update
    if (req.io) {
      req.io.emit('menuUpdated', { action: 'update', item: withFullImageUrl(menuItem, req) });
    }

    res.json({
      success: true,
      data: withFullImageUrl(menuItem, req)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
