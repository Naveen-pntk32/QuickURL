import React from 'react';
import { Container, Typography, Box, Card, CardContent, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const HomePage = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          QuickURL
        </Typography>
        <Typography variant="h5" color="textSecondary" gutterBottom>
          The fastest way to shorten your URLs
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Create short, memorable links for your long URLs. Track clicks, set expiration dates, and manage all your links in one place.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          component={RouterLink} 
          to="/shorten"
          sx={{ mr: 2 }}
        >
          Shorten a URL
        </Button>
        <Button 
          variant="outlined" 
          color="primary" 
          size="large" 
          component={RouterLink} 
          to="/stats"
        >
          View Statistics
        </Button>
      </Box>
      
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            How It Works
          </Typography>
          <Typography variant="body1" paragraph>
            1. Enter your long URL in the shortener form
          </Typography>
          <Typography variant="body1" paragraph>
            2. Customize the expiration time and shortcode (optional)
          </Typography>
          <Typography variant="body1" paragraph>
            3. Get your shortened URL instantly
          </Typography>
          <Typography variant="body1">
            4. Share your short URL and track clicks in the statistics page
          </Typography>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Features
          </Typography>
          <Typography variant="body1" paragraph>
            • Shorten up to 5 URLs at once
          </Typography>
          <Typography variant="body1" paragraph>
            • Set custom expiration times
          </Typography>
          <Typography variant="body1" paragraph>
            • Create custom shortcodes
          </Typography>
          <Typography variant="body1" paragraph>
            • Track clicks with location and device information
          </Typography>
          <Typography variant="body1">
            • Fully responsive design that works on all devices
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default HomePage;