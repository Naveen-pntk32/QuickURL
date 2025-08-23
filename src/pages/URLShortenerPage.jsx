import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Snackbar,
  Grid,
  IconButton,
  Tooltip
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { isValidUrl, isValidInteger, isAlphanumeric, generateShortcode } from '../utils/urlUtils';
import { addUrl, getUrls } from '../utils/storage';
import { logRequest, logResponse, logError } from '../middleware/logging';

const URLShortenerPage = () => {
  const [urls, setUrls] = useState([
    { id: 1, longUrl: '', validity: '', customShortcode: '' }
  ]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [shortenedUrls, setShortenedUrls] = useState([]);

  const addUrlField = () => {
    if (urls.length < 5) {
      setUrls([...urls, { id: Date.now(), longUrl: '', validity: '', customShortcode: '' }]);
    } else {
      setSnackbar({
        open: true,
        message: 'You can only shorten up to 5 URLs at once',
        severity: 'warning'
      });
    }
  };

  const removeUrlField = (id) => {
    if (urls.length > 1) {
      setUrls(urls.filter(url => url.id !== id));
    }
  };

  const handleUrlChange = (id, field, value) => {
    setUrls(urls.map(url => 
      url.id === id ? { ...url, [field]: value } : url
    ));
  };

  const validateForm = () => {
    // Check for duplicate custom shortcodes
    const customShortcodes = urls
      .filter(url => url.customShortcode.trim())
      .map(url => url.customShortcode.trim());
    
    const uniqueShortcodes = new Set(customShortcodes);
    if (customShortcodes.length !== uniqueShortcodes.size) {
      setSnackbar({
        open: true,
        message: 'Duplicate custom shortcodes are not allowed',
        severity: 'error'
      });
      return false;
    }
    
    // Check if custom shortcodes already exist in storage
    const existingUrls = getUrls();
    for (const url of urls) {
      if (url.customShortcode && existingUrls.some(existingUrl => 
        existingUrl.shortcode === url.customShortcode.trim())) {
        setSnackbar({
          open: true,
          message: `Shortcode "${url.customShortcode}" already exists`,
          severity: 'error'
        });
        return false;
      }
    }

    for (const url of urls) {
      if (!url.longUrl.trim()) {
        setSnackbar({
          open: true,
          message: 'Please enter a long URL',
          severity: 'error'
        });
        return false;
      }

      if (!isValidUrl(url.longUrl)) {
        setSnackbar({
          open: true,
          message: 'Please enter a valid URL (include http:// or https://)',
          severity: 'error'
        });
        return false;
      }

      if (url.validity && !isValidInteger(url.validity)) {
        setSnackbar({
          open: true,
          message: 'Validity must be a positive integer',
          severity: 'error'
        });
        return false;
      }

      if (url.customShortcode && !isAlphanumeric(url.customShortcode)) {
        setSnackbar({
          open: true,
          message: 'Custom shortcode must be alphanumeric',
          severity: 'error'
        });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    logRequest('POST', '/api/shorten', urls);
    
    try {
      const newShortenedUrls = [];
      
      for (const url of urls) {
        // Generate shortcode
        const shortcode = url.customShortcode || generateShortcode(6);
        
        // Calculate expiry time (default 30 minutes)
        const validityMinutes = url.validity ? parseInt(url.validity) : 30;
        const expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + validityMinutes);
        
        // Create URL data object
        const urlData = {
          shortcode,
          longUrl: url.longUrl,
          expiryDate: expiryDate.toISOString(),
          createdAt: new Date().toISOString(),
          totalClicks: 0,
          clicks: []
        };
        
        // Save to storage
        addUrl(urlData);
        newShortenedUrls.push(urlData);
      }
      
      setShortenedUrls(newShortenedUrls);
      logResponse('POST', '/api/shorten', newShortenedUrls);
      
      setSnackbar({
        open: true,
        message: 'URLs shortened successfully!',
        severity: 'success'
      });
      
      // Reset form
      setUrls([{ id: 1, longUrl: '', validity: '', customShortcode: '' }]);
    } catch (error) {
      logError('POST', '/api/shorten', error);
      setSnackbar({
        open: true,
        message: 'Error shortening URLs: ' + error.message,
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        URL Shortener
      </Typography>
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Shorten your URLs
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {urls.map((url, index) => (
                <Grid item xs={12} key={url.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={5}>
                          <TextField
                            fullWidth
                            label="Long URL"
                            placeholder="https://example.com"
                            value={url.longUrl}
                            onChange={(e) => handleUrlChange(url.id, 'longUrl', e.target.value)}
                            required
                            error={!url.longUrl.trim() && url.longUrl !== ''}
                            helperText={!url.longUrl.trim() && url.longUrl !== '' ? 'URL is required' : ''}
                          />
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <TextField
                            fullWidth
                            label="Validity (minutes)"
                            type="number"
                            placeholder="30"
                            value={url.validity}
                            onChange={(e) => handleUrlChange(url.id, 'validity', e.target.value)}
                            error={url.validity && !isValidInteger(url.validity)}
                            helperText={url.validity && !isValidInteger(url.validity) ? 'Enter a positive integer' : ''}
                          />
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <TextField
                            fullWidth
                            label="Custom Shortcode"
                            placeholder="optional"
                            value={url.customShortcode}
                            onChange={(e) => handleUrlChange(url.id, 'customShortcode', e.target.value)}
                            error={url.customShortcode && !isAlphanumeric(url.customShortcode)}
                            helperText={url.customShortcode && !isAlphanumeric(url.customShortcode) ? 'Only alphanumeric characters' : ''}
                          />
                        </Grid>
                        <Grid item xs={12} md={1}>
                          {urls.length > 1 && (
                            <Tooltip title="Remove">
                              <IconButton 
                                onClick={() => removeUrlField(url.id)}
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={addUrlField}
                    disabled={urls.length >= 5}
                  >
                    Add URL
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                  >
                    Shorten URLs
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
      
      {shortenedUrls.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Shortened URLs
            </Typography>
            
            <Grid container spacing={2}>
              {shortenedUrls.map((urlData) => (
                <Grid item xs={12} key={urlData.shortcode}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body1">
                        <strong>Short URL:</strong> {`${window.location.origin}/${urlData.shortcode}`}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Original URL:</strong> {urlData.longUrl}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Expires:</strong> {new Date(urlData.expiryDate).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Shortcode:</strong> {urlData.shortcode}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default URLShortenerPage;