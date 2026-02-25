const { trackApiRequest, trackError } = require('../utils/analytics');

// Setup monitoring middleware
const setupMonitoring = (app) => {
  // Track all API requests
  app.use(trackApiRequest);
  
  // Track errors (should be placed after routes but before error handler)
  app.use(trackError);
};

module.exports = setupMonitoring;