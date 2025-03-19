# Docker Usage Instructions

## Development Mode

For development and testing interactive features, use the development Docker setup:

```bash
# Build and start the development container
docker-compose -f docker-compose.dev.yml up --build
```

This will:
- Run the React app in development mode with hot reloading
- Make the app available at http://localhost:5173
- Mount source files for real-time changes

### Testing Interactive Features in Development Mode

1. **Home Page**: http://localhost:5173/
   - Click "Get Started" to navigate to registration
   - Click "Sign In" to navigate to login

2. **Login**: http://localhost:5173/login
   - Enter credentials to access dashboard
   - Test invalid credentials to see error handling

3. **Registration**: http://localhost:5173/register
   - Create a new account
   - Test form validation

4. **Dashboard**: http://localhost:5173/dashboard
   - View measurements
   - Access face analysis features

5. **Face Analysis**: http://localhost:5173/analyze
   - Test webcam-based face analysis
   - Try calibration and measurement features

## Production Mode

For production deployment, use the standard Docker setup:

```bash
# Build and start the production container
docker-compose up --build
```

This will:
- Build an optimized production version of the app
- Serve it using Nginx at http://localhost:80
- Enable proper client-side routing using the nginx.conf

## Switching Between Modes

You can have both containers running simultaneously on different ports:
- Development: http://localhost:5173
- Production: http://localhost:80

This allows you to compare functionality between development and production builds.

## Troubleshooting

If you encounter routing issues:
1. Verify that your browser console doesn't show any errors
2. Check that the container is running (`docker ps`)
3. Ensure ports are properly exposed and not blocked by a firewall
4. For webcam access, make sure you're using HTTPS or localhost 