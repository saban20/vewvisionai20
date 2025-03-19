import UIKit
import ARKit

class FaceScannerViewController: UIViewController {
    
    // MARK: - Properties
    
    private let titleLabel = UILabel()
    private let descriptionLabel = UILabel()
    private let progressView = UIProgressView(progressViewStyle: .bar)
    private let scanButton = UIButton(type: .system)
    private let instructionsView = UIView()
    private let instructionsTitleLabel = UILabel()
    private let instructionsListView = UIStackView()
    private let loadingView = UIActivityIndicatorView(style: .large)
    
    private var currentStep = ScanningStep.preparation
    private var scanResult: MeasurementResult?
    private var faceAnalysisResult: FaceAnalysisResult?
    private var recommendedProducts: [Product] = []
    
    // MARK: - Lifecycle Methods
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupView()
        checkARCapabilities()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.setNavigationBarHidden(false, animated: animated)
        navigationController?.navigationBar.prefersLargeTitles = true
        navigationItem.title = "Face Scanner"
    }
    
    // MARK: - Setup Methods
    
    private func setupView() {
        view.backgroundColor = .systemBackground
        
        // Title Label
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        titleLabel.font = UIFont.systemFont(ofSize: 24, weight: .bold)
        titleLabel.text = "Face Scanning & Measurements"
        titleLabel.textAlignment = .center
        view.addSubview(titleLabel)
        
        // Description Label
        descriptionLabel.translatesAutoresizingMaskIntoConstraints = false
        descriptionLabel.font = UIFont.systemFont(ofSize: 16)
        descriptionLabel.textColor = .secondaryLabel
        descriptionLabel.text = "Our advanced AR technology will scan your face to provide perfect eyewear recommendations."
        descriptionLabel.numberOfLines = 0
        descriptionLabel.textAlignment = .center
        view.addSubview(descriptionLabel)
        
        // Progress View
        progressView.translatesAutoresizingMaskIntoConstraints = false
        progressView.progressTintColor = UIColor(red: 0.0, green: 0.8, blue: 0.6, alpha: 1.0)
        progressView.progress = 0.0
        view.addSubview(progressView)
        
        // Scan Button
        scanButton.translatesAutoresizingMaskIntoConstraints = false
        scanButton.setTitle("Start Face Scan", for: .normal)
        scanButton.titleLabel?.font = UIFont.systemFont(ofSize: 18, weight: .semibold)
        scanButton.backgroundColor = UIColor(red: 0.0, green: 0.8, blue: 0.6, alpha: 1.0)
        scanButton.setTitleColor(.white, for: .normal)
        scanButton.layer.cornerRadius = 25
        scanButton.addTarget(self, action: #selector(scanButtonTapped), for: .touchUpInside)
        view.addSubview(scanButton)
        
        // Instructions View
        instructionsView.translatesAutoresizingMaskIntoConstraints = false
        instructionsView.backgroundColor = .secondarySystemBackground
        instructionsView.layer.cornerRadius = 12
        view.addSubview(instructionsView)
        
        // Instructions Title
        instructionsTitleLabel.translatesAutoresizingMaskIntoConstraints = false
        instructionsTitleLabel.font = UIFont.systemFont(ofSize: 18, weight: .semibold)
        instructionsTitleLabel.text = "For best results:"
        instructionsView.addSubview(instructionsTitleLabel)
        
        // Instructions List
        instructionsListView.translatesAutoresizingMaskIntoConstraints = false
        instructionsListView.axis = .vertical
        instructionsListView.spacing = 12
        instructionsListView.distribution = .equalSpacing
        instructionsView.addSubview(instructionsListView)
        
        // Loading View
        loadingView.translatesAutoresizingMaskIntoConstraints = false
        loadingView.hidesWhenStopped = true
        loadingView.color = UIColor(red: 0.0, green: 0.8, blue: 0.6, alpha: 1.0)
        view.addSubview(loadingView)
        
        // Set up instructions
        setupInstructions()
        
        // Set up constraints
        NSLayoutConstraint.activate([
            titleLabel.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 20),
            titleLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            titleLabel.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            
            descriptionLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 16),
            descriptionLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            descriptionLabel.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            
            progressView.topAnchor.constraint(equalTo: descriptionLabel.bottomAnchor, constant: 30),
            progressView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            progressView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            progressView.heightAnchor.constraint(equalToConstant: 6),
            
            instructionsView.topAnchor.constraint(equalTo: progressView.bottomAnchor, constant: 30),
            instructionsView.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            instructionsView.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            
            instructionsTitleLabel.topAnchor.constraint(equalTo: instructionsView.topAnchor, constant: 16),
            instructionsTitleLabel.leadingAnchor.constraint(equalTo: instructionsView.leadingAnchor, constant: 16),
            instructionsTitleLabel.trailingAnchor.constraint(equalTo: instructionsView.trailingAnchor, constant: -16),
            
            instructionsListView.topAnchor.constraint(equalTo: instructionsTitleLabel.bottomAnchor, constant: 12),
            instructionsListView.leadingAnchor.constraint(equalTo: instructionsView.leadingAnchor, constant: 16),
            instructionsListView.trailingAnchor.constraint(equalTo: instructionsView.trailingAnchor, constant: -16),
            instructionsListView.bottomAnchor.constraint(equalTo: instructionsView.bottomAnchor, constant: -16),
            
            scanButton.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -30),
            scanButton.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            scanButton.widthAnchor.constraint(equalToConstant: 250),
            scanButton.heightAnchor.constraint(equalToConstant: 50),
            
            loadingView.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            loadingView.centerYAnchor.constraint(equalTo: view.centerYAnchor)
        ])
    }
    
    private func setupInstructions() {
        let instructions = [
            "Remove glasses, hats, or anything covering your face",
            "Ensure good lighting on your face",
            "Face the camera directly",
            "Keep still during the scanning process",
            "Maintain neutral facial expression"
        ]
        
        instructions.forEach { instructionText in
            let instructionRow = createInstructionRow(text: instructionText)
            instructionsListView.addArrangedSubview(instructionRow)
        }
    }
    
    private func createInstructionRow(text: String) -> UIView {
        let container = UIView()
        
        let checkmarkImageView = UIImageView(image: UIImage(systemName: "checkmark.circle.fill"))
        checkmarkImageView.translatesAutoresizingMaskIntoConstraints = false
        checkmarkImageView.tintColor = UIColor(red: 0.0, green: 0.8, blue: 0.6, alpha: 1.0)
        checkmarkImageView.contentMode = .scaleAspectFit
        container.addSubview(checkmarkImageView)
        
        let label = UILabel()
        label.translatesAutoresizingMaskIntoConstraints = false
        label.text = text
        label.font = UIFont.systemFont(ofSize: 16)
        label.numberOfLines = 0
        container.addSubview(label)
        
        NSLayoutConstraint.activate([
            checkmarkImageView.leadingAnchor.constraint(equalTo: container.leadingAnchor),
            checkmarkImageView.topAnchor.constraint(equalTo: container.topAnchor, constant: 2),
            checkmarkImageView.widthAnchor.constraint(equalToConstant: 20),
            checkmarkImageView.heightAnchor.constraint(equalToConstant: 20),
            
            label.leadingAnchor.constraint(equalTo: checkmarkImageView.trailingAnchor, constant: 12),
            label.topAnchor.constraint(equalTo: container.topAnchor),
            label.trailingAnchor.constraint(equalTo: container.trailingAnchor),
            label.bottomAnchor.constraint(equalTo: container.bottomAnchor)
        ])
        
        return container
    }
    
    private func checkARCapabilities() {
        if !ARFaceTrackingConfiguration.isSupported {
            let alert = UIAlertController(
                title: "Face Tracking Not Supported",
                message: "Your device does not support face tracking. Please try another device.",
                preferredStyle: .alert
            )
            alert.addAction(UIAlertAction(title: "OK", style: .default))
            present(alert, animated: true)
            
            scanButton.isEnabled = false
            scanButton.backgroundColor = .systemGray3
        }
    }
    
    // MARK: - Navigation Methods
    
    private func showARFaceTrackingController() {
        let arViewController = ARFaceTrackingViewController()
        arViewController.delegate = self
        arViewController.modalPresentationStyle = .fullScreen
        present(arViewController, animated: true)
    }
    
    private func showResultsController() {
        guard let scanResult = scanResult, let faceAnalysisResult = faceAnalysisResult else { return }
        
        let resultsVC = MeasurementResultsViewController()
        resultsVC.configure(with: scanResult, faceAnalysis: faceAnalysisResult, recommendedProducts: recommendedProducts)
        navigationController?.pushViewController(resultsVC, animated: true)
    }
    
    // MARK: - Update UI Methods
    
    private func updateUIForStep(_ step: ScanningStep) {
        currentStep = step
        
        switch step {
        case .preparation:
            progressView.progress = 0.0
            scanButton.setTitle("Start Face Scan", for: .normal)
            titleLabel.text = "Face Scanning & Measurements"
            descriptionLabel.text = "Our advanced AR technology will scan your face to provide perfect eyewear recommendations."
            
        case .scanning:
            progressView.progress = 0.25
            scanButton.setTitle("Scanning in progress...", for: .normal)
            scanButton.isEnabled = false
            
        case .processing:
            progressView.progress = 0.5
            scanButton.setTitle("Processing...", for: .normal)
            scanButton.isEnabled = false
            loadingView.startAnimating()
            titleLabel.text = "Analyzing Results"
            descriptionLabel.text = "We're processing your scan data to extract precise measurements."
            
        case .analysis:
            progressView.progress = 0.75
            titleLabel.text = "Face Analysis"
            descriptionLabel.text = "Determining your face shape and features to find your perfect match."
            
        case .complete:
            progressView.progress = 1.0
            scanButton.setTitle("View Results", for: .normal)
            scanButton.isEnabled = true
            loadingView.stopAnimating()
            titleLabel.text = "Scan Complete!"
            descriptionLabel.text = "Your face scan and measurements are ready. View your results and recommendations."
        }
    }
    
    // MARK: - Data Processing Methods
    
    private func processMeasurements(_ measurements: MeasurementResult) {
        self.scanResult = measurements
        updateUIForStep(.processing)
        
        // Simulate API call to analyze face
        DispatchQueue.main.asyncAfter(deadline: .now() + 2) { [weak self] in
            guard let self = self else { return }
            
            self.analyzeFace(measurements)
            self.updateUIForStep(.analysis)
            
            // Simulate API call to get product recommendations
            DispatchQueue.main.asyncAfter(deadline: .now() + 2) { [weak self] in
                guard let self = self else { return }
                
                self.getRecommendedProducts()
                self.updateUIForStep(.complete)
            }
        }
    }
    
    private func analyzeFace(_ measurements: MeasurementResult) {
        // This would normally call an API, but we'll simulate it for now
        let faceAnalysis = FaceAnalysisResult(
            faceShape: "oval",
            faceSymmetry: 0.92,
            skinTone: "medium",
            recommendedStyles: ["rectangular", "wayfarer", "aviator"],
            recommendedColors: ["black", "tortoise", "blue"],
            confidenceScore: 0.87
        )
        
        self.faceAnalysisResult = faceAnalysis
    }
    
    private func getRecommendedProducts() {
        // Simulate getting recommended products
        guard let faceShape = faceAnalysisResult?.faceShape else { return }
        
        // This would normally call an API, but we'll create some sample data
        var sampleProducts: [Product] = []
        
        // Add some sample products
        for i in 1...5 {
            let product = Product(
                id: i,
                name: "NewVision Model \(i)",
                description: "Premium eyewear with perfect fit for \(faceShape) face shapes",
                brand: "NewVision",
                price: Double(89 + (i * 10)),
                discountPrice: i % 2 == 0 ? Double(79 + (i * 10)) : nil,
                sku: "NV-\(1000 + i)",
                stock: 10 + i,
                isAvailable: true,
                frameShape: i % 2 == 0 ? .rectangle : .wayfarer,
                frameMaterial: i % 3 == 0 ? .acetate : .metal,
                frameColor: ["black", "tortoise", "navy", "crystal"][i % 4],
                lensType: i % 2 == 0 ? .blueLight : .polarized,
                lensColor: ["clear", "gray", "brown"][i % 3],
                frameWidth: 140.0 + Double(i),
                templeLength: 145.0,
                bridgeWidth: 20.0,
                lensWidth: 50.0 + Double(i % 5),
                lensHeight: 40.0 + Double(i % 3),
                weight: 25.0 + Double(i),
                gender: i % 3 == 0 ? "female" : "unisex",
                faceShapes: "\(faceShape), round, square",
                thumbnailURL: "https://example.com/glasses\(i).jpg",
                imageURLs: "[\\"https://example.com/glasses\(i)_1.jpg\\", \\"https://example.com/glasses\(i)_2.jpg\\"]",
                model3DURL: "https://example.com/glasses\(i)_3d.usdz"
            )
            
            sampleProducts.append(product)
        }
        
        self.recommendedProducts = sampleProducts
    }
    
    // MARK: - Action Methods
    
    @objc private func scanButtonTapped() {
        switch currentStep {
        case .preparation:
            updateUIForStep(.scanning)
            showARFaceTrackingController()
            
        case .complete:
            showResultsController()
            
        default:
            break
        }
    }
}

// MARK: - ScanningStep Enum

extension FaceScannerViewController {
    enum ScanningStep {
        case preparation
        case scanning
        case processing
        case analysis
        case complete
    }
}

// MARK: - ARFaceTrackingDelegate

extension FaceScannerViewController: ARFaceTrackingDelegate {
    func faceTrackingDidDetectFace() {
        // Handle face detection notification
    }
    
    func faceTrackingDidCompleteScan(result: MeasurementResult) {
        // Process measurement results
        dismiss(animated: true) { [weak self] in
            guard let self = self else { return }
            self.processMeasurements(result)
        }
    }
    
    func faceTrackingDidFail(with error: Error) {
        dismiss(animated: true) { [weak self] in
            guard let self = self else { return }
            
            // Show error alert
            let alert = UIAlertController(
                title: "Scanning Failed",
                message: "There was an error during the scanning process: \(error.localizedDescription). Please try again.",
                preferredStyle: .alert
            )
            alert.addAction(UIAlertAction(title: "OK", style: .default) { _ in
                self.updateUIForStep(.preparation)
            })
            self.present(alert, animated: true)
        }
    }
    
    func faceTrackingDidUpdateProgress(progress: Float) {
        // We can use this to update UI if needed during scanning
    }
}

// MARK: - Placeholder MeasurementResultsViewController
// This would be implemented in its own file

class MeasurementResultsViewController: UIViewController {
    private let scrollView = UIScrollView()
    private let contentView = UIView()
    
    func configure(with measurements: MeasurementResult, faceAnalysis: FaceAnalysisResult, recommendedProducts: [Product]) {
        // Configure the view with the measurement results, face analysis and product recommendations
        // This would be implemented in the actual class
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .systemBackground
        navigationItem.title = "Your Results"
        
        // This is a placeholder implementation
        // The real implementation would display the measurement results, face analysis,
        // and recommended products in a well-designed UI
    }
} 