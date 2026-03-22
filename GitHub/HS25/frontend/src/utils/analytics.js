// Simple analytics utility for frontend tracking

// Initialize analytics with configuration
export const initAnalytics = (config = {}) => {
  // Set default configuration
  window.appAnalytics = {
    enabled: true,
    anonymizeIp: true,
    trackErrors: true,
    trackNavigation: true,
    ...config
  };
  
  // Setup error tracking
  if (window.appAnalytics.trackErrors) {
    setupErrorTracking();
  }
  
  // Setup navigation tracking
  if (window.appAnalytics.trackNavigation) {
    setupNavigationTracking();
  }
  
  console.log('Analytics initialized');
};

// Track page views
export const trackPageView = (path, title) => {
  if (!window.appAnalytics?.enabled) return;
  
  const data = {
    path,
    title,
    timestamp: new Date().toISOString()
  };
  
  // Log locally for development
  console.log('Page View:', data);
  
  // Send to backend API
  sendToAnalyticsAPI('pageview', data);
};

// Track user events
export const trackEvent = (category, action, label = null, value = null) => {
  if (!window.appAnalytics?.enabled) return;
  
  const data = {
    category,
    action,
    label,
    value,
    timestamp: new Date().toISOString()
  };
  
  // Log locally for development
  console.log('Event:', data);
  
  // Send to backend API
  sendToAnalyticsAPI('event', data);
};

// Track user timing
export const trackTiming = (category, variable, time, label = null) => {
  if (!window.appAnalytics?.enabled) return;
  
  const data = {
    category,
    variable,
    time,
    label,
    timestamp: new Date().toISOString()
  };
  
  // Log locally for development
  console.log('Timing:', data);
  
  // Send to backend API
  sendToAnalyticsAPI('timing', data);
};

// Helper function to send data to backend
const sendToAnalyticsAPI = (type, data) => {
  // In production, send to your backend API
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type,
        data
      }),
      // Use beacon API for better reliability when page is unloading
      keepalive: true
    }).catch(err => console.error('Analytics API error:', err));
  }
};

// Setup error tracking
const setupErrorTracking = () => {
  window.addEventListener('error', (event) => {
    trackEvent('Error', 'JavaScript Error', event.message);
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    trackEvent('Error', 'Unhandled Promise Rejection', event.reason);
  });
};

// Setup navigation tracking
const setupNavigationTracking = () => {
  // Track initial page load
  trackPageView(window.location.pathname, document.title);
  
  // Track history changes (for SPA)
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  history.pushState = function() {
    originalPushState.apply(this, arguments);
    trackPageView(window.location.pathname, document.title);
  };
  
  history.replaceState = function() {
    originalReplaceState.apply(this, arguments);
    trackPageView(window.location.pathname, document.title);
  };
  
  window.addEventListener('popstate', () => {
    trackPageView(window.location.pathname, document.title);
  });
};

// Performance monitoring
export const measurePerformance = (name, callback) => {
  const startTime = performance.now();
  const result = callback();
  const duration = performance.now() - startTime;
  
  trackTiming('Performance', name, duration);
  return result;
};

// Async performance monitoring
export const measurePerformanceAsync = async (name, callback) => {
  const startTime = performance.now();
  const result = await callback();
  const duration = performance.now() - startTime;
  
  trackTiming('Performance', name, duration);
  return result;
};