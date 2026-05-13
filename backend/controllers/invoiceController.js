const PDFDocument = require('pdfkit');
const { Order, Settings } = require('../models');

// @desc    Generate invoice PDF
// @route   GET /api/invoice/:orderId
// @access  Private
exports.generateInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const settings = await Settings.getSettings();

    // Create PDF
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=invoice-${order.orderNumber}.pdf`
    );

    // Pipe PDF to response
    doc.pipe(res);

    // Colors
    const primaryColor = '#8B4513';
    const secondaryColor = '#D2691E';

    // Header
    doc
      .fillColor(primaryColor)
      .fontSize(28)
      .font('Helvetica-Bold')
      .text(settings.cafeName, 50, 50);

    doc
      .fillColor('#666')
      .fontSize(10)
      .font('Helvetica')
      .text(settings.tagline, 50, 82);

    // Invoice title
    doc
      .fillColor(primaryColor)
      .fontSize(20)
      .font('Helvetica-Bold')
      .text('INVOICE', 400, 50, { align: 'right' });

    // Invoice details
    doc
      .fillColor('#333')
      .fontSize(10)
      .font('Helvetica')
      .text(`Invoice No: ${order.orderNumber}`, 400, 80, { align: 'right' })
      .text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, 400, 95, { align: 'right' })
      .text(`Time: ${new Date(order.createdAt).toLocaleTimeString('en-IN')}`, 400, 110, { align: 'right' });

    // Divider
    doc
      .strokeColor(secondaryColor)
      .lineWidth(2)
      .moveTo(50, 140)
      .lineTo(550, 140)
      .stroke();

    // Cafe details
    doc
      .fillColor('#333')
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('From:', 50, 160);

    doc
      .font('Helvetica')
      .text(settings.cafeName, 50, 175)
      .text(settings.address, 50, 190)
      .text(`Phone: ${settings.phone}`, 50, 205)
      .text(`Email: ${settings.email}`, 50, 220);

    // Customer details
    doc
      .font('Helvetica-Bold')
      .text('Bill To:', 300, 160);

    doc
      .font('Helvetica')
      .text(order.customer.name, 300, 175)
      .text(order.customer.address, 300, 190, { width: 250 })
      .text(`Phone: ${order.customer.phone}`, 300, 220);

    // Items table header
    const tableTop = 270;
    
    doc
      .fillColor('#fff')
      .rect(50, tableTop, 500, 25)
      .fill(primaryColor);

    doc
      .fillColor('#fff')
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('Item', 60, tableTop + 8)
      .text('Qty', 320, tableTop + 8, { width: 50, align: 'center' })
      .text('Price', 380, tableTop + 8, { width: 70, align: 'right' })
      .text('Total', 460, tableTop + 8, { width: 80, align: 'right' });

    // Items
    let yPosition = tableTop + 35;
    
    order.items.forEach((item, index) => {
      const isEven = index % 2 === 0;
      
      if (isEven) {
        doc
          .fillColor('#f9f9f9')
          .rect(50, yPosition - 5, 500, 25)
          .fill();
      }

      doc
        .fillColor('#333')
        .fontSize(10)
        .font('Helvetica')
        .text(item.name, 60, yPosition, { width: 250 })
        .text(item.quantity.toString(), 320, yPosition, { width: 50, align: 'center' })
        .text(`${settings.currency}${item.price.toFixed(2)}`, 380, yPosition, { width: 70, align: 'right' })
        .text(`${settings.currency}${item.subtotal.toFixed(2)}`, 460, yPosition, { width: 80, align: 'right' });

      yPosition += 25;
    });

    // Totals
    yPosition += 20;
    
    doc
      .strokeColor('#ddd')
      .lineWidth(1)
      .moveTo(350, yPosition)
      .lineTo(550, yPosition)
      .stroke();

    yPosition += 15;

    doc
      .fillColor('#333')
      .fontSize(10)
      .font('Helvetica')
      .text('Subtotal:', 350, yPosition)
      .text(`${settings.currency}${order.subtotal.toFixed(2)}`, 460, yPosition, { width: 80, align: 'right' });

    if (order.discount > 0) {
      yPosition += 20;
      doc
        .fillColor('#27ae60')
        .text(`Discount${order.discountCode ? ` (${order.discountCode})` : ''}:`, 350, yPosition)
        .text(`-${settings.currency}${order.discount.toFixed(2)}`, 460, yPosition, { width: 80, align: 'right' });
    }

    yPosition += 25;
    
    doc
      .strokeColor(primaryColor)
      .lineWidth(2)
      .moveTo(350, yPosition)
      .lineTo(550, yPosition)
      .stroke();

    yPosition += 15;

    doc
      .fillColor(primaryColor)
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('Total:', 350, yPosition)
      .text(`${settings.currency}${order.total.toFixed(2)}`, 440, yPosition, { width: 100, align: 'right' });

    // Payment method
    yPosition += 40;
    doc
      .fillColor('#666')
      .fontSize(10)
      .font('Helvetica')
      .text(`Payment Method: ${order.paymentMethod.toUpperCase()}`, 350, yPosition);

    // Footer
    const footerY = 750;
    
    doc
      .strokeColor('#ddd')
      .lineWidth(1)
      .moveTo(50, footerY)
      .lineTo(550, footerY)
      .stroke();

    doc
      .fillColor('#888')
      .fontSize(9)
      .font('Helvetica')
      .text('Thank you for your order!', 50, footerY + 15, { align: 'center', width: 500 })
      .text(`${settings.cafeName} | ${settings.phone} | ${settings.email}`, 50, footerY + 30, { align: 'center', width: 500 });

    // Finalize PDF
    doc.end();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
