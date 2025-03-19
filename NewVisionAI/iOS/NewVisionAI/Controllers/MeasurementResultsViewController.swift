import UIKit

class MeasurementResultsViewController: UIViewController {
    
    // MARK: - Properties
    
    private let scrollView = UIScrollView()
    private let contentView = UIView()
    
    private let headerLabel = UILabel()
    private let faceShapeView = UIView()
    private let faceShapeLabel = UILabel()
    private let faceShapeImageView = UIImageView()
    private let measurementsTableView = UITableView(frame: .zero, style: .insetGrouped)
    private let recommendationsLabel = UILabel()
    private let recommendationsCollectionView: UICollectionView
    private let saveButton = UIButton(type: .system)
    private let shareButton = UIButton(type: .system)
    
    private var measurements: MeasurementResult?
    private var faceAnalysis: FaceAnalysisResult?
    private var recommendedProducts: [Product] = []
    
    // MARK: - Initialization
    
    init() {
        // Configure collection view layout
        let layout = UICollectionViewFlowLayout()
        layout.scrollDirection = .horizontal
        layout.itemSize = CGSize(width: 160, height: 250)
        layout.minimumLineSpacing = 15
        layout.minimumInteritemSpacing = 10
        recommendationsCollectionView = UICollectionView(frame: .zero, collectionViewLayout: layout)
        
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    // MARK: - Lifecycle Methods
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupView()
        setupNavigationBar()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.navigationBar.prefersLargeTitles = true
    }
    
    // MARK: - Configuration
    
    func configure(with measurements: MeasurementResult, faceAnalysis: FaceAnalysisResult, recommendedProducts: [Product]) {
        self.measurements = measurements
        self.faceAnalysis = faceAnalysis
        self.recommendedProducts = recommendedProducts
        
        // Update UI with measurement results
        updateUI()
    }
    
    // MARK: - Setup Methods
    
    private func setupView() {
        view.backgroundColor = .systemBackground
        
        // Setup scroll view
        scrollView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(scrollView)
        
        // Setup content view
        contentView.translatesAutoresizingMaskIntoConstraints = false
        scrollView.addSubview(contentView)
        
        // Setup header label
        headerLabel.translatesAutoresizingMaskIntoConstraints = false
        headerLabel.font = UIFont.systemFont(ofSize: 24, weight: .bold)
        headerLabel.text = "Your Perfect Fit Results"
        headerLabel.textAlignment = .left
        contentView.addSubview(headerLabel)
        
        // Setup face shape view
        faceShapeView.translatesAutoresizingMaskIntoConstraints = false
        faceShapeView.backgroundColor = .secondarySystemBackground
        faceShapeView.layer.cornerRadius = 15
        contentView.addSubview(faceShapeView)
        
        // Setup face shape label
        faceShapeLabel.translatesAutoresizingMaskIntoConstraints = false
        faceShapeLabel.font = UIFont.systemFont(ofSize: 18, weight: .semibold)
        faceShapeLabel.textAlignment = .center
        faceShapeView.addSubview(faceShapeLabel)
        
        // Setup face shape image view
        faceShapeImageView.translatesAutoresizingMaskIntoConstraints = false
        faceShapeImageView.contentMode = .scaleAspectFit
        faceShapeImageView.tintColor = UIColor(red: 0.0, green: 0.8, blue: 0.6, alpha: 1.0)
        faceShapeView.addSubview(faceShapeImageView)
        
        // Setup measurements table view
        measurementsTableView.translatesAutoresizingMaskIntoConstraints = false
        measurementsTableView.delegate = self
        measurementsTableView.dataSource = self
        measurementsTableView.register(UITableViewCell.self, forCellReuseIdentifier: "MeasurementCell")
        measurementsTableView.isScrollEnabled = false
        measurementsTableView.backgroundColor = .clear
        contentView.addSubview(measurementsTableView)
        
        // Setup recommendations label
        recommendationsLabel.translatesAutoresizingMaskIntoConstraints = false
        recommendationsLabel.font = UIFont.systemFont(ofSize: 20, weight: .semibold)
        recommendationsLabel.text = "Recommended Frames"
        contentView.addSubview(recommendationsLabel)
        
        // Setup recommendations collection view
        recommendationsCollectionView.translatesAutoresizingMaskIntoConstraints = false
        recommendationsCollectionView.delegate = self
        recommendationsCollectionView.dataSource = self
        recommendationsCollectionView.register(ProductCollectionViewCell.self, forCellWithReuseIdentifier: "ProductCell")
        recommendationsCollectionView.backgroundColor = .clear
        recommendationsCollectionView.showsHorizontalScrollIndicator = false
        contentView.addSubview(recommendationsCollectionView)
        
        // Setup save and share buttons
        saveButton.translatesAutoresizingMaskIntoConstraints = false
        saveButton.setTitle("Save Results", for: .normal)
        saveButton.titleLabel?.font = UIFont.systemFont(ofSize: 16, weight: .semibold)
        saveButton.backgroundColor = UIColor(red: 0.0, green: 0.8, blue: 0.6, alpha: 1.0)
        saveButton.setTitleColor(.white, for: .normal)
        saveButton.layer.cornerRadius = 12
        saveButton.addTarget(self, action: #selector(saveButtonTapped), for: .touchUpInside)
        contentView.addSubview(saveButton)
        
        shareButton.translatesAutoresizingMaskIntoConstraints = false
        shareButton.setTitle("Share", for: .normal)
        shareButton.titleLabel?.font = UIFont.systemFont(ofSize: 16, weight: .semibold)
        shareButton.backgroundColor = .systemGray5
        shareButton.setTitleColor(.label, for: .normal)
        shareButton.layer.cornerRadius = 12
        shareButton.addTarget(self, action: #selector(shareButtonTapped), for: .touchUpInside)
        contentView.addSubview(shareButton)
        
        // Set up constraints
        NSLayoutConstraint.activate([
            scrollView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            scrollView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            scrollView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            scrollView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            
            contentView.topAnchor.constraint(equalTo: scrollView.topAnchor),
            contentView.leadingAnchor.constraint(equalTo: scrollView.leadingAnchor),
            contentView.trailingAnchor.constraint(equalTo: scrollView.trailingAnchor),
            contentView.bottomAnchor.constraint(equalTo: scrollView.bottomAnchor),
            contentView.widthAnchor.constraint(equalTo: scrollView.widthAnchor),
            
            headerLabel.topAnchor.constraint(equalTo: contentView.topAnchor, constant: 20),
            headerLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            headerLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            faceShapeView.topAnchor.constraint(equalTo: headerLabel.bottomAnchor, constant: 20),
            faceShapeView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            faceShapeView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            faceShapeView.heightAnchor.constraint(equalToConstant: 180),
            
            faceShapeLabel.topAnchor.constraint(equalTo: faceShapeView.topAnchor, constant: 15),
            faceShapeLabel.leadingAnchor.constraint(equalTo: faceShapeView.leadingAnchor, constant: 15),
            faceShapeLabel.trailingAnchor.constraint(equalTo: faceShapeView.trailingAnchor, constant: -15),
            
            faceShapeImageView.topAnchor.constraint(equalTo: faceShapeLabel.bottomAnchor, constant: 10),
            faceShapeImageView.centerXAnchor.constraint(equalTo: faceShapeView.centerXAnchor),
            faceShapeImageView.widthAnchor.constraint(equalToConstant: 120),
            faceShapeImageView.heightAnchor.constraint(equalToConstant: 120),
            
            measurementsTableView.topAnchor.constraint(equalTo: faceShapeView.bottomAnchor, constant: 20),
            measurementsTableView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor),
            measurementsTableView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor),
            measurementsTableView.heightAnchor.constraint(equalToConstant: 250),
            
            recommendationsLabel.topAnchor.constraint(equalTo: measurementsTableView.bottomAnchor, constant: 20),
            recommendationsLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            recommendationsLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            
            recommendationsCollectionView.topAnchor.constraint(equalTo: recommendationsLabel.bottomAnchor, constant: 10),
            recommendationsCollectionView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 10),
            recommendationsCollectionView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor),
            recommendationsCollectionView.heightAnchor.constraint(equalToConstant: 250),
            
            saveButton.topAnchor.constraint(equalTo: recommendationsCollectionView.bottomAnchor, constant: 30),
            saveButton.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 20),
            saveButton.heightAnchor.constraint(equalToConstant: 50),
            saveButton.widthAnchor.constraint(equalTo: contentView.widthAnchor, multiplier: 0.45),
            
            shareButton.topAnchor.constraint(equalTo: recommendationsCollectionView.bottomAnchor, constant: 30),
            shareButton.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -20),
            shareButton.heightAnchor.constraint(equalToConstant: 50),
            shareButton.widthAnchor.constraint(equalTo: contentView.widthAnchor, multiplier: 0.45),
            
            shareButton.bottomAnchor.constraint(equalTo: contentView.bottomAnchor, constant: -30)
        ])
    }
    
    private func setupNavigationBar() {
        navigationItem.title = "Your Results"
        navigationItem.rightBarButtonItem = UIBarButtonItem(barButtonSystemItem: .done, target: self, action: #selector(doneButtonTapped))
    }
    
    private func updateUI() {
        guard let measurements = measurements, let faceAnalysis = faceAnalysis else { return }
        
        // Update face shape section
        faceShapeLabel.text = "Your Face Shape: \(faceAnalysis.faceShape.capitalized)"
        
        // Set face shape image based on shape
        let imageName: String
        switch faceAnalysis.faceShape.lowercased() {
        case "oval":
            imageName = "oval.fill"
        case "round":
            imageName = "circle.fill"
        case "square":
            imageName = "square.fill"
        case "rectangle", "oblong":
            imageName = "rectangle.fill"
        case "heart":
            imageName = "heart.fill"
        case "diamond":
            imageName = "diamond.fill"
        case "triangle":
            imageName = "triangle.fill"
        default:
            imageName = "face.smiling.fill"
        }
        
        faceShapeImageView.image = UIImage(systemName: imageName)
        
        // Reload measurements table view
        measurementsTableView.reloadData()
        
        // Reload recommendations collection view
        recommendationsCollectionView.reloadData()
    }
    
    // MARK: - Action Methods
    
    @objc private func saveButtonTapped() {
        // Save measurements to database or local storage
        let alert = UIAlertController(
            title: "Results Saved",
            message: "Your face measurement results have been saved to your profile.",
            preferredStyle: .alert
        )
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
    
    @objc private func shareButtonTapped() {
        // Create a string with measurements for sharing
        guard let measurements = measurements, let faceAnalysis = faceAnalysis else { return }
        
        let sharingText = """
        My NewVision AI Eyewear Measurements:
        
        Face Shape: \(faceAnalysis.faceShape.capitalized)
        Pupillary Distance: \(String(format: "%.1f", measurements.pupillaryDistance)) mm
        Temple Length: \(String(format: "%.1f", measurements.templeLength)) mm
        Bridge Width: \(String(format: "%.1f", measurements.bridgeWidth)) mm
        Frame Width: \(String(format: "%.1f", measurements.frameWidth)) mm
        """
        
        let activityVC = UIActivityViewController(activityItems: [sharingText], applicationActivities: nil)
        present(activityVC, animated: true)
    }
    
    @objc private func doneButtonTapped() {
        // Return to the main flow
        navigationController?.popToRootViewController(animated: true)
    }
}

// MARK: - UITableViewDelegate, UITableViewDataSource

extension MeasurementResultsViewController: UITableViewDelegate, UITableViewDataSource {
    func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 6 // Number of measurements to display
    }
    
    func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        return "Your Measurements"
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "MeasurementCell", for: indexPath)
        cell.selectionStyle = .none
        
        guard let measurements = measurements else {
            cell.textLabel?.text = "Loading..."
            return cell
        }
        
        var text = ""
        var detailText = ""
        
        switch indexPath.row {
        case 0:
            text = "Pupillary Distance (PD)"
            detailText = String(format: "%.1f mm", measurements.pupillaryDistance)
        case 1:
            text = "Temple Length"
            detailText = String(format: "%.1f mm", measurements.templeLength)
        case 2:
            text = "Bridge Width"
            detailText = String(format: "%.1f mm", measurements.bridgeWidth)
        case 3:
            text = "Frame Width"
            detailText = String(format: "%.1f mm", measurements.frameWidth)
        case 4:
            text = "Lens Width"
            detailText = String(format: "%.1f mm", measurements.lensWidth)
        case 5:
            text = "Lens Height"
            detailText = String(format: "%.1f mm", measurements.lensHeight)
        default:
            text = "Unknown Measurement"
            detailText = "N/A"
        }
        
        var config = cell.defaultContentConfiguration()
        config.text = text
        config.secondaryText = detailText
        cell.contentConfiguration = config
        
        return cell
    }
}

// MARK: - UICollectionViewDelegate, UICollectionViewDataSource

extension MeasurementResultsViewController: UICollectionViewDelegate, UICollectionViewDataSource {
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return recommendedProducts.count
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "ProductCell", for: indexPath) as! ProductCollectionViewCell
        
        let product = recommendedProducts[indexPath.item]
        cell.configure(with: product)
        
        return cell
    }
    
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        // Show product detail
        let product = recommendedProducts[indexPath.item]
        let detailVC = ProductDetailViewController(product: product)
        navigationController?.pushViewController(detailVC, animated: true)
    }
}

// MARK: - ProductCollectionViewCell

class ProductCollectionViewCell: UICollectionViewCell {
    
    private let imageView = UIImageView()
    private let titleLabel = UILabel()
    private let priceLabel = UILabel()
    private let brandLabel = UILabel()
    private let frameShapeLabel = UILabel()
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupCell()
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    private func setupCell() {
        contentView.backgroundColor = .secondarySystemBackground
        contentView.layer.cornerRadius = 12
        contentView.clipsToBounds = true
        
        // Setup image view
        imageView.translatesAutoresizingMaskIntoConstraints = false
        imageView.contentMode = .scaleAspectFit
        imageView.backgroundColor = .white
        contentView.addSubview(imageView)
        
        // Setup title label
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        titleLabel.font = UIFont.systemFont(ofSize: 14, weight: .semibold)
        titleLabel.textAlignment = .left
        titleLabel.numberOfLines = 2
        contentView.addSubview(titleLabel)
        
        // Setup price label
        priceLabel.translatesAutoresizingMaskIntoConstraints = false
        priceLabel.font = UIFont.systemFont(ofSize: 14, weight: .bold)
        priceLabel.textAlignment = .left
        priceLabel.textColor = UIColor(red: 0.0, green: 0.5, blue: 0.8, alpha: 1.0)
        contentView.addSubview(priceLabel)
        
        // Setup brand label
        brandLabel.translatesAutoresizingMaskIntoConstraints = false
        brandLabel.font = UIFont.systemFont(ofSize: 12)
        brandLabel.textAlignment = .left
        brandLabel.textColor = .secondaryLabel
        contentView.addSubview(brandLabel)
        
        // Setup frame shape label
        frameShapeLabel.translatesAutoresizingMaskIntoConstraints = false
        frameShapeLabel.font = UIFont.systemFont(ofSize: 12)
        frameShapeLabel.textAlignment = .left
        frameShapeLabel.textColor = .secondaryLabel
        contentView.addSubview(frameShapeLabel)
        
        // Setup constraints
        NSLayoutConstraint.activate([
            imageView.topAnchor.constraint(equalTo: contentView.topAnchor),
            imageView.leadingAnchor.constraint(equalTo: contentView.leadingAnchor),
            imageView.trailingAnchor.constraint(equalTo: contentView.trailingAnchor),
            imageView.heightAnchor.constraint(equalTo: contentView.heightAnchor, multiplier: 0.6),
            
            titleLabel.topAnchor.constraint(equalTo: imageView.bottomAnchor, constant: 8),
            titleLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 8),
            titleLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -8),
            
            brandLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 4),
            brandLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 8),
            brandLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -8),
            
            priceLabel.topAnchor.constraint(equalTo: brandLabel.bottomAnchor, constant: 4),
            priceLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 8),
            priceLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -8),
            
            frameShapeLabel.topAnchor.constraint(equalTo: priceLabel.bottomAnchor, constant: 4),
            frameShapeLabel.leadingAnchor.constraint(equalTo: contentView.leadingAnchor, constant: 8),
            frameShapeLabel.trailingAnchor.constraint(equalTo: contentView.trailingAnchor, constant: -8),
            frameShapeLabel.bottomAnchor.constraint(lessThanOrEqualTo: contentView.bottomAnchor, constant: -8)
        ])
    }
    
    func configure(with product: Product) {
        titleLabel.text = product.name
        priceLabel.text = product.formattedPrice
        brandLabel.text = product.brand
        frameShapeLabel.text = product.frameShape.displayName
        
        // Set image if available
        if let url = product.thumbnailImageURL {
            // In a real app, use an image loading library like Kingfisher or SDWebImage
            // For now, just set a placeholder
            imageView.image = UIImage(systemName: "eyeglasses")
            
            // Simulate image loading
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) { [weak self] in
                self?.imageView.image = UIImage(systemName: "eyeglasses")
            }
        } else {
            imageView.image = UIImage(systemName: "eyeglasses")
        }
    }
}

// MARK: - ProductDetailViewController

class ProductDetailViewController: UIViewController {
    
    private let product: Product
    
    init(product: Product) {
        self.product = product
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .systemBackground
        title = product.name
        
        // This is a placeholder implementation
        // In a real app, implement a proper product detail view
        let label = UILabel()
        label.translatesAutoresizingMaskIntoConstraints = false
        label.text = "Product Detail View\nTo be implemented"
        label.textAlignment = .center
        label.numberOfLines = 0
        view.addSubview(label)
        
        NSLayoutConstraint.activate([
            label.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            label.centerYAnchor.constraint(equalTo: view.centerYAnchor)
        ])
    }
} 