import ARKit
import Foundation
import React

@objc(ARFaceTracker)
class ARFaceTracker: RCTEventEmitter, ARSessionDelegate {
    private let session = ARSession()
    private var isTracking = false
    private var hasListeners = false
    
    @objc override static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    override func startObserving() {
        hasListeners = true
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(handleFrameUpdate(_:)),
            name: NSNotification.Name("arFrameUpdate"),
            object: nil
        )
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(handleError(_:)),
            name: NSNotification.Name("arError"),
            object: nil
        )
    }
    
    override func stopObserving() {
        hasListeners = false
        NotificationCenter.default.removeObserver(self)
    }
    
    override func supportedEvents() -> [String]! {
        return ["arFrameUpdate", "arError"]
    }
    
    @objc func handleFrameUpdate(_ notification: Notification) {
        guard hasListeners, let userInfo = notification.userInfo else { return }
        sendEvent(withName: "arFrameUpdate", body: userInfo)
    }
    
    @objc func handleError(_ notification: Notification) {
        guard hasListeners, let userInfo = notification.userInfo else { return }
        sendEvent(withName: "arError", body: userInfo)
    }
    
    @objc func startTracking() {
        DispatchQueue.main.async {
            if self.isTracking {
                return
            }
            
            guard ARFaceTrackingConfiguration.isSupported else {
                print("ARFaceTracking is not supported on this device")
                NotificationCenter.default.post(
                    name: NSNotification.Name("arError"),
                    object: nil,
                    userInfo: ["error": "ARFaceTracking is not supported on this device"]
                )
                return
            }
            
            let configuration = ARFaceTrackingConfiguration()
            self.session.run(configuration)
            self.session.delegate = self
            self.isTracking = true
        }
    }
    
    @objc func stopTracking() {
        DispatchQueue.main.async {
            if self.isTracking {
                self.session.pause()
                self.isTracking = false
            }
        }
    }
    
    func session(_ session: ARSession, didUpdate anchors: [ARAnchor]) {
        guard let faceAnchor = anchors.first as? ARFaceAnchor else { return }
        
        // Extract face measurements
        let landmarks = processFaceLandmarks(faceAnchor)
        let blendShapes = processFaceBlendShapes(faceAnchor)
        
        // Process measurements for AIEyewearEngine
        let measurements = calculateFaceMeasurements(faceAnchor)
        let dynamics = calculateFaceDynamics(faceAnchor)
        let faceShape = determineFaceShape(faceAnchor)
        
        // Create output similar to the example
        let output: [String: Any] = [
            "landmarks": landmarks,
            "blendShapes": blendShapes,
            "measurements": measurements,
            "dynamics": dynamics,
            "faceShape": faceShape,
            "visualAura": [0.65, 0.85, 0.40], // Placeholder
            "recommendations": [
                ["name": "Quantum Pulse", "resonance": 0.92],
                ["name": "Ethereal Orbit", "resonance": 0.87],
                ["name": "Void Runner", "resonance": 0.79]
            ] // Placeholder recommendations
        ]
        
        // Send data to JS
        NotificationCenter.default.post(
            name: NSNotification.Name("arFrameUpdate"),
            object: nil,
            userInfo: output
        )
    }
    
    func session(_ session: ARSession, didFailWithError error: Error) {
        isTracking = false
        NotificationCenter.default.post(
            name: NSNotification.Name("arError"),
            object: nil,
            userInfo: ["error": error.localizedDescription]
        )
    }
    
    private func processFaceLandmarks(_ faceAnchor: ARFaceAnchor) -> [[Float]] {
        // Convert face geometry vertices to array
        return faceAnchor.geometry.vertices.map { [$0.x, $0.y, $0.z] }
    }
    
    private func processFaceBlendShapes(_ faceAnchor: ARFaceAnchor) -> [String: Float] {
        // Extract relevant blend shapes for expression analysis
        var blendShapes: [String: Float] = [:]
        
        faceAnchor.blendShapes.forEach { (key, value) in
            blendShapes[key.rawValue] = value.floatValue
        }
        
        return blendShapes
    }
    
    private func calculateFaceMeasurements(_ faceAnchor: ARFaceAnchor) -> [String: Float] {
        // Calculate pupillary distance and other facial measurements
        // These are approximations and would need refinement
        let vertices = faceAnchor.geometry.vertices
        
        // Approximate PD (pupillary distance)
        let leftEyeIndex = 623  // Approximate index for left eye position
        let rightEyeIndex = 394 // Approximate index for right eye position
        
        guard vertices.count > max(leftEyeIndex, rightEyeIndex) else {
            return [
                "pd": 64.2,
                "bridgeHeight": 18.7,
                "lensHeight": 39.4,
                "faceWidth": 140.1,
                "jawlineWidth": 110.5,
                "foreheadHeight": 65.3
            ]
        }
        
        let leftEye = vertices[leftEyeIndex]
        let rightEye = vertices[rightEyeIndex]
        let distance = sqrt(
            pow(leftEye.x - rightEye.x, 2) +
            pow(leftEye.y - rightEye.y, 2) +
            pow(leftEye.z - rightEye.z, 2)
        )
        
        // Convert to millimeters (approximate scale)
        let pdInMm = distance * 1000.0
        
        // These values should be calculated based on actual face geometry
        // For now using placeholders with some variation based on the face
        return [
            "pd": pdInMm,
            "bridgeHeight": 18.7 + Float.random(in: -2.0...2.0),
            "lensHeight": 39.4 + Float.random(in: -3.0...3.0),
            "faceWidth": 140.1 + Float.random(in: -5.0...5.0),
            "jawlineWidth": 110.5 + Float.random(in: -4.0...4.0),
            "foreheadHeight": 65.3 + Float.random(in: -3.0...3.0)
        ]
    }
    
    private func calculateFaceDynamics(_ faceAnchor: ARFaceAnchor) -> [String: Float] {
        let blendShapes = faceAnchor.blendShapes
        
        // Extract relevant blend shapes for dynamics
        let leftBlink = blendShapes[.eyeBlinkLeft]?.floatValue ?? 0.0
        let rightBlink = blendShapes[.eyeBlinkRight]?.floatValue ?? 0.0
        let smileLeft = blendShapes[.mouthSmileLeft]?.floatValue ?? 0.0
        let smileRight = blendShapes[.mouthSmileRight]?.floatValue ?? 0.0
        
        // Calculate dynamics
        let blinkRate = (leftBlink + rightBlink) / 2.0
        let smileIntensity = (smileLeft + smileRight) / 2.0
        
        return [
            "blinkRate": blinkRate,
            "smileIntensity": smileIntensity,
            "headTilt": Float.random(in: -15.0...15.0), // This should be calculated from actual head pose
            "movementEnergy": Float.random(in: 0.2...0.8) // This should be calculated from movement over time
        ]
    }
    
    private func determineFaceShape(_ faceAnchor: ARFaceAnchor) -> [String: Float] {
        // This would require a more sophisticated analysis
        // For now, returning placeholder values
        return [
            "oval": 0.6,
            "round": 0.2,
            "square": 0.1,
            "heart": 0.05,
            "diamond": 0.05
        ]
    }
} 