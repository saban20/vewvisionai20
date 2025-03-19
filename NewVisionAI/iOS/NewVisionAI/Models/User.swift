import Foundation

struct User: Codable {
    let id: Int
    var username: String
    var email: String
    var firstName: String?
    var lastName: String?
    var profilePicture: String?
    var phoneNumber: String?
    var lastLogin: Date?
    var isActive: Bool
    
    enum CodingKeys: String, CodingKey {
        case id
        case username
        case email
        case firstName = "first_name"
        case lastName = "last_name"
        case profilePicture = "profile_picture"
        case phoneNumber = "phone_number"
        case lastLogin = "last_login"
        case isActive = "is_active"
    }
    
    // MARK: - Computed Properties
    
    var fullName: String {
        if let firstName = firstName, let lastName = lastName {
            return "\(firstName) \(lastName)"
        } else if let firstName = firstName {
            return firstName
        } else if let lastName = lastName {
            return lastName
        } else {
            return username
        }
    }
    
    var initials: String {
        if let firstName = firstName, let lastName = lastName,
           let firstInitial = firstName.first, let lastInitial = lastName.first {
            return String(firstInitial) + String(lastInitial)
        } else if let firstName = firstName, let firstInitial = firstName.first {
            return String(firstInitial)
        } else if let username = username.first {
            return String(username)
        } else {
            return "?"
        }
    }
    
    var profilePictureURL: URL? {
        guard let profilePicture = profilePicture else { return nil }
        
        // If it's already a complete URL
        if profilePicture.hasPrefix("http") {
            return URL(string: profilePicture)
        }
        
        // If it's a relative path on the server
        return URL(string: "https://api.newvisionai.com/\(profilePicture)")
    }
}

// MARK: - UserManager
class UserManager {
    static let shared = UserManager()
    
    private init() {
        loadCurrentUser()
    }
    
    // MARK: - Properties
    
    private(set) var currentUser: User?
    private let userDefaultsKey = "currentUser"
    
    var isLoggedIn: Bool {
        return currentUser != nil && APIService.shared.loadAuthToken() != nil
    }
    
    // MARK: - Public Methods
    
    func login(email: String, password: String, completion: @escaping (Result<User, Error>) -> Void) {
        APIService.shared.login(email: email, password: password) { [weak self] result in
            switch result {
            case .success(let json):
                if let userData = json["user"] as? [String: Any],
                   let tokenData = json["access_token"] as? String {
                    
                    // Save the auth token
                    APIService.shared.setAuthToken(tokenData)
                    
                    // Try to decode the user
                    do {
                        let jsonData = try JSONSerialization.data(withJSONObject: userData, options: [])
                        let user = try JSONDecoder().decode(User.self, from: jsonData)
                        
                        // Save the user
                        self?.currentUser = user
                        self?.saveCurrentUser()
                        
                        // Set login status
                        UserDefaults.standard.set(true, forKey: "isLoggedIn")
                        
                        completion(.success(user))
                    } catch {
                        completion(.failure(error))
                    }
                } else {
                    completion(.failure(APIError.invalidResponse))
                }
                
            case .failure(let error):
                completion(.failure(error))
            }
        }
    }
    
    func register(email: String, username: String, password: String, completion: @escaping (Result<User, Error>) -> Void) {
        APIService.shared.register(email: email, username: username, password: password) { [weak self] result in
            switch result {
            case .success(let json):
                if let userData = json["user"] as? [String: Any],
                   let tokenData = json["access_token"] as? String {
                    
                    // Save the auth token
                    APIService.shared.setAuthToken(tokenData)
                    
                    // Try to decode the user
                    do {
                        let jsonData = try JSONSerialization.data(withJSONObject: userData, options: [])
                        let user = try JSONDecoder().decode(User.self, from: jsonData)
                        
                        // Save the user
                        self?.currentUser = user
                        self?.saveCurrentUser()
                        
                        // Set login status
                        UserDefaults.standard.set(true, forKey: "isLoggedIn")
                        
                        completion(.success(user))
                    } catch {
                        completion(.failure(error))
                    }
                } else {
                    completion(.failure(APIError.invalidResponse))
                }
                
            case .failure(let error):
                completion(.failure(error))
            }
        }
    }
    
    func logout(completion: @escaping (Bool) -> Void) {
        APIService.shared.logout { [weak self] result in
            // Clear local data regardless of API response
            APIService.shared.clearAuthToken()
            UserDefaults.standard.set(false, forKey: "isLoggedIn")
            self?.clearCurrentUser()
            
            switch result {
            case .success:
                completion(true)
            case .failure:
                // Still consider logout successful from the app's perspective
                completion(true)
            }
        }
    }
    
    func updateProfile(parameters: [String: Any], completion: @escaping (Result<User, Error>) -> Void) {
        APIService.shared.updateUserProfile(parameters: parameters) { [weak self] result in
            switch result {
            case .success(let json):
                if let userData = json["user"] as? [String: Any] {
                    // Try to decode the user
                    do {
                        let jsonData = try JSONSerialization.data(withJSONObject: userData, options: [])
                        let user = try JSONDecoder().decode(User.self, from: jsonData)
                        
                        // Save the user
                        self?.currentUser = user
                        self?.saveCurrentUser()
                        
                        completion(.success(user))
                    } catch {
                        completion(.failure(error))
                    }
                } else {
                    completion(.failure(APIError.invalidResponse))
                }
                
            case .failure(let error):
                completion(.failure(error))
            }
        }
    }
    
    func refreshUserProfile(completion: @escaping (Result<User, Error>) -> Void) {
        APIService.shared.getUserProfile { [weak self] result in
            switch result {
            case .success(let json):
                // Try to decode the user
                do {
                    let jsonData = try JSONSerialization.data(withJSONObject: json, options: [])
                    let user = try JSONDecoder().decode(User.self, from: jsonData)
                    
                    // Save the user
                    self?.currentUser = user
                    self?.saveCurrentUser()
                    
                    completion(.success(user))
                } catch {
                    completion(.failure(error))
                }
                
            case .failure(let error):
                completion(.failure(error))
            }
        }
    }
    
    // MARK: - Private Methods
    
    private func saveCurrentUser() {
        guard let user = currentUser else { return }
        
        do {
            let encoder = JSONEncoder()
            let userData = try encoder.encode(user)
            UserDefaults.standard.set(userData, forKey: userDefaultsKey)
        } catch {
            print("Error saving user: \(error)")
        }
    }
    
    private func loadCurrentUser() {
        guard let userData = UserDefaults.standard.data(forKey: userDefaultsKey) else {
            return
        }
        
        do {
            let decoder = JSONDecoder()
            currentUser = try decoder.decode(User.self, from: userData)
        } catch {
            print("Error loading user: \(error)")
        }
    }
    
    private func clearCurrentUser() {
        currentUser = nil
        UserDefaults.standard.removeObject(forKey: userDefaultsKey)
    }
} 