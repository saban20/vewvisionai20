# Secure File Upload Guidelines

## Overview

File upload functionality is a common attack vector in web applications. The face scanning feature in NewVisionAI requires users to upload images, which presents potential security risks if not properly handled.

## Implemented Security Measures

### 1. Input Validation

We've implemented the following validations for file uploads:

- **Format Validation**: Only accepting specific image formats (JPEG, PNG, WebP)
- **Size Validation**: Rejecting excessively large images (>4000px dimensions)
- **Content Validation**: Verifying the image data can be properly processed
- **Method Validation**: Ensuring only supported processing methods are used

### 2. Rate Limiting

- Implemented using Flask-Limiter
- Face scanner endpoints limited to 10 requests per minute per IP address
- Prevents abuse and denial of service attacks

### 3. Error Handling

- Structured error responses
- Avoiding exposure of sensitive information in error messages
- Client-side input validation to provide immediate feedback

## Additional Recommendations

### 1. Server-Side Processing

Always process uploaded files on the server side. Never trust client-side validation alone.

```python
# Example of proper validation
def validate_image(file_data):
    # Validate MIME type
    if not file_data.content_type in ['image/jpeg', 'image/png', 'image/webp']:
        return False, "Invalid file type"
    
    # Validate file size
    if file_data.content_length > 5 * 1024 * 1024:  # 5MB limit
        return False, "File too large"
    
    # Validate image dimensions
    try:
        img = Image.open(file_data)
        if img.width > 4000 or img.height > 4000:
            return False, "Image dimensions too large"
    except Exception as e:
        return False, f"Invalid image: {str(e)}"
    
    return True, "Valid image"
```

### 2. Storage Considerations

- **Temporary Storage**: Delete uploaded files after processing
- **Isolation**: Store uploaded files in a separate directory with limited permissions
- **File Naming**: Use random names for stored files to prevent path traversal attacks

### 3. Scanning for Malicious Content

Consider implementing virus/malware scanning for uploaded files:

```python
# Example using ClamAV
import clamd

def scan_file(file_path):
    cd = clamd.ClamdUnixSocket()
    scan_result = cd.scan(file_path)
    if scan_result[file_path][0] == 'FOUND':
        return False, f"Malware detected: {scan_result[file_path][1]}"
    return True, "File clean"
```

### 4. Content Security Policy

Implement a Content Security Policy to mitigate the risk of XSS attacks through uploaded files:

```python
# Using Flask-Talisman
from flask_talisman import Talisman

Talisman(app, 
         content_security_policy={
             'default-src': "'self'",
             'img-src': ["'self'", 'data:', 'https://trusted-cdn.com'],
             'script-src': ["'self'", "'unsafe-inline'", 'https://trusted-cdn.com'],
         })
```

### 5. Authenticating File Access

- Require authentication for file uploads
- Validate user permissions before allowing uploads
- Generate signed URLs for file access with short expiration times

## References

- [OWASP File Upload Security Guide](https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload)
- [Flask File Upload Documentation](https://flask.palletsprojects.com/en/3.1.x/patterns/fileuploads/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) 