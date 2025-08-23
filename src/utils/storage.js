// src/utils/storage.js

/**
 * Get URLs from localStorage
 * @returns {Array} - Array of URL objects
 */
export const getUrls = () => {
  try {
    const urls = localStorage.getItem('shortUrls');
    return urls ? JSON.parse(urls) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

/**
 * Save URLs to localStorage
 * @param {Array} urls - Array of URL objects
 */
export const saveUrls = (urls) => {
  try {
    localStorage.setItem('shortUrls', JSON.stringify(urls));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Add a new URL to storage
 * @param {object} urlData - URL data to add
 */
export const addUrl = (urlData) => {
  const urls = getUrls();
  urls.push(urlData);
  saveUrls(urls);
};

/**
 * Update an existing URL in storage
 * @param {string} shortcode - Shortcode of the URL to update
 * @param {object} updates - Updates to apply
 */
export const updateUrl = (shortcode, updates) => {
  const urls = getUrls();
  const index = urls.findIndex(url => url.shortcode === shortcode);
  
  if (index !== -1) {
    urls[index] = { ...urls[index], ...updates };
    saveUrls(urls);
  }
};

/**
 * Find a URL by shortcode
 * @param {string} shortcode - Shortcode to search for
 * @returns {object|null} - URL object or null if not found
 */
export const findUrlByShortcode = (shortcode) => {
  const urls = getUrls();
  return urls.find(url => url.shortcode === shortcode) || null;
};

/**
 * Add a click to a URL
 * @param {string} shortcode - Shortcode of the URL
 * @param {object} clickData - Click data to add
 */
export const addClick = (shortcode, clickData) => {
  const urls = getUrls();
  const index = urls.findIndex(url => url.shortcode === shortcode);
  
  if (index !== -1) {
    if (!urls[index].clicks) {
      urls[index].clicks = [];
    }
    
    urls[index].clicks.push(clickData);
    urls[index].totalClicks = urls[index].clicks.length;
    saveUrls(urls);
  }
};

export default {
  getUrls,
  saveUrls,
  addUrl,
  updateUrl,
  findUrlByShortcode,
  addClick
};