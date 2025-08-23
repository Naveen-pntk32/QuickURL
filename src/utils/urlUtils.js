// src/utils/urlUtils.js

/**
 * Validate if a string is a valid URL
 * @param {string} urlString - The URL string to validate
 * @returns {boolean} - True if valid URL, false otherwise
 */
export const isValidUrl = (urlString) => {
  try {
    new URL(urlString);
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * Validate if a string is a valid integer
 * @param {string} value - The value to validate
 * @returns {boolean} - True if valid integer, false otherwise
 */
export const isValidInteger = (value) => {
  if (value === '' || value === null || value === undefined) return false;
  const num = Number(value);
  return Number.isInteger(num) && num > 0;
};

/**
 * Validate if a string is alphanumeric
 * @param {string} value - The value to validate
 * @returns {boolean} - True if alphanumeric, false otherwise
 */
export const isAlphanumeric = (value) => {
  if (!value) return false;
  return /^[a-zA-Z0-9]+$/.test(value);
};

/**
 * Generate a random shortcode
 * @param {number} length - Length of the shortcode
 * @returns {string} - Generated shortcode
 */
export const generateShortcode = (length = 6) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

/**
 * Format date to a readable string
 * @param {Date} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleString();
};

/**
 * Check if a URL has expired
 * @param {Date} expiryDate - Expiry date
 * @returns {boolean} - True if expired, false otherwise
 */
export const isExpired = (expiryDate) => {
  return new Date() > new Date(expiryDate);
};

/**
 * Generate a mock geographical location
 * @returns {object} - Mock location with city and country
 */
export const generateMockLocation = () => {
  const cities = [
    'New York', 'London', 'Tokyo', 'Paris', 'Sydney',
    'Berlin', 'Mumbai', 'São Paulo', 'Cairo', 'Moscow',
    'Beijing', 'Mexico City', 'Jakarta', 'Lagos', 'Delhi',
    'Bangkok', 'Seoul', 'Shanghai', 'São Paulo', 'Mumbai'
  ];
  
  const countries = [
    'USA', 'UK', 'Japan', 'France', 'Australia',
    'Germany', 'India', 'Brazil', 'Egypt', 'Russia',
    'China', 'Mexico', 'Indonesia', 'Nigeria', 'India',
    'Thailand', 'South Korea', 'China', 'Brazil', 'India'
  ];
  
  const randomIndex = Math.floor(Math.random() * cities.length);
  
  return {
    city: cities[randomIndex],
    country: countries[randomIndex]
  };
};

export default {
  isValidUrl,
  isValidInteger,
  isAlphanumeric,
  generateShortcode,
  formatDate,
  isExpired,
  generateMockLocation
};