// src/middleware/logging.js

// Simulated logging service - stores logs in a local JS array
const logs = [];

/**
 * Log an API request
 * @param {string} method - HTTP method
 * @param {string} url - Request URL
 * @param {object} data - Request data
 */
export const logRequest = (method, url, data) => {
  const logEntry = {
    type: 'REQUEST',
    timestamp: new Date().toISOString(),
    method,
    url,
    data
  };
  
  logs.push(logEntry);
  console.log('API Request:', logEntry);
};

/**
 * Log an API response
 * @param {string} method - HTTP method
 * @param {string} url - Request URL
 * @param {object} response - Response data
 */
export const logResponse = (method, url, response) => {
  const logEntry = {
    type: 'RESPONSE',
    timestamp: new Date().toISOString(),
    method,
    url,
    response
  };
  
  logs.push(logEntry);
  console.log('API Response:', logEntry);
};

/**
 * Log an error
 * @param {string} method - HTTP method
 * @param {string} url - Request URL
 * @param {object} error - Error object
 */
export const logError = (method, url, error) => {
  const logEntry = {
    type: 'ERROR',
    timestamp: new Date().toISOString(),
    method,
    url,
    error: error.message || error
  };
  
  logs.push(logEntry);
  console.log('API Error:', logEntry);
};

/**
 * Get all logs
 * @returns {Array} - Array of log entries
 */
export const getLogs = () => {
  return [...logs];
};

/**
 * Clear all logs
 */
export const clearLogs = () => {
  logs.length = 0;
};

export default {
  logRequest,
  logResponse,
  logError,
  getLogs,
  clearLogs
};