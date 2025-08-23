# QuickURL - URL Shortener

A production-ready React application for shortening URLs with statistics tracking and expiration features.

## 🚀 Features

- Shorten up to 5 URLs concurrently
- Custom shortcodes and expiration times
- Statistics tracking with click details
- Responsive Material UI design
- Client-side routing
- Local storage for data persistence
- Comprehensive error handling
- Logging middleware for API requests/responses

## 🏗️ Architecture & Design

### Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/               # Page components for routing
├── utils/               # Utility functions
├── middleware/          # Custom logging middleware
├── App.js              # Main application component
└── main.jsx            # Entry point
```

### State Management

The application uses a combination of React's built-in state management and localStorage for data persistence:

1. **Component State**: Managed with React's `useState` and `useEffect` hooks
2. **Persistent State**: Stored in browser's localStorage for URL data
3. **Logging State**: Kept in-memory array for request/response logging

### Routing Strategy

Client-side routing is implemented using React Router with the following routes:

- `/` - Home page
- `/shorten` - URL shortener page
- `/stats` - Statistics page
- `/:shortcode` - Redirect handler

### Logging Strategy

A custom logging middleware is implemented to track:

- API requests with method, URL, and data
- API responses with method, URL, and response data
- Errors with method, URL, and error details

Logs are stored in a local JavaScript array and can be accessed for debugging purposes.

### Assumptions

1. **Data Persistence**: Uses localStorage for data persistence, assuming the application runs in a single browser
2. **Security**: No server-side validation as this is a client-only application
3. **Scalability**: Designed for individual use; would require backend integration for production use
4. **Expiration**: URL expiration is handled client-side and may not be accurate if system time is changed

## 🛠️ Technical Implementation

### URL Shortening

1. Users can enter up to 5 URLs with optional validity periods and custom shortcodes
2. Client-side validation ensures:
   - Valid URL format
   - Valid integer for validity period
   - Alphanumeric custom shortcodes
   - No duplicate shortcodes
3. Shortcodes are either user-provided or auto-generated (6 characters)
4. Expiration dates are calculated based on validity period (default 30 minutes)

### Statistics Tracking

1. All created short URLs are stored in localStorage
2. Click tracking includes:
   - Timestamp of click
   - Source (browser or mobile - simulated)
   - Geographical location (mock random city/country)
3. Statistics are displayed in tabular format with expandable details

### Redirection

1. When visiting a short URL (e.g., `/abcd1`), the app:
   - Checks if the shortcode exists
   - Verifies the URL hasn't expired
   - Records the click with mock data
   - Redirects to the original long URL
2. Error handling for invalid or expired links

### Error Handling

Material UI Alerts are used for all error messages:

- Invalid input validation
- Duplicate shortcode detection
- Expired link handling
- General error states with retry options

## 📦 Dependencies

- React (v18+)
- React Router DOM (v6+)
- Material UI (v5+)
- Emotion (for styling)

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Preview the production build:
   ```bash
   npm run preview
   ```

## 🎨 UI/UX Design

The application follows Material Design principles with:

- Responsive layout that works on all device sizes
- Consistent color scheme and typography
- Clear visual hierarchy and feedback
- Intuitive navigation and user flows
- Accessible components following WCAG guidelines

## 🔒 Security Considerations

As a client-side only application:

- No server-side validation of URLs
- Data is stored in localStorage (not secure for sensitive information)
- No authentication or authorization mechanisms
- For production use, a backend service would be required

## 📈 Scalability Considerations

This implementation is designed for individual use. For production:

- Replace localStorage with a backend database
- Implement proper authentication and authorization
- Add rate limiting for URL creation
- Implement server-side validation
- Add caching mechanisms
- Consider using a dedicated URL shortening service

## 🧪 Testing

The application includes:

- Form validation tests
- Error handling verification
- Responsive design checks
- Cross-browser compatibility

## 🚧 Troubleshooting

### Build Issues

If you encounter build errors (exit code 126), try the following:

1. Ensure you have the correct Node.js version (>=14.0.0)
2. Clear npm cache: `npm cache clean --force`
3. Delete node_modules and reinstall: 
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
4. Try building with: `npm run build`

### Deployment

For deployment, ensure your hosting platform supports:
- Static file serving
- Client-side routing (redirect all routes to index.html)

## 📄 License

MIT License - see LICENSE file for details.
