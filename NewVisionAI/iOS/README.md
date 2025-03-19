# NewVision AI iOS App

The iOS mobile application for the NewVision AI platform - a precision eyewear measurement system utilizing augmented reality and AI.

## Features

- **Face Scanning**: Use AR technology to scan and measure your face
- **Eyewear Recommendations**: Get personalized eyewear recommendations based on your face shape and measurements
- **Virtual Try-On**: Try on glasses virtually before purchasing
- **Shopping**: Browse and purchase eyewear directly in the app
- **User Profiles**: Save your measurements, favorite products, and purchase history

## Technologies Used

- **Swift 5**: Core programming language
- **UIKit**: UI framework
- **ARKit**: Apple's augmented reality framework for face tracking
- **Vision**: Image analysis framework
- **SceneKit**: 3D rendering
- **CoreML**: Machine learning for face shape analysis

## Project Structure

```
ios/
├── NewVisionAI/              # Main application
│   ├── Controllers/          # View controllers
│   │   ├── MainTabBarController.swift   # Main tab navigation
│   │   ├── FaceScannerViewController.swift  # Face scanning UI
│   │   ├── ARFaceTrackingViewController.swift  # AR face tracking
│   │   └── MeasurementResultsViewController.swift  # Results display
│   ├── Models/               # Data models
│   │   ├── User.swift        # User model
│   │   ├── Product.swift     # Product model
│   │   └── FaceScanner.swift # Face scanning model
│   ├── Views/                # Custom views
│   ├── Services/             # Network and data services
│   │   └── APIService.swift  # API communication
│   ├── Utilities/            # Helper classes and extensions
│   └── Resources/            # Assets and resources
├── NewVisionAITests/         # Unit tests
└── NewVisionAIUITests/       # UI tests
```

## Requirements

- iOS 15.0+
- Xcode 13.0+
- Swift 5.5+
- Device with TrueDepth camera (for face tracking features)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/NewVisionAI.git
   cd NewVisionAI/ios
   ```

2. Open the project in Xcode:
   ```
   open NewVisionAI.xcodeproj
   ```

3. Configure API endpoints:
   - Open `Services/APIService.swift`
   - Update the `baseURL` to point to your backend server

4. Build and run the application in Xcode

## Configuration

### API Endpoints

The app connects to the NewVision AI backend API. Configure the base URL in `APIService.swift`:

```swift
private let baseURL = "https://api.newvisionai.com/v1"
```

For local development, you might want to use:

```swift
private let baseURL = "http://localhost:5000/api"
```

### Face Tracking

Face tracking features require a device with a TrueDepth camera (iPhone X or newer). The app will automatically check for face tracking compatibility and disable features if not supported.

## Key Components

### FaceScanner

The `FaceScanner` model handles the core functionality of face measurement and analysis:

- Capturing and processing face mesh data from ARKit
- Calculating pupillary distance, temple length, and other measurements
- Determining face shape and symmetry
- Generating eyewear recommendations

### AR Face Tracking

The `ARFaceTrackingViewController` manages the AR session for face tracking:

- Real-time face mesh visualization
- Guiding the user through the scanning process
- Collecting face data at optimal angles
- Processing results through the FaceScanner model

### Measurement Results

The `MeasurementResultsViewController` displays the results of the face scanning process:

- Visualizing the detected face shape
- Displaying detailed measurements
- Showing personalized eyewear recommendations
- Saving and sharing measurement results

## Contributing

Please read [CONTRIBUTING.md](../CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details. 