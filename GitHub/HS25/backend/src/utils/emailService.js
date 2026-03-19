const nodemailer = require('nodemailer');

/**
 * Email service for sending notifications
 */
class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  /**
   * Send email
   * @param {Object} options - Email options
   * @returns {Promise} - Nodemailer send result
   */
  async sendEmail(options) {
    const message = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html
    };

    const info = await this.transporter.sendMail(message);
    return info;
  }

  /**
   * Send welcome email
   * @param {Object} user - User object
   * @returns {Promise} - Email send result
   */
  async sendWelcomeEmail(user) {
    return this.sendEmail({
      email: user.email,
      subject: 'Welcome to our store!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to our store, ${user.name}!</h2>
          <p>Thank you for registering with us. We're excited to have you as a customer.</p>
          <p>You can now browse our products, make purchases, and track your orders.</p>
          <p>If you have any questions, please don't hesitate to contact us.</p>
          <p>Best regards,<br>The Store Team</p>
        </div>
      `
    });
  }

  /**
   * Send order confirmation email
   * @param {Object} order - Order object
   * @param {Object} user - User object
   * @returns {Promise} - Email send result
   */
  async sendOrderConfirmationEmail(order, user) {
    // Generate order items HTML
    const orderItemsHtml = order.orderItems.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">$${item.price.toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    return this.sendEmail({
      email: user.email,
      subject: `Order Confirmation - Order #${order._id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Order Confirmation</h2>
          <p>Thank you for your order, ${user.name}!</p>
          <p>Your order has been received and is being processed.</p>
          
          <h3>Order Details</h3>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          
          <h3>Order Items</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f8f9fa;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Product</th>
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Quantity</th>
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Price</th>
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${orderItemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right;"><strong>Subtotal:</strong></td>
                <td style="padding: 10px;">$${(order.totalPrice - order.taxPrice - order.shippingPrice).toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right;"><strong>Tax:</strong></td>
                <td style="padding: 10px;">$${order.taxPrice.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right;"><strong>Shipping:</strong></td>
                <td style="padding: 10px;">$${order.shippingPrice.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="3" style="padding: 10px; text-align: right;"><strong>Total:</strong></td>
                <td style="padding: 10px;"><strong>$${order.totalPrice.toFixed(2)}</strong></td>
              </tr>
            </tfoot>
          </table>
          
          <h3>Shipping Address</h3>
          <p>
            ${order.shippingAddress.address}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
            ${order.shippingAddress.country}
          </p>
          
          <p>We'll send you another email when your order ships.</p>
          <p>Thank you for shopping with us!</p>
          <p>Best regards,<br>The Store Team</p>
        </div>
      `
    });
  }

  /**
   * Send order shipped email
   * @param {Object} order - Order object
   * @param {Object} user - User object
   * @returns {Promise} - Email send result
   */
  async sendOrderShippedEmail(order, user) {
    return this.sendEmail({
      email: user.email,
      subject: `Your Order Has Shipped - Order #${order._id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your Order Has Shipped</h2>
          <p>Good news, ${user.name}! Your order has been shipped.</p>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Shipping Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p>You can track your order status in your account.</p>
          <p>Thank you for shopping with us!</p>
          <p>Best regards,<br>The Store Team</p>
        </div>
      `
    });
  }

  /**
   * Send password reset email
   * @param {Object} options - Options object
   * @returns {Promise} - Email send result
   */
  async sendPasswordResetEmail(options) {
    return this.sendEmail({
      email: options.email,
      subject: 'Password Reset',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset</h2>
          <p>You requested a password reset. Please click the link below to reset your password:</p>
          <p>
            <a href="${options.resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">
              Reset Password
            </a>
          </p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>This link will expire in 10 minutes.</p>
          <p>Best regards,<br>The Store Team</p>
        </div>
      `
    });
  }
}

module.exports = new EmailService();