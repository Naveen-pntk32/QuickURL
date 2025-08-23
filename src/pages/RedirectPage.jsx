import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Link
} from '@mui/material';
import { findUrlByShortcode, addClick } from '../utils/storage';
import { isExpired, generateMockLocation } from '../utils/urlUtils';
import { logRequest, logResponse, logError } from '../middleware/logging';

const RedirectPage = () => {
  const { shortcode } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const redirect = async () => {
      logRequest('GET', `/api/redirect/${shortcode}`, {});
      
      try {
        // Find the URL by shortcode
        const urlData = findUrlByShortcode(shortcode);
        
        if (!urlData) {
          logError('GET', `/api/redirect/${shortcode}`, 'URL not found');
          setError({
            title: 'Invalid Short URL',
            message: 'The requested link was not found.',
            action: 'create'
          });
          setLoading(false);
          return;
        }
        
        // Check if the URL has expired
        if (isExpired(urlData.expiryDate)) {
          logError('GET', `/api/redirect/${shortcode}`, 'URL expired');
          setError({
            title: 'Link Expired',
            message: 'This link has expired and is no longer valid.',
            action: 'create'
          });
          setLoading(false);
          return;
        }
        
        // Record the click with mock data
        const clickData = {
          timestamp: new Date().toISOString(),
          source: Math.random() > 0.5 ? 'browser' : 'mobile',
          location: generateMockLocation()
        };
        
        addClick(shortcode, clickData);
        logResponse('GET', `/api/redirect/${shortcode}`, { redirected: true });
        
        // Redirect to the long URL
        window.location.href = urlData.longUrl;
      } catch (error) {
        logError('GET', `/api/redirect/${shortcode}`, error);
        setError({
          title: 'Redirect Error',
          message: 'An error occurred while redirecting. Please try again.',
          action: 'retry'
        });
        setLoading(false);
      }
    };
    
    redirect();
  }, [shortcode]);

  const handleAction = () => {
    if (error && error.action === 'create') {
      navigate('/shorten');
    } else if (error && error.action === 'retry') {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    navigate('/shorten');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Card>
        <CardContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            {loading ? (
              <>
                <CircularProgress size={60} sx={{ mb: 2 }} />
                <Typography variant="h6">
                  Redirecting...
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Please wait while we redirect you to your destination.
                </Typography>
              </>
            ) : error ? (
              <>
                <Alert severity="error" sx={{ mb: 2 }}>
                  <Typography variant="h6" component="div">
                    {error.title}
                  </Typography>
                  <Typography variant="body2">
                    {error.message}
                  </Typography>
                </Alert>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleAction}
                  >
                    {error.action === 'create' ? 'Create New Short URL' : 'Retry'}
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={handleGoHome}
                  >
                    Go to Home
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Alert severity="success" sx={{ mb: 2 }}>
                  Redirecting completed successfully!
                </Alert>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleGoHome}
                >
                  Shorten Another URL
                </Button>
              </>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default RedirectPage;