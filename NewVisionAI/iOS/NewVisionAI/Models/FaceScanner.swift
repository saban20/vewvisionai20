import UIKit
import ARKit
import Vision
import CoreImage

// MARK: - MeasurementResult
struct MeasurementResult: Codable {
    var pupillaryDistance: Float?
    var templeLength: Float?
    var bridgeWidth: Float?
    var lensWidth: Float?
    var lensHeight: Float?
    var frameWidth: Float?
    var faceWidth: Float?
    var faceHeight: Float?
    var scanDataURL: String?
    var notes: String?
    var createdAt: Date
    
    init(pupillaryDistance: Float? = nil,
         templeLength: Float? = nil,
         bridgeWidth: Float? = nil,
         lensWidth: Float? = nil,
         lensHeight: Float? = nil,
         frameWidth: Float? = nil,
         faceWidth: Float? = nil,
         faceHeight: Float? = nil,
         scanDataURL: String? = nil,
         notes: String? = nil) {
        self.pupillaryDistance = pupillaryDistance
        self.templeLength = templeLength
        self.bridgeWidth = bridgeWidth
        self.lensWidth = lensWidth
        self.lensHeight = lensHeight
        self.frameWidth = frameWidth
        self.faceWidth = faceWidth
        self.faceHeight = faceHeight
        self.scanDataURL = scanDataURL
        self.notes = notes
        self.createdAt = Date()
    }
    
    var dictionary: [String: Any] {
        var dict: [String: Any] = [
            "created_at": createdAt
        ]
        
        if let pd = pupillaryDistance { dict["pupillary_distance"] = pd }
        if let tl = templeLength { dict["temple_length"] = tl }
        if let bw = bridgeWidth { dict["bridge_width"] = bw }
        if let lw = lensWidth { dict["lens_width"] = lw }
        if let lh = lensHeight { dict["lens_height"] = lh }
        if let fw = frameWidth { dict["frame_width"] = fw }
        if let facew = faceWidth { dict["face_width"] = facew }
        if let faceh = faceHeight { dict["face_height"] = faceh }
        if let url = scanDataURL { dict["scan_data_url"] = url }
        if let n = notes { dict["notes"] = n }
        
        return dict
    }
}

// MARK: - FaceAnalysisResult
struct FaceAnalysisResult: Codable {
    var faceShape: String?
    var faceSymmetry: Float?
    var skinTone: String?
    var recommendedStyles: [String]?
    var recommendedColors: [String]?
    var confidenceScore: Float?
    
    init(faceShape: String? = nil,
         faceSymmetry: Float? = nil,
         skinTone: String? = nil,
         recommendedStyles: [String]? = nil,
         recommendedColors: [String]? = nil,
         confidenceScore: Float? = nil) {
        self.faceShape = faceShape
        self.faceSymmetry = faceSymmetry
        self.skinTone = skinTone
        self.recommendedStyles = recommendedStyles
        self.recommendedColors = recommendedColors
        self.confidenceScore = confidenceScore
    }
}

// MARK: - FaceScannerDelegate
protocol FaceScannerDelegate: AnyObject {
    func faceScannerDidDetectFace()
    func faceScannerDidCompleteMeasurements(_ measurements: MeasurementResult)
    func faceScannerDidFailWithError(_ error: Error)
}

// MARK: - FaceScanner
class FaceScanner: NSObject {
    
    // MARK: - Properties
    weak var delegate: FaceScannerDelegate?
    private var arSession: ARSession?
    private var faceTrackingConfiguration: ARFaceTrackingConfiguration?
    private var isScanning = false
    private var capturedFrames: [ARFrame] = []
    private var measurementResult: MeasurementResult?
    
    // MARK: - Constants
    private let minRequiredFrames = 30
    private let maxCapturedFrames = 60
    
    // MARK: - Key Face Landmarks
    private let leftEyeOuterIndex = 33
    private let leftEyeInnerIndex = 133
    private let rightEyeInnerIndex = 362
    private let rightEyeOuterIndex = 263
    private let noseTipIndex = 4
    private let chinBottomIndex = 152
    private let leftTempleIndex = 54
    private let rightTempleIndex = 284
    private let leftCheekIndex = 206
    private let rightCheekIndex = 426
    private let leftEyebrowIndex = 105
    private let rightEyebrowIndex = 334
    private let topSkullIndex = 10
    private let foreheadCenterIndex = 151
    
    // MARK: - Initialization
    
    override init() {
        super.init()
        setupARSession()
    }
    
    // MARK: - Public Methods
    
    func startScanning() {
        guard !isScanning else { return }
        guard ARFaceTrackingConfiguration.isSupported else {
            delegate?.faceScannerDidFailWithError(FaceScannerError.deviceNotSupported)
            return
        }
        
        capturedFrames.removeAll()
        measurementResult = nil
        isScanning = true
        arSession?.run(faceTrackingConfiguration!)
    }
    
    func stopScanning() {
        guard isScanning else { return }
        isScanning = false
        arSession?.pause()
        
        processCapturedFrames()
    }
    
    func processStaticImage(_ image: UIImage) {
        // Process a static image (from photo library)
        guard let cgImage = image.cgImage else {
            delegate?.faceScannerDidFailWithError(FaceScannerError.invalidImage)
            return
        }
        
        let requestHandler = VNImageRequestHandler(cgImage: cgImage, options: [:])
        let faceDetectionRequest = VNDetectFaceLandmarksRequest { [weak self] request, error in
            guard let self = self else { return }
            
            if let error = error {
                self.delegate?.faceScannerDidFailWithError(error)
                return
            }
            
            guard let observations = request.results as? [VNFaceObservation], !observations.isEmpty else {
                self.delegate?.faceScannerDidFailWithError(FaceScannerError.noFaceDetected)
                return
            }
            
            // Process first face observation
            if let faceObservation = observations.first, let landmarks = faceObservation.landmarks {
                self.delegate?.faceScannerDidDetectFace()
                let measurements = self.extractMeasurementsFromVisionLandmarks(landmarks, imageSize: image.size)
                self.delegate?.faceScannerDidCompleteMeasurements(measurements)
            } else {
                self.delegate?.faceScannerDidFailWithError(FaceScannerError.landmarksNotFound)
            }
        }
        
        do {
            try requestHandler.perform([faceDetectionRequest])
        } catch {
            delegate?.faceScannerDidFailWithError(error)
        }
    }
    
    // MARK: - Private Methods
    
    private func setupARSession() {
        arSession = ARSession()
        arSession?.delegate = self
        
        guard ARFaceTrackingConfiguration.isSupported else {
            print("Face tracking not supported on this device")
            return
        }
        
        faceTrackingConfiguration = ARFaceTrackingConfiguration()
        faceTrackingConfiguration?.maximumNumberOfTrackedFaces = 1
    }
    
    private func processCapturedFrames() {
        guard !capturedFrames.isEmpty else {
            delegate?.faceScannerDidFailWithError(FaceScannerError.insufficientData)
            return
        }
        
        // Analyze captured frames to get stable measurements
        var measurements = MeasurementResult()
        
        // Use median values from captured frames for stability
        let stableFrames = capturedFrames.suffix(min(capturedFrames.count, maxCapturedFrames))
        
        var pdValues: [Float] = []
        var templeValues: [Float] = []
        var bridgeValues: [Float] = []
        var lensWidthValues: [Float] = []
        var lensHeightValues: [Float] = []
        var frameWidthValues: [Float] = []
        var faceWidthValues: [Float] = []
        var faceHeightValues: [Float] = []
        
        for frame in stableFrames {
            if let face = frame.anchors.compactMap({ $0 as? ARFaceAnchor }).first {
                let geometry = face.geometry
                
                // Extract and store measurements from each frame
                let (pd, temple, bridge, lensWidth, lensHeight, frameWidth, faceWidth, faceHeight) = extractMeasurementsFromFaceGeometry(geometry, transform: face.transform)
                
                if let pd = pd { pdValues.append(pd) }
                if let temple = temple { templeValues.append(temple) }
                if let bridge = bridge { bridgeValues.append(bridge) }
                if let lensWidth = lensWidth { lensWidthValues.append(lensWidth) }
                if let lensHeight = lensHeight { lensHeightValues.append(lensHeight) }
                if let frameWidth = frameWidth { frameWidthValues.append(frameWidth) }
                if let faceWidth = faceWidth { faceWidthValues.append(faceWidth) }
                if let faceHeight = faceHeight { faceHeightValues.append(faceHeight) }
            }
        }
        
        // Calculate median values for stability
        measurements.pupillaryDistance = calculateMedian(pdValues)
        measurements.templeLength = calculateMedian(templeValues)
        measurements.bridgeWidth = calculateMedian(bridgeValues)
        measurements.lensWidth = calculateMedian(lensWidthValues)
        measurements.lensHeight = calculateMedian(lensHeightValues)
        measurements.frameWidth = calculateMedian(frameWidthValues)
        measurements.faceWidth = calculateMedian(faceWidthValues)
        measurements.faceHeight = calculateMedian(faceHeightValues)
        
        // Save scan data if available
        if let lastFrame = capturedFrames.last, let pixelBuffer = lastFrame.capturedImage {
            let ciImage = CIImage(cvPixelBuffer: pixelBuffer)
            let context = CIContext()
            if let cgImage = context.createCGImage(ciImage, from: ciImage.extent) {
                let uiImage = UIImage(cgImage: cgImage)
                measurements.scanDataURL = saveScanImage(uiImage)
            }
        }
        
        measurements.notes = "Captured via AR face scanning"
        
        // Notify delegate
        delegate?.faceScannerDidCompleteMeasurements(measurements)
    }
    
    private func extractMeasurementsFromFaceGeometry(_ geometry: ARFaceGeometry, transform: simd_float4x4) -> (Float?, Float?, Float?, Float?, Float?, Float?, Float?, Float?) {
        let vertices = geometry.vertices
        
        // Get specific vertices for key measurements
        guard vertices.count > max(leftEyeOuterIndex, leftEyeInnerIndex, rightEyeInnerIndex, rightEyeOuterIndex,
                                   noseTipIndex, chinBottomIndex, leftTempleIndex, rightTempleIndex,
                                   leftCheekIndex, rightCheekIndex, leftEyebrowIndex, rightEyebrowIndex,
                                   topSkullIndex, foreheadCenterIndex) else {
            return (nil, nil, nil, nil, nil, nil, nil, nil)
        }
        
        let leftEyeOuter = vertices[leftEyeOuterIndex]
        let leftEyeInner = vertices[leftEyeInnerIndex]
        let rightEyeInner = vertices[rightEyeInnerIndex]
        let rightEyeOuter = vertices[rightEyeOuterIndex]
        let noseTip = vertices[noseTipIndex]
        let chinBottom = vertices[chinBottomIndex]
        let leftTemple = vertices[leftTempleIndex]
        let rightTemple = vertices[rightTempleIndex]
        let leftEyebrow = vertices[leftEyebrowIndex]
        let rightEyebrow = vertices[rightEyebrowIndex]
        let leftCheek = vertices[leftCheekIndex]
        let rightCheek = vertices[rightCheekIndex]
        
        // Convert measurements from model space to real-world measurements (in mm)
        // Note: These are approximate and would need calibration in a real app
        
        // Pupillary distance (PD) - distance between pupils
        let pupillaryDistance = distance(leftEyeInner, rightEyeInner) * 1000 * 2.54 // Convert to mm
        
        // Bridge width - distance between inner eyes
        let bridgeWidth = distance(leftEyeInner, rightEyeInner) * 1000 * 1.2 // Convert to mm
        
        // Temple length - from eye outer to ear (approximate)
        let leftTempleLength = distance(leftEyeOuter, leftTemple) * 1000 * 3.5 // Convert to mm
        let rightTempleLength = distance(rightEyeOuter, rightTemple) * 1000 * 3.5 // Convert to mm
        let templeLength = (leftTempleLength + rightTempleLength) / 2
        
        // Lens width - distance from inner to outer eye
        let leftLensWidth = distance(leftEyeInner, leftEyeOuter) * 1000 * 1.8 // Convert to mm
        let rightLensWidth = distance(rightEyeInner, rightEyeOuter) * 1000 * 1.8 // Convert to mm
        let lensWidth = (leftLensWidth + rightLensWidth) / 2
        
        // Lens height - distance from eyebrow to cheek (approximate)
        let leftLensHeight = distance(leftEyebrow, leftCheek) * 1000 * 0.7 // Convert to mm
        let rightLensHeight = distance(rightEyebrow, rightCheek) * 1000 * 0.7 // Convert to mm
        let lensHeight = (leftLensHeight + rightLensHeight) / 2
        
        // Frame width - temple to temple
        let frameWidth = distance(leftTemple, rightTemple) * 1000 * 0.95 // Convert to mm
        
        // Face width - temple to temple
        let faceWidth = distance(leftTemple, rightTemple) * 1000 // Convert to mm
        
        // Face height - chin to forehead
        let faceHeight = distance(chinBottom, vertices[foreheadCenterIndex]) * 1000 // Convert to mm
        
        return (pupillaryDistance, templeLength, bridgeWidth, lensWidth, lensHeight, frameWidth, faceWidth, faceHeight)
    }
    
    private func extractMeasurementsFromVisionLandmarks(_ landmarks: VNFaceLandmarks2D, imageSize: CGSize) -> MeasurementResult {
        var measurements = MeasurementResult()
        
        // Get landmarks from Vision
        guard let leftEye = landmarks.leftEye,
              let rightEye = landmarks.rightEye,
              let leftEyebrow = landmarks.leftEyebrow,
              let rightEyebrow = landmarks.rightEyebrow,
              let nose = landmarks.nose,
              let outerLips = landmarks.outerLips else {
            return measurements
        }
        
        // Calculate scale factor to convert normalized points to real-world measurements
        // For a typical face, the distance between the eyes is about 63mm
        let averageIPD = 63.0 // mm
        
        // Get eye positions
        let leftEyePoints = leftEye.normalizedPoints.map { CGPoint(x: $0.x * imageSize.width, y: $0.y * imageSize.height) }
        let rightEyePoints = rightEye.normalizedPoints.map { CGPoint(x: $0.x * imageSize.width, y: $0.y * imageSize.height) }
        
        // Get eye centers
        guard let leftEyeCenter = averagePoint(leftEyePoints),
              let rightEyeCenter = averagePoint(rightEyePoints) else {
            return measurements
        }
        
        // Calculate pupillary distance in pixels
        let pdPixels = distance(leftEyeCenter, rightEyeCenter)
        
        // Calculate scale factor
        let scaleFactor = averageIPD / Float(pdPixels)
        
        // Set measurements
        measurements.pupillaryDistance = Float(pdPixels) * scaleFactor
        
        // Calculate bridge width (inner eye distance)
        if leftEyePoints.count >= 2 && rightEyePoints.count >= 2 {
            let leftInnerPoint = leftEyePoints[leftEyePoints.count / 2]
            let rightInnerPoint = rightEyePoints[rightEyePoints.count / 2]
            let bridgeWidthPixels = distance(leftInnerPoint, rightInnerPoint)
            measurements.bridgeWidth = Float(bridgeWidthPixels) * scaleFactor
        }
        
        // Approximate face width
        if leftEyePoints.count > 0 && rightEyePoints.count > 0 {
            let leftOuterPoint = leftEyePoints[0]
            let rightOuterPoint = rightEyePoints[rightEyePoints.count - 1]
            let faceWidthPixels = distance(leftOuterPoint, rightOuterPoint) * 1.5
            measurements.faceWidth = Float(faceWidthPixels) * scaleFactor
            
            // Approximate frame width
            measurements.frameWidth = Float(faceWidthPixels) * scaleFactor * 0.9
        }
        
        // Approximate face height
        if let nosePoint = averagePoint(nose.normalizedPoints.map { CGPoint(x: $0.x * imageSize.width, y: $0.y * imageSize.height) }),
           let chinPoint = averagePoint(outerLips.normalizedPoints.map { CGPoint(x: $0.x * imageSize.width, y: $0.y * imageSize.height) }) {
            let faceHeightPixels = distance(chinPoint, nosePoint) * 2.5
            measurements.faceHeight = Float(faceHeightPixels) * scaleFactor
        }
        
        // Approximate lens dimensions
        if let leftEyebrowPoint = averagePoint(leftEyebrow.normalizedPoints.map { CGPoint(x: $0.x * imageSize.width, y: $0.y * imageSize.height) }),
           let rightEyebrowPoint = averagePoint(rightEyebrow.normalizedPoints.map { CGPoint(x: $0.x * imageSize.width, y: $0.y * imageSize.height) }) {
            
            let leftLensHeightPixels = distance(leftEyebrowPoint, leftEyeCenter) * 1.8
            let rightLensHeightPixels = distance(rightEyebrowPoint, rightEyeCenter) * 1.8
            
            measurements.lensHeight = Float((leftLensHeightPixels + rightLensHeightPixels) / 2) * scaleFactor
            
            if leftEyePoints.count >= 2 && rightEyePoints.count >= 2 {
                let leftOuterPoint = leftEyePoints[0]
                let leftInnerPoint = leftEyePoints[leftEyePoints.count - 1]
                let rightInnerPoint = rightEyePoints[0]
                let rightOuterPoint = rightEyePoints[rightEyePoints.count - 1]
                
                let leftLensWidthPixels = distance(leftInnerPoint, leftOuterPoint) * 1.2
                let rightLensWidthPixels = distance(rightInnerPoint, rightOuterPoint) * 1.2
                
                measurements.lensWidth = Float((leftLensWidthPixels + rightLensWidthPixels) / 2) * scaleFactor
            }
        }
        
        // Approximate temple length
        measurements.templeLength = measurements.frameWidth?.map { $0 * 0.6 }
        
        measurements.notes = "Captured from static image"
        
        return measurements
    }
    
    private func saveScanImage(_ image: UIImage) -> String? {
        let documentsDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
        let fileName = "face_scan_\(Date().timeIntervalSince1970).jpg"
        let fileURL = documentsDirectory.appendingPathComponent(fileName)
        
        if let data = image.jpegData(compressionQuality: 0.8) {
            do {
                try data.write(to: fileURL)
                return fileURL.path
            } catch {
                print("Error saving image: \(error)")
                return nil
            }
        }
        
        return nil
    }
    
    private func calculateMedian<T: Comparable>(_ values: [T]) -> T? {
        guard !values.isEmpty else { return nil }
        
        let sorted = values.sorted()
        let middle = sorted.count / 2
        
        if sorted.count % 2 == 0 {
            return sorted[middle - 1]
        } else {
            return sorted[middle]
        }
    }
    
    private func distance(_ v1: simd_float3, _ v2: simd_float3) -> Float {
        return simd_distance(v1, v2)
    }
    
    private func distance(_ p1: CGPoint, _ p2: CGPoint) -> CGFloat {
        return sqrt(pow(p2.x - p1.x, 2) + pow(p2.y - p1.y, 2))
    }
    
    private func averagePoint(_ points: [CGPoint]) -> CGPoint? {
        guard !points.isEmpty else { return nil }
        
        let totalX = points.reduce(0) { $0 + $1.x }
        let totalY = points.reduce(0) { $0 + $1.y }
        
        return CGPoint(x: totalX / CGFloat(points.count), y: totalY / CGFloat(points.count))
    }
}

// MARK: - ARSessionDelegate
extension FaceScanner: ARSessionDelegate {
    func session(_ session: ARSession, didUpdate anchors: [ARAnchor]) {
        guard isScanning else { return }
        
        // Check for face anchor
        if let faceAnchor = anchors.first as? ARFaceAnchor {
            // Only capture frames when face is fully detected
            if faceAnchor.isTracked {
                delegate?.faceScannerDidDetectFace()
                
                // Add current frame to captured frames
                if let currentFrame = session.currentFrame {
                    capturedFrames.append(currentFrame)
                    
                    // Stop scanning if we have enough frames
                    if capturedFrames.count >= minRequiredFrames {
                        stopScanning()
                    }
                }
            }
        }
    }
    
    func session(_ session: ARSession, didFailWithError error: Error) {
        delegate?.faceScannerDidFailWithError(error)
    }
}

// MARK: - FaceScannerError
enum FaceScannerError: Error {
    case deviceNotSupported
    case insufficientData
    case noFaceDetected
    case invalidImage
    case landmarksNotFound
}

extension FaceScannerError: LocalizedError {
    var errorDescription: String? {
        switch self {
        case .deviceNotSupported:
            return "This device does not support face tracking."
        case .insufficientData:
            return "Insufficient data captured for measurements."
        case .noFaceDetected:
            return "No face detected in the image."
        case .invalidImage:
            return "Invalid image provided for processing."
        case .landmarksNotFound:
            return "Facial landmarks could not be detected."
        }
    }
} 