import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Alert,
  Button
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { getUrls } from '../utils/storage';
import { formatDate, isExpired } from '../utils/urlUtils';

const StatsPage = () => {
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState(null);

  const loadUrls = () => {
    try {
      const storedUrls = getUrls();
      setUrls(storedUrls);
      setError(null);
    } catch (err) {
      setError('Failed to load URL statistics. Please try again.');
      setUrls([]);
    }
  };

  useEffect(() => {
    loadUrls();
  }, []);

  const handleRefresh = () => {
    loadUrls();
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Card>
          <CardContent>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
              >
                Retry
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        URL Statistics
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button 
          variant="outlined" 
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
        >
          Refresh
        </Button>
      </Box>
      
      {urls.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="h6" align="center" color="textSecondary">
              No shortened URLs found. Create some URLs to see statistics.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Shortened URLs
              </Typography>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Short URL</TableCell>
                      <TableCell>Original URL</TableCell>
                      <TableCell>Expiry</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Clicks</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {urls.map((url) => {
                      const expired = isExpired(url.expiryDate);
                      return (
                        <TableRow key={url.shortcode}>
                          <TableCell>
                            <a href={`/${url.shortcode}`} target="_blank" rel="noopener noreferrer">
                              /{url.shortcode}
                            </a>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ maxWidth: 300, wordBreak: 'break-word' }}>
                              {url.longUrl}
                            </Box>
                          </TableCell>
                          <TableCell>{formatDate(url.expiryDate)}</TableCell>
                          <TableCell>
                            <Chip 
                              label={expired ? 'Expired' : 'Active'} 
                              color={expired ? 'error' : 'success'} 
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{url.totalClicks || 0}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Click Details
              </Typography>
              
              {urls.map((url) => (
                <Accordion key={url.shortcode} sx={{ mb: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>
                      <strong>{url.shortcode}</strong> - {url.longUrl}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {url.clicks && url.clicks.length > 0 ? (
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Timestamp</TableCell>
                              <TableCell>Source</TableCell>
                              <TableCell>Location</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {url.clicks.map((click, index) => (
                              <TableRow key={index}>
                                <TableCell>{formatDate(click.timestamp)}</TableCell>
                                <TableCell>
                                  <Chip 
                                    label={click.source} 
                                    size="small" 
                                    color={click.source === 'mobile' ? 'primary' : 'secondary'} 
                                  />
                                </TableCell>
                                <TableCell>
                                  {click.location.city}, {click.location.country}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Typography>No clicks recorded yet</Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </Container>
  );
};

export default StatsPage;