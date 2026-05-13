const { MenuItem } = require('../models');
const fs = require('fs');
const path = require('path');

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
    
    res.json({
      success: true,
      count: menuItems.length,
      data: menuItems
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
      data: menuItem
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
    const itemData = { ...req.body };
    
    if (req.file) {
      itemData.image = req.file.filename;
    }

    const menuItem = await MenuItem.create(itemData);

    // Emit socket event for real-time update
    if (req.io) {
      req.io.emit('menuUpdated', { action: 'create', item: menuItem });
    }

    res.status(201).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
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
      // Delete old image if exists
      if (menuItem.image && menuItem.image !== 'default-food.jpg') {
        const oldImagePath = path.join(__dirname, '../uploads', menuItem.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.image = req.file.filename;
    }

    menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    // Emit socket event for real-time update
    if (req.io) {
      req.io.emit('menuUpdated', { action: 'update', item: menuItem });
    }

    res.json({
      success: true,
      data: menuItem
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
      const imagePath = path.join(__dirname, '../uploads', menuItem.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
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
      menu[category] = await MenuItem.find({ 
        category, 
        isAvailable: true 
      }).sort({ name: 1 });
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
      req.io.emit('menuUpdated', { action: 'update', item: menuItem });
    }

    res.json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
