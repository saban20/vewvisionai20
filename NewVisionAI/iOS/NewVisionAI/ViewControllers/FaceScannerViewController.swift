import UIKit
import AVFoundation
import Vision
import ARKit

// MARK: - Measurement Data Structures
struct StandardizedMeasurements: Codable {
    var pupillaryDistance: Double
    var faceShape: String
    var measurements: AdditionalMeasurements
    
    init(pupillaryDistance: Double, faceShape: String, bridgeWidth: Double = 0, templeLength: Double = 0) {
        self.pupillaryDistance = pupillaryDistance
        self.faceShape = faceShape
        self.measurements = AdditionalMeasurements(bridgeWidth: bridgeWidth, templeLength: templeLength)
    }
}

struct AdditionalMeasurements: Codable {
    var bridgeWidth: Double
    var templeLength: Double
}

class FaceScannerViewController: UIViewController {
    
    // MARK: - Outlets
    @IBOutlet weak var previewView: UIView!
    @IBOutlet weak var scanButton: UIButton!
    @IBOutlet weak var activityIndicator: UIActivityIndicatorView!
    @IBOutlet weak var measurementsLabel: UILabel!
    @IBOutlet weak var sceneView: ARSCNView!
    
    // MARK: - Properties
    var captureSession: AVCaptureSession?
    var previewLayer: AVCaptureVideoPreviewLayer?
    var photoOutput: AVCapturePhotoOutput?
    var faceLayers: [CAShapeLayer] = []
    var isUsingARKit = false
    var faceTrackingSupported = false
    var lastMeasurement: StandardizedMeasurements?
    
    // MARK: - Delegates
    weak var measurementDelegate: MeasurementDelegate?
    
    // MARK: - View Lifecycle
    override func viewDidLoad() {
        super.viewDidLoad()
        
        setupUI()
        checkFaceTrackingSupport()
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        
        if isUsingARKit && faceTrackingSupported {
            startARSession()
        } else if let captureSession = captureSession, !captureSession.isRunning {
            DispatchQueue.global(qos: .userInitiated).async { [weak self] in
                self?.captureSession?.startRunning()
            }
        }
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        
        if isUsingARKit {
            sceneView.session.pause()
        } else if let captureSession = captureSession, captureSession.isRunning {
            captureSession.stopRunning()
        }
    }
    
    // MARK: - UI Setup
    private func setupUI() {
        title = "Face Scanner"
        scanButton.layer.cornerRadius = 8
        scanButton.isEnabled = false
        activityIndicator.hidesWhenStopped = true
        measurementsLabel.text = "Position your face in the frame"
        
        // Setup scene view if using ARKit
        if sceneView != nil {
            sceneView.delegate = self
            sceneView.automaticallyUpdatesLighting = true
        }
    }
    
    // MARK: - ARKit Support
    private func checkFaceTrackingSupport() {
        // Check if device supports face tracking
        faceTrackingSupported = ARFaceTrackingConfiguration.isSupported
        
        if faceTrackingSupported && sceneView != nil {
            isUsingARKit = true
            scanButton.isEnabled = true
            measurementsLabel.text = "ARKit face tracking ready"
        } else {
            isUsingARKit = false
            checkCameraPermission()
        }
    }
    
    private func startARSession() {
        guard ARFaceTrackingConfiguration.isSupported else {
            showAlert(title: "Face Tracking Not Supported", message: "This device doesn't support ARKit face tracking. Using standard camera instead.")
            isUsingARKit = false
            checkCameraPermission()
            return
        }
        
        // Configure ARKit for face tracking
        let configuration = ARFaceTrackingConfiguration()
        sceneView.session.run(configuration, options: [.resetTracking, .removeExistingAnchors])
    }
    
    // MARK: - Camera Setup
    private func checkCameraPermission() {
        switch AVCaptureDevice.authorizationStatus(for: .video) {
        case .authorized:
            setupCaptureSession()
        case .notDetermined:
            AVCaptureDevice.requestAccess(for: .video) { [weak self] granted in
                if granted {
                    DispatchQueue.main.async {
                        self?.setupCaptureSession()
                    }
                }
            }
        case .denied, .restricted:
            showCameraPermissionAlert()
        @unknown default:
            break
        }
    }
    
    private func setupCaptureSession() {
        captureSession = AVCaptureSession()
        
        guard let captureSession = captureSession,
              let frontCamera = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .front) else {
            showAlert(title: "Camera Error", message: "Unable to access front camera")
            return
        }
        
        do {
            let input = try AVCaptureDeviceInput(device: frontCamera)
            if captureSession.canAddInput(input) {
                captureSession.addInput(input)
            }
            
            photoOutput = AVCapturePhotoOutput()
            if let photoOutput = photoOutput, captureSession.canAddOutput(photoOutput) {
                captureSession.addOutput(photoOutput)
                
                // Setup video preview layer
                previewLayer = AVCaptureVideoPreviewLayer(session: captureSession)
                previewLayer?.videoGravity = .resizeAspectFill
                
                DispatchQueue.main.async { [weak self] in
                    guard let self = self else { return }
                    self.previewLayer?.frame = self.previewView.bounds
                    if let previewLayer = self.previewLayer {
                        self.previewView.layer.addSublayer(previewLayer)
                    }
                    
                    // Enable scan button once camera is ready
                    self.scanButton.isEnabled = true
                    
                    // Start capture session
                    DispatchQueue.global(qos: .userInitiated).async {
                        captureSession.startRunning()
                    }
                }
            }
        } catch {
            showAlert(title: "Camera Error", message: "Unable to setup camera: \(error.localizedDescription)")
        }
    }
    
    private func showCameraPermissionAlert() {
        let alert = UIAlertController(
            title: "Camera Access Required",
            message: "This app needs camera access to scan your face. Please allow camera access in Settings.",
            preferredStyle: .alert
        )
        
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        alert.addAction(UIAlertAction(title: "Settings", style: .default) { _ in
            if let url = URL(string: UIApplication.openSettingsURLString) {
                UIApplication.shared.open(url)
            }
        })
        
        present(alert, animated: true)
    }
    
    // MARK: - Actions
    @IBAction func scanButtonTapped(_ sender: UIButton) {
        if isUsingARKit {
            scanWithARKit()
        } else {
            scanWithCamera()
        }
    }
    
    private func scanWithARKit() {
        guard ARFaceTrackingConfiguration.isSupported else {
            showAlert(title: "Error", message: "ARKit isn't configured for face tracking on this device.")
            return
        }
        
        // Disable button and show loading indicator
        scanButton.isEnabled = false
        activityIndicator.startAnimating()
        
        // Capture current frame from ARKit session
        guard let currentFrame = sceneView.session.currentFrame else {
            handleScanError(NSError(domain: "FaceScanner", code: 4, userInfo: [NSLocalizedDescriptionKey: "Could not get current AR frame"]))
            return
        }
        
        // Check if face anchor is available
        guard let faceAnchor = sceneView.session.currentFrame?.anchors.compactMap({ $0 as? ARFaceAnchor }).first else {
            handleScanError(NSError(domain: "FaceScanner", code: 5, userInfo: [NSLocalizedDescriptionKey: "No face detected in AR session"]))
            return
        }
        
        // Calculate face measurements from face anchor
        calculateARKitMeasurements(from: faceAnchor)
    }
    
    private func scanWithCamera() {
        guard let captureSession = captureSession, captureSession.isRunning else {
            print("Capture session not running")
            return
        }
        
        // Disable button and show loading indicator
        scanButton.isEnabled = false
        activityIndicator.startAnimating()
        
        // Capture photo
        let settings = AVCapturePhotoSettings()
        photoOutput?.capturePhoto(with: settings, delegate: self)
    }
    
    // MARK: - ARKit Measurements
    private func calculateARKitMeasurements(from faceAnchor: ARFaceAnchor) {
        // Get facial features in 3D space
        let leftEyePosition = faceAnchor.transform.columns.3 + simd_make_float4(faceAnchor.leftEyeTransform.columns.3.x, faceAnchor.leftEyeTransform.columns.3.y, faceAnchor.leftEyeTransform.columns.3.z, 0)
        let rightEyePosition = faceAnchor.transform.columns.3 + simd_make_float4(faceAnchor.rightEyeTransform.columns.3.x, faceAnchor.rightEyeTransform.columns.3.y, faceAnchor.rightEyeTransform.columns.3.z, 0)
        
        // Calculate pupillary distance in 3D space
        let distanceInMeters = distance(leftEyePosition, rightEyePosition)
        let pupillaryDistance = Double(distanceInMeters * 1000) // Convert to mm
        
        // Calculate bridge width (approximate)
        let bridgeWidth = Double(faceAnchor.leftEyeTransform.columns.3.x - faceAnchor.rightEyeTransform.columns.3.x) * 500
        
        // Calculate temple length (approximate)
        let templeLength = Double(140) // Default value for now
        
        // Determine face shape from geometry
        let faceShape = determineFaceShapeFromARKit(faceAnchor: faceAnchor)
        
        // Create standardized measurement structure
        let measurements = StandardizedMeasurements(
            pupillaryDistance: pupillaryDistance,
            faceShape: faceShape,
            bridgeWidth: abs(bridgeWidth),
            templeLength: templeLength
        )
        
        DispatchQueue.main.async { [weak self] in
            self?.displayAndShareMeasurements(measurements)
        }
    }
    
    private func determineFaceShapeFromARKit(faceAnchor: ARFaceAnchor) -> String {
        // Get face mesh vertices
        let faceGeometry = faceAnchor.geometry
        let vertices = faceGeometry.vertices
        
        // Calculate face width to height ratio to determine shape
        var minX: Float = .infinity
        var maxX: Float = -.infinity
        var minY: Float = .infinity
        var maxY: Float = -.infinity
        
        for i in 0..<faceGeometry.vertexCount {
            let vertex = vertices[i]
            minX = min(minX, vertex.x)
            maxX = max(maxX, vertex.x)
            minY = min(minY, vertex.y)
            maxY = max(maxY, vertex.y)
        }
        
        let width = maxX - minX
        let height = maxY - minY
        let ratio = width / height
        
        // Determine face shape based on ratio and other characteristics
        if ratio > 0.85 && ratio < 1.15 {
            return "round"
        } else if ratio <= 0.85 {
            return "oval"
        } else if width > 0.15 {
            return "square"
        } else {
            // Check for jawline width vs forehead width for heart or diamond shape
            return "oval" // Default shape
        }
    }
    
    private func distance(_ v1: simd_float4, _ v2: simd_float4) -> Float {
        let dx = v2.x - v1.x
        let dy = v2.y - v1.y
        let dz = v2.z - v1.z
        return sqrt(dx*dx + dy*dy + dz*dz)
    }
    
    // MARK: - Helper Methods
    private func processFaceScan(image: UIImage) {
        // Create face detection request
        let faceDetectionRequest = VNDetectFaceLandmarksRequest { [weak self] request, error in
            if let error = error {
                DispatchQueue.main.async {
                    self?.handleScanError(error)
                }
                return
            }
            
            guard let observations = request.results as? [VNFaceObservation], !observations.isEmpty else {
                DispatchQueue.main.async {
                    self?.handleScanError(NSError(domain: "FaceScanner", code: 1, userInfo: [NSLocalizedDescriptionKey: "No face detected"]))
                }
                return
            }
            
            // Process detected face and calculate measurements
            self?.calculateMeasurements(from: observations.first!, originalImage: image)
        }
        
        // Perform face detection
        let handler = VNImageRequestHandler(cgImage: image.cgImage!, options: [:])
        DispatchQueue.global(qos: .userInitiated).async {
            do {
                try handler.perform([faceDetectionRequest])
            } catch {
                DispatchQueue.main.async { [weak self] in
                    self?.handleScanError(error)
                }
            }
        }
    }
    
    private func calculateMeasurements(from faceObservation: VNFaceObservation, originalImage: UIImage) {
        guard let landmarks = faceObservation.landmarks else {
            handleScanError(NSError(domain: "FaceScanner", code: 2, userInfo: [NSLocalizedDescriptionKey: "No landmarks detected"]))
            return
        }
        
        // Calculate pupillary distance
        var pupillaryDistance: Double = 0
        if let leftEye = landmarks.leftEye, let rightEye = landmarks.rightEye {
            let leftEyeCenter = calculateEyeCenter(leftEye.normalizedPoints)
            let rightEyeCenter = calculateEyeCenter(rightEye.normalizedPoints)
            
            // Calculate pixel distance between eye centers
            let pixelDistance = calculateDistance(leftEyeCenter, rightEyeCenter, 
                                                 imageSize: originalImage.size, 
                                                 boundingBox: faceObservation.boundingBox)
            
            // Convert to millimeters (approximate conversion based on average face width)
            pupillaryDistance = Double(pixelDistance * 16) // Rough estimation
        }
        
        // Calculate bridge width
        var bridgeWidth: Double = 0
        if let nose = landmarks.nose {
            // Simple heuristic for bridge width based on nose width
            let nosePoints = nose.normalizedPoints
            let leftNoseBridge = nosePoints.first { $0.x < 0.5 && $0.y > 0.5 } ?? CGPoint(x: 0.45, y: 0.6)
            let rightNoseBridge = nosePoints.first { $0.x > 0.5 && $0.y > 0.5 } ?? CGPoint(x: 0.55, y: 0.6)
            
            let noseWidth = calculateDistance(leftNoseBridge, rightNoseBridge,
                                            imageSize: originalImage.size,
                                            boundingBox: faceObservation.boundingBox)
            
            bridgeWidth = Double(noseWidth * 8) // Approximate conversion
        }
        
        // Calculate temple length based on face width
        let faceWidth = Double(faceObservation.boundingBox.width * originalImage.size.width)
        let templeLength = faceWidth * 0.7 // Approximation
        
        // Determine face shape from facial landmarks
        let faceShape = determineFaceShapeFromVision(observation: faceObservation, landmarks: landmarks)
        
        // Create standardized measurement structure
        let measurements = StandardizedMeasurements(
            pupillaryDistance: pupillaryDistance,
            faceShape: faceShape,
            bridgeWidth: bridgeWidth,
            templeLength: templeLength
        )
        
        DispatchQueue.main.async { [weak self] in
            self?.displayAndShareMeasurements(measurements)
        }
    }
    
    private func determineFaceShapeFromVision(observation: VNFaceObservation, landmarks: VNFaceLandmarks2D) -> String {
        // Determine face shape based on ratios and contours
        let boundingBox = observation.boundingBox
        let faceRatio = boundingBox.width / boundingBox.height
        
        // Simple determination based on width/height ratio
        if faceRatio > 0.85 && faceRatio < 1.15 {
            return "round"
        } else if faceRatio <= 0.85 {
            return "oval"
        } else if faceRatio >= 1.15 {
            // Check for jawline and forehead width - if similar, it's square
            // If forehead is wider, it's heart
            return "square"
        }
        
        return "oval" // Default shape
    }
    
    private func calculateEyeCenter(_ points: [CGPoint]) -> CGPoint {
        let sumX = points.reduce(0) { $0 + $1.x }
        let sumY = points.reduce(0) { $0 + $1.y }
        return CGPoint(x: sumX / CGFloat(points.count), y: sumY / CGFloat(points.count))
    }
    
    private func calculateDistance(_ point1: CGPoint, _ point2: CGPoint, imageSize: CGSize, boundingBox: CGRect) -> CGFloat {
        // Convert normalized points to image coordinates
        let p1 = CGPoint(
            x: point1.x * boundingBox.width * imageSize.width + boundingBox.minX * imageSize.width,
            y: (1 - point1.y) * boundingBox.height * imageSize.height + (1 - boundingBox.minY - boundingBox.height) * imageSize.height
        )
        
        let p2 = CGPoint(
            x: point2.x * boundingBox.width * imageSize.width + boundingBox.minX * imageSize.width,
            y: (1 - point2.y) * boundingBox.height * imageSize.height + (1 - boundingBox.minY - boundingBox.height) * imageSize.height
        )
        
        // Calculate Euclidean distance
        return sqrt(pow(p2.x - p1.x, 2) + pow(p2.y - p1.y, 2))
    }
    
    private func displayAndShareMeasurements(_ measurements: StandardizedMeasurements) {
        // Reset UI
        activityIndicator.stopAnimating()
        scanButton.isEnabled = true
        
        // Save the measurement
        self.lastMeasurement = measurements
        
        // Display measurements in the UI
        measurementsLabel.text = "PD: \(Int(measurements.pupillaryDistance)) mm\nShape: \(measurements.faceShape)"
        
        // Share the measurements via delegate
        measurementDelegate?.didCaptureMeasurements(measurements)
        
        // Upload measurements to API or cloud
        uploadMeasurements(measurements)
    }
    
    private func uploadMeasurements(_ measurements: StandardizedMeasurements) {
        // Convert to JSON
        guard let jsonData = try? JSONEncoder().encode(measurements) else {
            print("Failed to encode measurements")
            return
        }
        
        // Print JSON for debugging
        if let jsonString = String(data: jsonData, encoding: .utf8) {
            print("Sending measurements: \(jsonString)")
        }
        
        // Create API request
        guard let url = URL(string: "https://api.newvisionai.com/measurements") else { return }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = jsonData
        
        // Send the request (commented out for now - uncomment when API is ready)
        /*
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                print("Error uploading measurements: \(error)")
                return
            }
            
            if let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 {
                print("Measurements uploaded successfully")
            } else {
                print("Failed to upload measurements")
            }
        }.resume()
        */
    }
    
    private func handleScanError(_ error: Error) {
        activityIndicator.stopAnimating()
        scanButton.isEnabled = true
        measurementsLabel.text = "Scan failed. Please try again."
        showAlert(title: "Scan Error", message: error.localizedDescription)
    }
    
    private func showAlert(title: String, message: String) {
        let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
}

// MARK: - Measurement Delegate Protocol
protocol MeasurementDelegate: AnyObject {
    func didCaptureMeasurements(_ measurements: StandardizedMeasurements)
}

// MARK: - AVCapturePhotoCaptureDelegate
extension FaceScannerViewController: AVCapturePhotoCaptureDelegate {
    func photoOutput(_ output: AVCapturePhotoOutput, didFinishProcessingPhoto photo: AVCapturePhoto, error: Error?) {
        if let error = error {
            handleScanError(error)
            return
        }
        
        guard let imageData = photo.fileDataRepresentation(),
              let image = UIImage(data: imageData) else {
            handleScanError(NSError(domain: "FaceScanner", code: 3, userInfo: [NSLocalizedDescriptionKey: "Failed to process photo"]))
            return
        }
        
        // Process the captured image for face detection
        processFaceScan(image: image)
    }
}

// MARK: - ARSCNViewDelegate
extension FaceScannerViewController: ARSCNViewDelegate {
    func renderer(_ renderer: SCNSceneRenderer, didUpdate node: SCNNode, for anchor: ARAnchor) {
        guard let faceAnchor = anchor as? ARFaceAnchor else { return }
        
        // Real-time update of the face tracking
        // This can be used to show face tracking feedback before capturing measurements
        DispatchQueue.main.async { [weak self] in
            if self?.activityIndicator.isAnimating == false {
                self?.measurementsLabel.text = "Face detected. Press Scan when ready."
            }
        }
    }
    
    func session(_ session: ARSession, didFailWithError error: Error) {
        handleScanError(error)
    }
    
    func sessionWasInterrupted(_ session: ARSession) {
        measurementsLabel.text = "AR Session interrupted"
    }
    
    func sessionInterruptionEnded(_ session: ARSession) {
        measurementsLabel.text = "Position your face in the frame"
        startARSession()
    }
} 