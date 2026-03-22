const winston = require('winston');
const { createLogger, format, transports } = winston;
const { combine, timestamp, printf, colorize, json } = format;

// Configure Winston logger
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp(),
    json()
  ),
  defaultMeta: { service: 'api-service' },
  transports: [
    new transports.Console({
      format: combine(
        colorize(),
        printf(({ level, message, timestamp, ...metadata }) => {
          return `${timestamp} ${level}: ${message} ${Object.keys(metadata).length ? JSON.stringify(metadata) : ''}`;
        })
      )
    }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' })
  ]
});

// Track API requests
const trackApiRequest = (req, res, next) => {
  const start = Date.now();
  
  // Once the request is finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    logger.info('API Request', {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('user-agent'),
      userId: req.user ? req.user.id : 'unauthenticated',
      ip: req.ip
    });
  });
  
  next();
};

// Track errors
const trackError = (err, req, res, next) => {
  logger.error('Application Error', {
    error: {
      message: err.message,
      stack: err.stack,
      name: err.name
    },
    request: {
      method: req.method,
      url: req.originalUrl,
      userAgent: req.get('user-agent'),
      userId: req.user ? req.user.id : 'unauthenticated',
      ip: req.ip
    }
  });
  
  next(err);
};

// Track business events
const trackEvent = (eventName, data = {}) => {
  logger.info(`Event: ${eventName}`, { ...data });
  
  // Here you could also send events to external analytics services
  // like Google Analytics, Mixpanel, etc.
};

// Performance monitoring
const trackPerformance = (operationName, callback) => {
  const start = Date.now();
  
  try {
    return callback();
  } finally {
    const duration = Date.now() - start;
    logger.info(`Performance: ${operationName}`, { duration: `${duration}ms` });
  }
};

// Async performance monitoring
const trackPerformanceAsync = async (operationName, callback) => {
  const start = Date.now();
  
  try {
    return await callback();
  } finally {
    const duration = Date.now() - start;
    logger.info(`Performance: ${operationName}`, { duration: `${duration}ms` });
  }
};

module.exports = {
  logger,
  trackApiRequest,
  trackError,
  trackEvent,
  trackPerformance,
  trackPerformanceAsync
};