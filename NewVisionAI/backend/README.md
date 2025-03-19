# NewVision AI Backend

This is the backend component of the NewVision AI project, a precision eyewear measurement system utilizing augmented reality and AI.

## Technologies Used

- **Python 3.9+**: Core programming language
- **Flask**: Web framework for building the API
- **SQLAlchemy**: ORM for database interactions
- **Flask-JWT-Extended**: JWT authentication
- **OpenCV**: Computer vision library for face detection and measurement
- **TensorFlow/Keras**: Machine learning framework for face analysis
- **MediaPipe**: Google's ML solutions for face mesh detection

## Project Structure

```
backend/
├── api/                 # API routes
│   ├── auth.py          # Authentication endpoints
│   ├── face_scanner.py  # Face scanning endpoints
│   ├── measurements.py  # Measurement management endpoints
│   ├── products.py      # Eyewear product endpoints
│   └── user.py          # User profile management endpoints
├── config/              # Configuration files
│   ├── config.py        # Main configuration
│   └── database.py      # Database configuration
├── models/              # Database models
│   ├── base.py          # Base model class
│   ├── measurement.py   # Measurement and FaceAnalysis models
│   ├── product.py       # Product and Order models
│   └── user.py          # User model
├── utils/               # Utility functions
│   ├── face_analysis.py # Face shape analysis tools
│   └── face_detection.py# Face detection and measurement tools
├── app.py               # Main application entry point
├── .env                 # Environment variables (not in version control)
├── .env.example         # Example environment variables
└── requirements.txt     # Python dependencies
```

## Getting Started

### Prerequisites

- Python 3.9 or higher
- pip (Python package manager)
- Virtual environment (recommended)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/NewVisionAI.git
   cd NewVisionAI/backend
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Copy environment variables and customize:
   ```
   cp .env.example .env
   ```

5. Initialize the database:
   ```
   flask db init
   flask db migrate -m "Initial migration"
   flask db upgrade
   ```

### Running the Application

To run the application in development mode:

```
flask run
```

The API will be available at `http://localhost:5000`.

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login user and get JWT tokens
- `POST /api/auth/logout`: Logout user (blacklist token)
- `POST /api/auth/refresh`: Refresh access token
- `GET /api/auth/me`: Get current user profile
- `PUT /api/auth/me`: Update current user profile

### Face Scanner Endpoints

- `POST /api/face-scanner/upload`: Upload face scan image
- `GET /api/face-scanner/process/<scan_id>`: Process an uploaded face scan
- `POST /api/face-scanner/analyze/<measurement_id>`: Analyze a measurement
- `GET /api/face-scanner/measurements`: Get all measurements for current user

### Measurements Endpoints

- `GET /api/measurements`: Get all measurements for current user
- `GET /api/measurements/<id>`: Get specific measurement
- `POST /api/measurements`: Create new measurement
- `PUT /api/measurements/<id>`: Update measurement
- `DELETE /api/measurements/<id>`: Delete measurement

### Products Endpoints

- `GET /api/products`: Get all products with filtering
- `GET /api/products/<id>`: Get specific product
- `GET /api/products/recommended`: Get recommended products
- `GET /api/products/search`: Search products

### User Endpoints

- `GET /api/user/profile`: Get user profile
- `PUT /api/user/profile`: Update user profile
- `POST /api/user/profile-picture`: Upload profile picture
- `GET /api/user/settings`: Get user settings
- `PUT /api/user/settings`: Update user settings

## Contributing

Please read [CONTRIBUTING.md](../CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details. 