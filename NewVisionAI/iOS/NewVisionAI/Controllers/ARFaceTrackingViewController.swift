import UIKit
import ARKit
import SceneKit
import Vision

// Protocol for handling face scanning events
protocol ARFaceTrackingDelegate: AnyObject {
    func faceTrackingDidDetectFace()
    func faceTrackingDidCompleteScan(result: MeasurementResult)
    func faceTrackingDidFail(with error: Error)
    func faceTrackingDidUpdateProgress(progress: Float)
}

class ARFaceTrackingViewController: UIViewController {
    
    // MARK: - Properties
    
    weak var delegate: ARFaceTrackingDelegate?
    
    private let sceneView = ARSCNView()
    private let faceScanner = FaceScanner()
    private let scanningOverlay = UIView()
    private let progressView = UIProgressView(progressViewStyle: .bar)
    private let statusLabel = UILabel()
    private let instructionLabel = UILabel()
    private let cancelButton = UIButton(type: .system)
    
    private var scanProgress: Float = 0.0 {
        didSet {
            DispatchQueue.main.async {
                self.progressView.progress = self.scanProgress
                self.delegate?.faceTrackingDidUpdateProgress(progress: self.scanProgress)
                
                if self.scanProgress >= 1.0 {
                    self.completeScan()
                }
            }
        }
    }
    
    private var isScanning = false
    private var scanTimer: Timer?
    private var scanStartTime: Date?
    private var scanResult: MeasurementResult?
    private var faceMeshNode: SCNNode?
    private var faceAnchors: [ARFaceAnchor] = []
    
    // MARK: - Lifecycle Methods
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupViews()
        setupFaceScanner()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        setupARSession()
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        sceneView.session.pause()
        stopScanning()
    }
    
    // MARK: - Setup Methods
    
    private func setupViews() {
        view.backgroundColor = .black
        
        // Setup AR Scene View
        sceneView.delegate = self
        sceneView.automaticallyUpdatesLighting = true
        sceneView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(sceneView)
        
        // Setup scanning overlay
        scanningOverlay.translatesAutoresizingMaskIntoConstraints = false
        scanningOverlay.backgroundColor = .clear
        view.addSubview(scanningOverlay)
        
        // Setup progress view
        progressView.translatesAutoresizingMaskIntoConstraints = false
        progressView.progressTintColor = UIColor(red: 0.0, green: 0.8, blue: 0.6, alpha: 1.0)
        progressView.trackTintColor = UIColor.lightGray.withAlphaComponent(0.3)
        progressView.progress = 0.0
        progressView.layer.cornerRadius = 2
        progressView.clipsToBounds = true
        view.addSubview(progressView)
        
        // Setup status label
        statusLabel.translatesAutoresizingMaskIntoConstraints = false
        statusLabel.textAlignment = .center
        statusLabel.textColor = .white
        statusLabel.font = UIFont.systemFont(ofSize: 16, weight: .medium)
        statusLabel.text = "Position your face in the frame"
        view.addSubview(statusLabel)
        
        // Setup instruction label
        instructionLabel.translatesAutoresizingMaskIntoConstraints = false
        instructionLabel.textAlignment = .center
        instructionLabel.textColor = .white
        instructionLabel.font = UIFont.systemFont(ofSize: 14)
        instructionLabel.numberOfLines = 0
        instructionLabel.text = "Keep your face centered and stay still for accurate measurements"
        view.addSubview(instructionLabel)
        
        // Setup cancel button
        cancelButton.translatesAutoresizingMaskIntoConstraints = false
        cancelButton.setTitle("Cancel", for: .normal)
        cancelButton.setTitleColor(.white, for: .normal)
        cancelButton.backgroundColor = UIColor.darkGray.withAlphaComponent(0.5)
        cancelButton.layer.cornerRadius = 20
        cancelButton.contentEdgeInsets = UIEdgeInsets(top: 8, left: 16, bottom: 8, right: 16)
        cancelButton.addTarget(self, action: #selector(cancelButtonTapped), for: .touchUpInside)
        view.addSubview(cancelButton)
        
        // Setup constraints
        NSLayoutConstraint.activate([
            sceneView.topAnchor.constraint(equalTo: view.topAnchor),
            sceneView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            sceneView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            sceneView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            
            scanningOverlay.topAnchor.constraint(equalTo: view.topAnchor),
            scanningOverlay.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            scanningOverlay.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            scanningOverlay.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            
            progressView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 40),
            progressView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -40),
            progressView.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -100),
            progressView.heightAnchor.constraint(equalToConstant: 4),
            
            statusLabel.bottomAnchor.constraint(equalTo: progressView.topAnchor, constant: -20),
            statusLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            statusLabel.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            
            instructionLabel.topAnchor.constraint(equalTo: progressView.bottomAnchor, constant: 20),
            instructionLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            instructionLabel.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            
            cancelButton.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 16),
            cancelButton.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            cancelButton.heightAnchor.constraint(equalToConstant: 40)
        ])
        
        // Add face overlay guide
        addFaceOverlayGuide()
    }
    
    private func setupFaceScanner() {
        faceScanner.delegate = self
    }
    
    private func setupARSession() {
        guard ARFaceTrackingConfiguration.isSupported else {
            let error = NSError(domain: "com.newvisionai.arfacetracking", code: 100, userInfo: [NSLocalizedDescriptionKey: "Face tracking is not supported on this device"])
            delegate?.faceTrackingDidFail(with: error)
            return
        }
        
        let configuration = ARFaceTrackingConfiguration()
        configuration.maximumNumberOfTrackedFaces = 1
        
        sceneView.session.run(configuration, options: [.resetTracking, .removeExistingAnchors])
    }
    
    private func addFaceOverlayGuide() {
        let overlayPath = UIBezierPath(ovalIn: CGRect(x: 0, y: 0, width: 240, height: 320))
        
        let shapeLayer = CAShapeLayer()
        shapeLayer.path = overlayPath.cgPath
        shapeLayer.fillColor = UIColor.clear.cgColor
        shapeLayer.strokeColor = UIColor(red: 0.0, green: 0.8, blue: 0.6, alpha: 1.0).cgColor
        shapeLayer.lineWidth = 3.0
        shapeLayer.lineDashPattern = [10, 5]
        
        let animation = CABasicAnimation(keyPath: "lineDashPhase")
        animation.fromValue = 0
        animation.toValue = 15
        animation.duration = 1.0
        animation.repeatCount = .infinity
        shapeLayer.add(animation, forKey: "lineDashPhase")
        
        scanningOverlay.layer.addSublayer(shapeLayer)
        
        // Center the oval in the view
        shapeLayer.position = CGPoint(
            x: (view.bounds.width - 240) / 2,
            y: (view.bounds.height - 320) / 2 - 50 // Move it up a bit
        )
    }
    
    // MARK: - Scanning Methods
    
    func startScanning() {
        guard !isScanning else { return }
        
        isScanning = true
        scanProgress = 0.0
        statusLabel.text = "Scanning your face..."
        
        // Reset collected data
        faceAnchors.removeAll()
        scanStartTime = Date()
        
        // Start scan timer
        scanTimer = Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { [weak self] _ in
            guard let self = self else { return }
            
            // Update progress based on time (10 seconds to complete)
            if let startTime = self.scanStartTime {
                let elapsedTime = Date().timeIntervalSince(startTime)
                let newProgress = Float(min(elapsedTime / 10.0, 1.0))
                
                // Only update if we have detected a face
                if !self.faceAnchors.isEmpty {
                    self.scanProgress = newProgress
                }
            }
        }
    }
    
    func stopScanning() {
        isScanning = false
        scanTimer?.invalidate()
        scanTimer = nil
    }
    
    private func completeScan() {
        stopScanning()
        
        // Process collected face anchors to extract measurements
        guard !faceAnchors.isEmpty else {
            let error = NSError(domain: "com.newvisionai.facetracking", code: 101, userInfo: [NSLocalizedDescriptionKey: "No face data collected during scan"])
            delegate?.faceTrackingDidFail(with: error)
            return
        }
        
        // Use the face scanner to process the collected face anchors
        faceScanner.processFaceAnchors(faceAnchors) { [weak self] result in
            guard let self = self else { return }
            
            switch result {
            case .success(let measurements):
                self.scanResult = measurements
                self.delegate?.faceTrackingDidCompleteScan(result: measurements)
                
                // Update UI
                DispatchQueue.main.async {
                    self.statusLabel.text = "Scan Complete!"
                    self.instructionLabel.text = "Processing your measurements..."
                }
                
            case .failure(let error):
                self.delegate?.faceTrackingDidFail(with: error)
                
                // Update UI
                DispatchQueue.main.async {
                    self.statusLabel.text = "Scan Failed"
                    self.instructionLabel.text = "Please try again. \(error.localizedDescription)"
                }
            }
        }
    }
    
    // MARK: - Action Methods
    
    @objc private func cancelButtonTapped() {
        stopScanning()
        dismiss(animated: true)
    }
}

// MARK: - ARSCNViewDelegate

extension ARFaceTrackingViewController: ARSCNViewDelegate {
    func renderer(_ renderer: SCNSceneRenderer, didAdd node: SCNNode, for anchor: ARAnchor) {
        guard let faceAnchor = anchor as? ARFaceAnchor, isScanning else { return }
        
        // Create face mesh
        let geometry = ARSCNFaceGeometry(device: sceneView.device!)
        geometry?.update(from: faceAnchor.geometry)
        
        faceMeshNode = SCNNode(geometry: geometry)
        faceMeshNode?.geometry?.firstMaterial?.fillMode = .lines
        faceMeshNode?.geometry?.firstMaterial?.diffuse.contents = UIColor.green.withAlphaComponent(0.5)
        node.addChildNode(faceMeshNode!)
        
        // Notify delegate that a face was detected
        DispatchQueue.main.async {
            if self.scanStartTime == nil {
                self.startScanning()
            }
            self.delegate?.faceTrackingDidDetectFace()
        }
    }
    
    func renderer(_ renderer: SCNSceneRenderer, didUpdate node: SCNNode, for anchor: ARAnchor) {
        guard let faceAnchor = anchor as? ARFaceAnchor,
              let faceMeshNode = faceMeshNode,
              let geometry = faceMeshNode.geometry as? ARSCNFaceGeometry,
              isScanning else { return }
        
        // Update the face mesh geometry
        geometry.update(from: faceAnchor.geometry)
        
        // Collect face anchor for measurement
        if isScanning && scanProgress > 0.0 {
            // Sample face data at regular intervals (not every frame)
            if faceAnchors.count < 30 {  // Collect up to 30 samples
                let lastAnchorTime = faceAnchors.last?.timestamp ?? 0
                if faceAnchor.timestamp - lastAnchorTime > 0.3 {  // Sample every 0.3 seconds
                    faceAnchors.append(faceAnchor)
                    
                    // Update status based on collected samples
                    updateScanningStatus(samplesCollected: faceAnchors.count)
                }
            }
        }
    }
    
    func renderer(_ renderer: SCNSceneRenderer, didRemove node: SCNNode, for anchor: ARAnchor) {
        guard anchor is ARFaceAnchor else { return }
        
        // Face is no longer in view
        DispatchQueue.main.async {
            self.statusLabel.text = "Face lost. Please center your face again."
        }
    }
    
    private func updateScanningStatus(samplesCollected: Int) {
        let percentage = Int(scanProgress * 100)
        
        if samplesCollected < 5 {
            instructionLabel.text = "Keep your face centered and don't move"
        } else if samplesCollected < 15 {
            instructionLabel.text = "Great! Continue to look directly at the camera"
        } else {
            instructionLabel.text = "Almost done! Stay still for a few more seconds"
        }
        
        statusLabel.text = "Scanning: \(percentage)%"
    }
}

// MARK: - FaceScannerDelegate

extension ARFaceTrackingViewController: FaceScannerDelegate {
    func faceScannerDidDetectFace() {
        // This is handled in the renderer didAdd method
    }
    
    func faceScannerDidCompleteMeasurements(result: MeasurementResult) {
        // This is handled in the completeScan method
    }
    
    func faceScannerDidFailWithError(error: Error) {
        delegate?.faceTrackingDidFail(with: error)
    }
} 