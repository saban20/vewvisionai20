# Security Guidelines for NewVisionAI

## Environment Variables

### Setup

1. **Never commit `.env` files to version control**
   - The `.env` file contains sensitive information such as API keys, secret keys, and database credentials
   - Always keep `.env` files out of Git repositories

2. **Use the template file**
   - Copy `.env.example` to `.env` for your local development:
     ```
     cp .env.example .env
     ```
   - Update the values in your local `.env` file with your actual credentials

3. **Environment Variable Management**
   - For local development: Use the `.env` file
   - For production: Use environment variables set at the OS/container level
   - For CI/CD: Use secret management tools provided by your CI/CD platform

## API Security

1. **Input Validation**
   - Always validate user inputs, especially when processing file uploads
   - Use a whitelist approach for allowed file types
   - Validate file size and content type

2. **Rate Limiting**
   - Implement rate limiting for all API endpoints to prevent abuse
   - Consider using Flask extensions like Flask-Limiter
   - Add the following to your app.py or routes file:
     ```python
     from flask_limiter import Limiter
     from flask_limiter.util import get_remote_address
     
     limiter = Limiter(
         app,
         key_func=get_remote_address,
         default_limits=["200 per day", "50 per hour"]
     )
     
     # Then on your route:
     @app.route('/api/endpoint')
     @limiter.limit("10 per minute")
     def endpoint():
         # Your code here
     ```

3. **Authentication and Authorization**
   - Always verify user identity before allowing access to protected resources
   - Use JWT tokens with appropriate expiration times
   - Implement role-based access control where needed
   - Validate JWT on the server side for all protected routes

## Database Security

1. **Use Parameterized Queries**
   - Always use SQLAlchemy's ORM or query parameters to prevent SQL injection

2. **Database Credentials**
   - Store database credentials in the `.env` file, never in code
   - For production, use environment variables or a secret management service

## General Security Practices

1. **Keep Dependencies Updated**
   - Regularly run `pip install --upgrade` to update dependencies
   - Use tools like safety to check for vulnerabilities in dependencies

2. **Error Handling**
   - Implement proper error handling with appropriate HTTP status codes
   - Avoid exposing sensitive information in error messages

3. **Security Headers**
   - Implement security headers using Flask-Talisman
   - Consider implementing CORS policies using Flask-CORS 