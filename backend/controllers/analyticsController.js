const { Order, MenuItem, Offer } = require('../models');

// @desc    Get dashboard stats
// @route   GET /api/analytics/dashboard
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Today's stats
    const todayOrders = await Order.find({
      createdAt: { $gte: today, $lte: todayEnd }
    });

    const todayStats = {
      totalOrders: todayOrders.length,
      revenue: todayOrders.reduce((sum, order) => sum + order.total, 0),
      pendingOrders: todayOrders.filter(o => o.status === 'new').length,
      preparingOrders: todayOrders.filter(o => o.status === 'preparing').length,
      readyOrders: todayOrders.filter(o => o.status === 'ready').length,
      completedOrders: todayOrders.filter(o => o.status === 'completed').length,
      
      // Payment Breakdown
      cashPaymentsTotal: todayOrders.filter(o => o.paymentStatus === 'cash_received' && o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0),
      onlinePaymentsTotal: todayOrders.filter(o => o.paymentStatus === 'online_verified' && o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0),
      pendingPaymentsAmount: todayOrders.filter(o => o.paymentStatus === 'pending' && o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0),
      unpaidOrdersCount: todayOrders.filter(o => o.paymentStatus === 'pending' && o.status !== 'cancelled').length
    };

    // All time stats
    const allOrders = await Order.find({ status: { $ne: 'cancelled' } });
    const allTimeStats = {
      totalOrders: allOrders.length,
      totalRevenue: allOrders.reduce((sum, order) => sum + order.total, 0)
    };

    // This week stats
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekOrders = await Order.find({
      createdAt: { $gte: weekStart },
      status: { $ne: 'cancelled' }
    });
    const weekStats = {
      totalOrders: weekOrders.length,
      revenue: weekOrders.reduce((sum, order) => sum + order.total, 0)
    };

    // This month stats
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthOrders = await Order.find({
      createdAt: { $gte: monthStart },
      status: { $ne: 'cancelled' }
    });
    const monthStats = {
      totalOrders: monthOrders.length,
      revenue: monthOrders.reduce((sum, order) => sum + order.total, 0)
    };

    res.json({
      success: true,
      data: {
        today: todayStats,
        allTime: allTimeStats,
        thisWeek: weekStats,
        thisMonth: monthStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get revenue analytics
// @route   GET /api/analytics/revenue
// @access  Private
exports.getRevenueAnalytics = async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    let startDate, groupFormat;

    const now = new Date();
    
    if (period === 'week') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 6);
      groupFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
    } else if (period === 'month') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 29);
      groupFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
    } else {
      startDate = new Date(now.getFullYear(), 0, 1);
      groupFormat = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
    }

    startDate.setHours(0, 0, 0, 0);

    const revenueData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: groupFormat,
          revenue: { $sum: '$total' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: revenueData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get peak hours
// @route   GET /api/analytics/peak-hours
// @access  Private
exports.getPeakHours = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const peakHours = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: { $hour: '$createdAt' },
          count: { $sum: 1 },
          revenue: { $sum: '$total' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: peakHours
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get top selling items
// @route   GET /api/analytics/top-items
// @access  Private
exports.getTopItems = async (req, res) => {
  try {
    const { limit = 10, period = 'month' } = req.query;
    
    let startDate = new Date();
    if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    const topItems = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: 'cancelled' }
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.menuItem',
          name: { $first: '$items.name' },
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.subtotal' }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.json({
      success: true,
      data: topItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get customer analytics
// @route   GET /api/analytics/customers
// @access  Private
exports.getCustomerAnalytics = async (req, res) => {
  try {
    // Get unique customers
    const customers = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: '$customer.phone',
          name: { $last: '$customer.name' },
          phone: { $first: '$customer.phone' },
          email: { $last: '$customer.email' },
          address: { $last: '$customer.address' },
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$total' },
          lastOrder: { $max: '$createdAt' },
          firstOrder: { $min: '$createdAt' }
        }
      },
      { $sort: { totalOrders: -1 } }
    ]);

    // Calculate repeat customer percentage
    const totalCustomers = customers.length;
    const repeatCustomers = customers.filter(c => c.totalOrders > 1).length;
    const repeatPercentage = totalCustomers > 0 
      ? ((repeatCustomers / totalCustomers) * 100).toFixed(1) 
      : 0;

    // Calculate average order value
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    const totalOrders = customers.reduce((sum, c) => sum + c.totalOrders, 0);
    const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

    res.json({
      success: true,
      data: {
        customers,
        stats: {
          totalCustomers,
          repeatCustomers,
          repeatPercentage,
          avgOrderValue
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get orders by category
// @route   GET /api/analytics/categories
// @access  Private
exports.getCategoryAnalytics = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const categoryData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          status: { $ne: 'cancelled' }
        }
      },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'menuitems',
          localField: 'items.menuItem',
          foreignField: '_id',
          as: 'menuItem'
        }
      },
      { $unwind: '$menuItem' },
      {
        $group: {
          _id: '$menuItem.category',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.subtotal' }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    res.json({
      success: true,
      data: categoryData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get comprehensive analytics based on date and period
// @route   GET /api/analytics/comprehensive
// @access  Private
exports.getComprehensiveAnalytics = async (req, res) => {
  try {
    const { date, period = 'day' } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    
    let startDate = new Date(targetDate);
    let endDate = new Date(targetDate);
    let groupFormat;

    if (period === 'day') {
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      groupFormat = { $hour: '$createdAt' };
    } else if (period === 'week') {
      startDate.setDate(targetDate.getDate() - targetDate.getDay());
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
      groupFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
    } else if (period === 'month') {
      startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
      endDate = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999);
      groupFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
    } else if (period === 'year') {
      startDate = new Date(targetDate.getFullYear(), 0, 1);
      endDate = new Date(targetDate.getFullYear(), 11, 31);
      endDate.setHours(23, 59, 59, 999);
      groupFormat = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
    }

    // 1. Order Summary (Revenue, Total, Completed, Pending, Cancelled)
    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate }
    });

    let revenue = 0;
    let completedOrders = 0;
    let pendingOrders = 0;
    let cancelledOrders = 0;
    let totalOrders = orders.length;

    orders.forEach(o => {
      if (o.status !== 'cancelled') revenue += o.total;
      if (o.status === 'completed') completedOrders++;
      if (o.status === 'new' || o.status === 'preparing' || o.status === 'ready') pendingOrders++;
      if (o.status === 'cancelled') cancelledOrders++;
    });

    // 2. Sales Graph
    const salesGraph = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate }, status: { $ne: 'cancelled' } } },
      { $group: { _id: groupFormat, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // 3. Peak Hour (from the current period)
    const hourlyDistribution = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate }, status: { $ne: 'cancelled' } } },
      { $group: { _id: { $hour: '$createdAt' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    const peakHour = hourlyDistribution.length > 0 ? `${hourlyDistribution[0]._id}:00` : 'N/A';

    // 4. Top Selling Items
    const topItems = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate }, status: { $ne: 'cancelled' } } },
      { $unwind: '$items' },
      { $group: { _id: '$items.menuItem', name: { $first: '$items.name' }, totalQuantity: { $sum: '$items.quantity' }, totalRevenue: { $sum: '$items.subtotal' } } },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 }
    ]);

    // 5. Category-wise Sales
    const categories = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate }, status: { $ne: 'cancelled' } } },
      { $unwind: '$items' },
      { $lookup: { from: 'menuitems', localField: 'items.menuItem', foreignField: '_id', as: 'menuItem' } },
      { $unwind: '$menuItem' },
      { $group: { _id: '$menuItem.category', totalQuantity: { $sum: '$items.quantity' }, totalRevenue: { $sum: '$items.subtotal' } } },
      { $sort: { totalRevenue: -1 } }
    ]);

    // 6. Repeat Customers %
    const customers = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate }, status: { $ne: 'cancelled' } } },
      { $group: { _id: '$customer.phone', totalOrders: { $sum: 1 } } }
    ]);
    const totalCustomers = customers.length;
    const repeatCustomers = customers.filter(c => c.totalOrders > 1).length;
    const repeatPercentage = totalCustomers > 0 ? ((repeatCustomers / totalCustomers) * 100).toFixed(1) : 0;

    res.json({
      success: true,
      data: {
        summary: { revenue, totalOrders, completedOrders, pendingOrders, cancelledOrders },
        salesGraph,
        peakHour,
        topItems,
        categories,
        repeatPercentage
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
