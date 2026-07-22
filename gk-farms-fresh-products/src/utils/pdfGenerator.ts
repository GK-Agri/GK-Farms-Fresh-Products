import jsPDF from 'jspdf';
import { Order } from '../types';

export function generateInvoicePDF(order: Order) {
  const doc = new jsPDF();

  // Primary Header Bar
  doc.setFillColor(46, 125, 50); // #2E7D32 Green
  doc.rect(0, 0, 210, 32, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('GK FARMS FRESH PRODUCTS', 14, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Official Farm Products Tax Invoice', 140, 20);

  // Invoice Details Box
  doc.setTextColor(33, 33, 33);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Invoice No: ${order.invoiceNumber}`, 14, 45);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 52);
  doc.text(`Tracking No: ${order.trackingNumber}`, 14, 59);

  // Status Badge
  doc.setFillColor(order.paymentStatus === 'completed' ? 220 : 255, order.paymentStatus === 'completed' ? 245 : 235, 220);
  doc.rect(140, 42, 56, 16, 'F');
  doc.setTextColor(order.paymentStatus === 'completed' ? 46 : 180, order.paymentStatus === 'completed' ? 125 : 40, 50);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`PAYMENT: ${order.paymentStatus.toUpperCase()}`, 144, 52);

  // Customer & Shipping Info
  doc.setFillColor(245, 247, 245);
  doc.rect(14, 68, 182, 32, 'F');
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Billed To & Delivery Address:', 18, 76);
  doc.setFont('helvetica', 'normal');
  doc.text(`${order.customerName} (${order.customerEmail})`, 18, 83);
  doc.text(`Address: ${order.shippingAddress}`, 18, 89);
  doc.text(`Phone: ${order.customerPhone} | Payment Method: ${order.paymentMethod.toUpperCase()}`, 18, 95);

  // Items Table Header
  let y = 110;
  doc.setFillColor(46, 125, 50);
  doc.rect(14, y, 182, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Item Description', 18, y + 7);
  doc.text('Vendor', 90, y + 7);
  doc.text('Qty', 140, y + 7);
  doc.text('Unit Price', 160, y + 7);
  doc.text('Total', 182, y + 7);

  y += 10;
  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'normal');

  // Items Rows
  order.items.forEach((item, index) => {
    if (index % 2 === 1) {
      doc.setFillColor(248, 250, 248);
      doc.rect(14, y, 182, 9, 'F');
    }
    const itemTotal = (item.price * item.quantity).toFixed(2);
    doc.text(item.productName.substring(0, 32), 18, y + 6);
    doc.text(item.vendorName.substring(0, 22), 90, y + 6);
    doc.text(`${item.quantity} ${item.unit}`, 140, y + 6);
    doc.text(`$${item.price.toFixed(2)}`, 160, y + 6);
    doc.text(`$${itemTotal}`, 182, y + 6);
    y += 9;
  });

  y += 6;
  doc.setDrawColor(200, 200, 200);
  doc.line(14, y, 196, y);

  // Financial Summary Breakdown
  y += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', 140, y);
  doc.text(`$${order.subtotal.toFixed(2)}`, 182, y);

  if (order.discount > 0) {
    y += 6;
    doc.setTextColor(46, 125, 50);
    doc.text('Coupon Discount:', 140, y);
    doc.text(`-$${order.discount.toFixed(2)}`, 182, y);
    doc.setTextColor(30, 30, 30);
  }

  y += 6;
  doc.text('Delivery Fee:', 140, y);
  doc.text(`$${order.deliveryFee.toFixed(2)}`, 182, y);

  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(46, 125, 50);
  doc.text('Total Amount Paid:', 140, y);
  doc.text(`$${order.totalPrice.toFixed(2)}`, 182, y);

  // Footer Note
  y += 20;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(120, 120, 120);
  doc.text('Thank you for supporting local farm growers and organic agricultural practices!', 14, y);
  doc.text('GK Farms Fresh Products • 100% Guaranteed Fresh Farm Produce • www.gkfarmsfresh.com', 14, y + 6);

  // Save the PDF
  doc.save(`${order.invoiceNumber}_GK_Farms_Invoice.pdf`);
}
