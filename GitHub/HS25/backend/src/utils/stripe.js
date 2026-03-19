const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const ErrorResponse = require('./errorResponse');

/**
 * Create a Stripe payment intent
 * @param {Number} amount - Amount in cents
 * @param {String} currency - Currency code (default: usd)
 * @param {Object} metadata - Additional metadata
 * @returns {Object} - Stripe payment intent
 */
exports.createPaymentIntent = async (amount, currency = 'usd', metadata = {}) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata
    });

    return paymentIntent;
  } catch (error) {
    throw new ErrorResponse(error.message || 'Error creating payment intent', 500);
  }
};

/**
 * Confirm a Stripe payment intent
 * @param {String} paymentIntentId - Stripe payment intent ID
 * @param {String} paymentMethodId - Stripe payment method ID
 * @returns {Object} - Confirmed payment intent
 */
exports.confirmPaymentIntent = async (paymentIntentId, paymentMethodId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId
    });

    return paymentIntent;
  } catch (error) {
    throw new ErrorResponse(error.message || 'Error confirming payment intent', 500);
  }
};

/**
 * Retrieve a Stripe payment intent
 * @param {String} paymentIntentId - Stripe payment intent ID
 * @returns {Object} - Payment intent
 */
exports.retrievePaymentIntent = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    throw new ErrorResponse(error.message || 'Error retrieving payment intent', 500);
  }
};

/**
 * Create a Stripe webhook event
 * @param {String} payload - Request body
 * @param {String} signature - Stripe signature header
 * @returns {Object} - Stripe event
 */
exports.constructEvent = (payload, signature) => {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    return event;
  } catch (error) {
    throw new ErrorResponse(error.message || 'Webhook signature verification failed', 400);
  }
};