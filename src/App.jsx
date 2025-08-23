import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import URLShortenerPage from './pages/URLShortenerPage';
import StatsPage from './pages/StatsPage';
import RedirectPage from './pages/RedirectPage';
import './App.css';

// Create a theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#e57373',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navigation />
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shorten" element={<URLShortenerPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/:shortcode" element={<RedirectPage />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;