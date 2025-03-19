import Foundation

// MARK: - APIError
enum APIError: Error {
    case invalidURL
    case requestFailed(Error)
    case invalidResponse
    case decodingFailed(Error)
    case serverError(statusCode: Int, message: String?)
    case unauthorized
    case notFound
    case networkUnavailable
    case unknown
    
    var localizedDescription: String {
        switch self {
        case .invalidURL:
            return "Invalid URL"
        case .requestFailed(let error):
            return "Request failed: \(error.localizedDescription)"
        case .invalidResponse:
            return "Invalid response from server"
        case .decodingFailed(let error):
            return "Failed to decode response: \(error.localizedDescription)"
        case .serverError(let statusCode, let message):
            if let message = message {
                return "Server error (\(statusCode)): \(message)"
            }
            return "Server error (\(statusCode))"
        case .unauthorized:
            return "You are not authorized to perform this action"
        case .notFound:
            return "The requested resource was not found"
        case .networkUnavailable:
            return "Network connection appears to be offline"
        case .unknown:
            return "An unknown error occurred"
        }
    }
}

// MARK: - HTTPMethod
enum HTTPMethod: String {
    case get = "GET"
    case post = "POST"
    case put = "PUT"
    case delete = "DELETE"
}

// MARK: - APIService
class APIService {
    
    // MARK: - Properties
    static let shared = APIService()
    
    private let baseURL = "https://api.newvisionai.com"  // Replace with your actual API base URL
    private let session = URLSession.shared
    private var authToken: String?
    
    private init() {}
    
    // MARK: - Authentication
    
    func setAuthToken(_ token: String) {
        self.authToken = token
        UserDefaults.standard.set(token, forKey: "authToken")
    }
    
    func clearAuthToken() {
        self.authToken = nil
        UserDefaults.standard.removeObject(forKey: "authToken")
    }
    
    func loadAuthToken() {
        if let token = UserDefaults.standard.string(forKey: "authToken") {
            self.authToken = token
        }
    }
    
    // MARK: - Request Methods
    
    func request<T: Decodable>(endpoint: String, method: HTTPMethod = .get, parameters: [String: Any]? = nil, body: Data? = nil, completion: @escaping (Result<T, APIError>) -> Void) {
        
        guard let url = URL(string: "\(baseURL)/\(endpoint)") else {
            completion(.failure(.invalidURL))
            return
        }
        
        // Create the URL request
        var request = URLRequest(url: url)
        request.httpMethod = method.rawValue
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        
        // Add authentication token if available
        if let token = authToken {
            request.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        
        // Add query parameters for GET requests
        if method == .get, let parameters = parameters {
            var components = URLComponents(url: url, resolvingAgainstBaseURL: true)!
            components.queryItems = parameters.map { key, value in
                URLQueryItem(name: key, value: "\(value)")
            }
            if let url = components.url {
                request.url = url
            }
        }
        
        // Add body for POST, PUT requests
        if method == .post || method == .put {
            if let jsonData = body {
                request.httpBody = jsonData
            } else if let parameters = parameters {
                do {
                    request.httpBody = try JSONSerialization.data(withJSONObject: parameters, options: [])
                } catch {
                    completion(.failure(.requestFailed(error)))
                    return
                }
            }
        }
        
        // Create data task
        let task = session.dataTask(with: request) { data, response, error in
            // Handle network errors
            if let error = error {
                completion(.failure(.requestFailed(error)))
                return
            }
            
            // Check for valid HTTP response
            guard let httpResponse = response as? HTTPURLResponse else {
                completion(.failure(.invalidResponse))
                return
            }
            
            // Handle HTTP status codes
            switch httpResponse.statusCode {
            case 200...299:
                // Success
                guard let data = data else {
                    completion(.failure(.invalidResponse))
                    return
                }
                
                do {
                    let decoded = try JSONDecoder().decode(T.self, from: data)
                    completion(.success(decoded))
                } catch {
                    completion(.failure(.decodingFailed(error)))
                }
                
            case 401:
                completion(.failure(.unauthorized))
                
            case 404:
                completion(.failure(.notFound))
                
            default:
                // Attempt to parse error message from response
                var message: String?
                if let data = data {
                    do {
                        if let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
                           let errorMessage = json["error"] as? String {
                            message = errorMessage
                        }
                    } catch {
                        // Ignore parsing errors for error messages
                    }
                }
                
                completion(.failure(.serverError(statusCode: httpResponse.statusCode, message: message)))
            }
        }
        
        task.resume()
    }
    
    // MARK: - Convenience Methods
    
    func get<T: Decodable>(endpoint: String, parameters: [String: Any]? = nil, completion: @escaping (Result<T, APIError>) -> Void) {
        request(endpoint: endpoint, method: .get, parameters: parameters, completion: completion)
    }
    
    func post<T: Decodable>(endpoint: String, parameters: [String: Any]? = nil, completion: @escaping (Result<T, APIError>) -> Void) {
        request(endpoint: endpoint, method: .post, parameters: parameters, completion: completion)
    }
    
    func put<T: Decodable>(endpoint: String, parameters: [String: Any]? = nil, completion: @escaping (Result<T, APIError>) -> Void) {
        request(endpoint: endpoint, method: .put, parameters: parameters, completion: completion)
    }
    
    func delete<T: Decodable>(endpoint: String, completion: @escaping (Result<T, APIError>) -> Void) {
        request(endpoint: endpoint, method: .delete, completion: completion)
    }
    
    // MARK: - File Upload
    
    func uploadImage(endpoint: String, imageData: Data, fileName: String, completion: @escaping (Result<[String: Any], APIError>) -> Void) {
        guard let url = URL(string: "\(baseURL)/\(endpoint)") else {
            completion(.failure(.invalidURL))
            return
        }
        
        // Create multipart request
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        
        // Add authentication token if available
        if let token = authToken {
            request.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        
        // Generate boundary string
        let boundary = "Boundary-\(UUID().uuidString)"
        request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")
        
        // Create multipart form data
        var body = Data()
        
        // Add image data
        body.append("--\(boundary)\r\n".data(using: .utf8)!)
        body.append("Content-Disposition: form-data; name=\"face_scan\"; filename=\"\(fileName)\"\r\n".data(using: .utf8)!)
        body.append("Content-Type: image/jpeg\r\n\r\n".data(using: .utf8)!)
        body.append(imageData)
        body.append("\r\n".data(using: .utf8)!)
        
        // Close multipart form
        body.append("--\(boundary)--\r\n".data(using: .utf8)!)
        
        request.httpBody = body
        
        // Create data task
        let task = session.dataTask(with: request) { data, response, error in
            // Handle network errors
            if let error = error {
                completion(.failure(.requestFailed(error)))
                return
            }
            
            // Check for valid HTTP response
            guard let httpResponse = response as? HTTPURLResponse else {
                completion(.failure(.invalidResponse))
                return
            }
            
            // Handle HTTP status codes
            switch httpResponse.statusCode {
            case 200...299:
                // Success
                guard let data = data else {
                    completion(.failure(.invalidResponse))
                    return
                }
                
                do {
                    if let json = try JSONSerialization.jsonObject(with: data) as? [String: Any] {
                        completion(.success(json))
                    } else {
                        completion(.failure(.invalidResponse))
                    }
                } catch {
                    completion(.failure(.decodingFailed(error)))
                }
                
            case 401:
                completion(.failure(.unauthorized))
                
            case 404:
                completion(.failure(.notFound))
                
            default:
                // Attempt to parse error message from response
                var message: String?
                if let data = data {
                    do {
                        if let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
                           let errorMessage = json["error"] as? String {
                            message = errorMessage
                        }
                    } catch {
                        // Ignore parsing errors for error messages
                    }
                }
                
                completion(.failure(.serverError(statusCode: httpResponse.statusCode, message: message)))
            }
        }
        
        task.resume()
    }
}

// MARK: - API Endpoints

extension APIService {
    // Auth endpoints
    func login(email: String, password: String, completion: @escaping (Result<[String: Any], APIError>) -> Void) {
        let parameters: [String: Any] = [
            "email": email,
            "password": password
        ]
        
        request(endpoint: "api/auth/login", method: .post, parameters: parameters, completion: completion)
    }
    
    func register(email: String, username: String, password: String, completion: @escaping (Result<[String: Any], APIError>) -> Void) {
        let parameters: [String: Any] = [
            "email": email,
            "username": username,
            "password": password
        ]
        
        request(endpoint: "api/auth/register", method: .post, parameters: parameters, completion: completion)
    }
    
    func logout(completion: @escaping (Result<[String: Any], APIError>) -> Void) {
        request(endpoint: "api/auth/logout", method: .post, completion: completion)
    }
    
    // User endpoints
    func getUserProfile(completion: @escaping (Result<[String: Any], APIError>) -> Void) {
        request(endpoint: "api/user/profile", method: .get, completion: completion)
    }
    
    func updateUserProfile(parameters: [String: Any], completion: @escaping (Result<[String: Any], APIError>) -> Void) {
        request(endpoint: "api/user/profile", method: .put, parameters: parameters, completion: completion)
    }
    
    // Face scanner endpoints
    func uploadFaceScan(imageData: Data, completion: @escaping (Result<[String: Any], APIError>) -> Void) {
        uploadImage(endpoint: "api/face-scanner/upload", imageData: imageData, fileName: "face_scan.jpg", completion: completion)
    }
    
    func processFaceScan(scanId: String, completion: @escaping (Result<[String: Any], APIError>) -> Void) {
        request(endpoint: "api/face-scanner/process/\(scanId)", method: .get, completion: completion)
    }
    
    func analyzeMeasurement(measurementId: Int, parameters: [String: Any]? = nil, completion: @escaping (Result<[String: Any], APIError>) -> Void) {
        request(endpoint: "api/face-scanner/analyze/\(measurementId)", method: .post, parameters: parameters, completion: completion)
    }
    
    // Measurements endpoints
    func getMeasurements(completion: @escaping (Result<[[String: Any]], APIError>) -> Void) {
        request(endpoint: "api/measurements", method: .get, completion: completion)
    }
    
    func getMeasurement(id: Int, completion: @escaping (Result<[String: Any], APIError>) -> Void) {
        request(endpoint: "api/measurements/\(id)", method: .get, completion: completion)
    }
    
    func createMeasurement(parameters: [String: Any], completion: @escaping (Result<[String: Any], APIError>) -> Void) {
        request(endpoint: "api/measurements", method: .post, parameters: parameters, completion: completion)
    }
    
    // Products endpoints
    func getProducts(parameters: [String: Any]? = nil, completion: @escaping (Result<[String: Any], APIError>) -> Void) {
        request(endpoint: "api/products", method: .get, parameters: parameters, completion: completion)
    }
    
    func getProduct(id: Int, completion: @escaping (Result<[String: Any], APIError>) -> Void) {
        request(endpoint: "api/products/\(id)", method: .get, completion: completion)
    }
    
    func getRecommendedProducts(parameters: [String: Any], completion: @escaping (Result<[[String: Any]], APIError>) -> Void) {
        request(endpoint: "api/products/recommended", method: .get, parameters: parameters, completion: completion)
    }
}

// MARK: - Data extension
extension Data {
    mutating func append(_ string: String) {
        if let data = string.data(using: .utf8) {
            append(data)
        }
    }
} 