"""
Error Handling Utilities

This module provides standardized error handling for the NewVisionAI backend API.
It ensures consistent error responses, proper logging, and better debugging.
"""

import logging
import traceback
import functools
from flask import jsonify, current_app, request

# Configure logging
logger = logging.getLogger(__name__)

class APIError(Exception):
    """Base class for API errors with status code and message"""
    def __init__(self, message, status_code=400, extra_data=None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.extra_data = extra_data or {}

class ValidationError(APIError):
    """Error for input validation failures"""
    def __init__(self, message, extra_data=None):
        super().__init__(message, status_code=400, extra_data=extra_data)

class NotFoundError(APIError):
    """Error for resources not found"""
    def __init__(self, message, extra_data=None):
        super().__init__(message, status_code=404, extra_data=extra_data)

class AuthenticationError(APIError):
    """Error for authentication failures"""
    def __init__(self, message, extra_data=None):
        super().__init__(message, status_code=401, extra_data=extra_data)

class AuthorizationError(APIError):
    """Error for authorization failures"""
    def __init__(self, message, extra_data=None):
        super().__init__(message, status_code=403, extra_data=extra_data)

class AIProcessingError(APIError):
    """Error for AI processing failures"""
    def __init__(self, message, extra_data=None):
        super().__init__(message, status_code=500, extra_data=extra_data)

def setup_error_handlers(app):
    """
    Register error handlers with the Flask app.
    
    Args:
        app: Flask application instance
    """
    @app.errorhandler(APIError)
    def handle_api_error(error):
        response = {
            'error': True,
            'message': error.message,
            **error.extra_data
        }
        
        # Log the error
        log_level = logging.ERROR if error.status_code >= 500 else logging.WARNING
        logger.log(log_level, f"API Error ({error.status_code}): {error.message}")
        
        return jsonify(response), error.status_code
    
    @app.errorhandler(404)
    def handle_not_found(error):
        response = {
            'error': True,
            'message': 'The requested resource was not found.'
        }
        return jsonify(response), 404
    
    @app.errorhandler(405)
    def handle_method_not_allowed(error):
        response = {
            'error': True,
            'message': f'Method {request.method} is not allowed for this endpoint.'
        }
        return jsonify(response), 405
    
    @app.errorhandler(500)
    def handle_server_error(error):
        # Only include traceback in development mode
        extra_data = {}
        if app.config.get('DEBUG', False):
            extra_data['traceback'] = traceback.format_exc()
        
        response = {
            'error': True,
            'message': 'An unexpected server error occurred.',
            **extra_data
        }
        
        # Log the error
        logger.error(f"Server Error: {str(error)}\n{traceback.format_exc()}")
        
        return jsonify(response), 500

def api_route(route_function):
    """
    Decorator for API route functions that handles exceptions.
    
    Args:
        route_function: The route handler function to wrap
        
    Returns:
        Wrapped function with error handling
    """
    @functools.wraps(route_function)
    def wrapper(*args, **kwargs):
        try:
            return route_function(*args, **kwargs)
        except APIError as e:
            # These are already handled by the app's error handler
            raise
        except ValueError as e:
            # Convert ValueError to ValidationError
            raise ValidationError(str(e))
        except FileNotFoundError as e:
            # Convert FileNotFoundError to NotFoundError
            raise NotFoundError(str(e))
        except Exception as e:
            # Log unexpected errors
            logger.error(f"Unexpected error in {route_function.__name__}: {str(e)}\n{traceback.format_exc()}")
            
            # In development, include traceback
            extra_data = {}
            if current_app.config.get('DEBUG', False):
                extra_data['traceback'] = traceback.format_exc()
            
            raise APIError(
                message=f"An unexpected error occurred: {str(e)}",
                status_code=500,
                extra_data=extra_data
            )
    
    return wrapper 