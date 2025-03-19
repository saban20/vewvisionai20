import UIKit

class MainTabBarController: UITabBarController {
    
    // MARK: - Lifecycle Methods
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupViewControllers()
        setupAppearance()
    }
    
    // MARK: - Setup Methods
    
    private func setupViewControllers() {
        // Home Tab
        let homeVC = HomeViewController()
        let homeNav = UINavigationController(rootViewController: homeVC)
        homeNav.tabBarItem = UITabBarItem(
            title: "Home",
            image: UIImage(systemName: "house"),
            selectedImage: UIImage(systemName: "house.fill")
        )
        
        // Face Scanner Tab
        let faceScannerVC = FaceScannerViewController()
        let scannerNav = UINavigationController(rootViewController: faceScannerVC)
        scannerNav.tabBarItem = UITabBarItem(
            title: "Scan",
            image: UIImage(systemName: "face.smiling"),
            selectedImage: UIImage(systemName: "face.smiling.fill")
        )
        
        // Shop Tab
        let shopVC = ShopViewController()
        let shopNav = UINavigationController(rootViewController: shopVC)
        shopNav.tabBarItem = UITabBarItem(
            title: "Shop",
            image: UIImage(systemName: "eyeglasses"),
            selectedImage: UIImage(systemName: "eyeglasses")
        )
        
        // Profile Tab
        let profileVC = ProfileViewController()
        let profileNav = UINavigationController(rootViewController: profileVC)
        profileNav.tabBarItem = UITabBarItem(
            title: "Profile",
            image: UIImage(systemName: "person"),
            selectedImage: UIImage(systemName: "person.fill")
        )
        
        // Set view controllers
        viewControllers = [homeNav, scannerNav, shopNav, profileNav]
        
        // Set default tab
        selectedIndex = 0
    }
    
    private func setupAppearance() {
        // Tab bar appearance
        tabBar.tintColor = UIColor(red: 0.0, green: 0.8, blue: 0.6, alpha: 1.0)
        tabBar.unselectedItemTintColor = .systemGray2
        
        // For iOS 15+
        if #available(iOS 15.0, *) {
            let appearance = UITabBarAppearance()
            appearance.configureWithOpaqueBackground()
            appearance.backgroundColor = .systemBackground
            
            tabBar.standardAppearance = appearance
            tabBar.scrollEdgeAppearance = appearance
        }
    }
}

// MARK: - Home View Controller (Placeholder)
class HomeViewController: UIViewController {
    
    private let welcomeLabel = UILabel()
    private let featuresTableView = UITableView(frame: .zero, style: .insetGrouped)
    private let scanActionButton = UIButton(type: .system)
    
    // MARK: - Lifecycle Methods
    
    override func viewDidLoad() {
        super.viewDidLoad()
        title = "NewVision AI"
        view.backgroundColor = .systemBackground
        setupViews()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.navigationBar.prefersLargeTitles = true
    }
    
    // MARK: - Setup Methods
    
    private func setupViews() {
        // Welcome label
        welcomeLabel.translatesAutoresizingMaskIntoConstraints = false
        welcomeLabel.text = "Welcome to NewVision AI"
        welcomeLabel.font = UIFont.systemFont(ofSize: 24, weight: .bold)
        welcomeLabel.textAlignment = .center
        view.addSubview(welcomeLabel)
        
        // Scan action button
        scanActionButton.translatesAutoresizingMaskIntoConstraints = false
        scanActionButton.setTitle("Start Face Scan", for: .normal)
        scanActionButton.titleLabel?.font = UIFont.systemFont(ofSize: 18, weight: .semibold)
        scanActionButton.backgroundColor = UIColor(red: 0.0, green: 0.8, blue: 0.6, alpha: 1.0)
        scanActionButton.setTitleColor(.white, for: .normal)
        scanActionButton.layer.cornerRadius = 12
        scanActionButton.addTarget(self, action: #selector(startScanTapped), for: .touchUpInside)
        view.addSubview(scanActionButton)
        
        // Features table view (placeholder)
        featuresTableView.translatesAutoresizingMaskIntoConstraints = false
        featuresTableView.register(UITableViewCell.self, forCellReuseIdentifier: "FeatureCell")
        featuresTableView.delegate = self
        featuresTableView.dataSource = self
        view.addSubview(featuresTableView)
        
        // Set up constraints
        NSLayoutConstraint.activate([
            welcomeLabel.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 20),
            welcomeLabel.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            welcomeLabel.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            
            featuresTableView.topAnchor.constraint(equalTo: welcomeLabel.bottomAnchor, constant: 20),
            featuresTableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            featuresTableView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            featuresTableView.bottomAnchor.constraint(equalTo: scanActionButton.topAnchor, constant: -20),
            
            scanActionButton.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 40),
            scanActionButton.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -40),
            scanActionButton.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -30),
            scanActionButton.heightAnchor.constraint(equalToConstant: 50)
        ])
    }
    
    // MARK: - Action Methods
    
    @objc private func startScanTapped() {
        let faceScannerVC = FaceScannerViewController()
        navigationController?.pushViewController(faceScannerVC, animated: true)
    }
}

// MARK: - UITableViewDelegate, UITableViewDataSource
extension HomeViewController: UITableViewDelegate, UITableViewDataSource {
    func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 3
    }
    
    func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        return "Features"
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "FeatureCell", for: indexPath)
        
        var content = cell.defaultContentConfiguration()
        
        switch indexPath.row {
        case 0:
            content.text = "Face Scanning"
            content.secondaryText = "Scan your face to get precise measurements"
            content.image = UIImage(systemName: "face.smiling")
        case 1:
            content.text = "Eyewear Recommendations"
            content.secondaryText = "Get personalized eyewear recommendations"
            content.image = UIImage(systemName: "eyeglasses")
        case 2:
            content.text = "Virtual Try-On"
            content.secondaryText = "Try on glasses virtually before buying"
            content.image = UIImage(systemName: "arkit")
        default:
            break
        }
        
        content.imageProperties.tintColor = UIColor(red: 0.0, green: 0.8, blue: 0.6, alpha: 1.0)
        cell.contentConfiguration = content
        
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        
        switch indexPath.row {
        case 0:
            let faceScannerVC = FaceScannerViewController()
            navigationController?.pushViewController(faceScannerVC, animated: true)
        case 1:
            let alert = UIAlertController(title: "Coming Soon", message: "This feature is under development", preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "OK", style: .default))
            present(alert, animated: true)
        case 2:
            let alert = UIAlertController(title: "Coming Soon", message: "Virtual try-on will be available in the next update", preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "OK", style: .default))
            present(alert, animated: true)
        default:
            break
        }
    }
}

// MARK: - Shop View Controller (Placeholder)
class ShopViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        title = "Shop"
        view.backgroundColor = .systemBackground
        
        // This is a placeholder implementation
        let label = UILabel()
        label.translatesAutoresizingMaskIntoConstraints = false
        label.text = "Shop View\nTo be implemented"
        label.textAlignment = .center
        label.numberOfLines = 0
        view.addSubview(label)
        
        NSLayoutConstraint.activate([
            label.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            label.centerYAnchor.constraint(equalTo: view.centerYAnchor)
        ])
    }
}

// MARK: - Profile View Controller (Placeholder)
class ProfileViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        title = "My Profile"
        view.backgroundColor = .systemBackground
        
        // This is a placeholder implementation
        let label = UILabel()
        label.translatesAutoresizingMaskIntoConstraints = false
        label.text = "Profile View\nTo be implemented"
        label.textAlignment = .center
        label.numberOfLines = 0
        view.addSubview(label)
        
        NSLayoutConstraint.activate([
            label.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            label.centerYAnchor.constraint(equalTo: view.centerYAnchor)
        ])
    }
} 