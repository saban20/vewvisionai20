import Foundation

// MARK: - Frame Shape
enum FrameShape: String, Codable, CaseIterable {
    case rectangle = "rectangle"
    case round = "round"
    case square = "square"
    case oval = "oval"
    case catEye = "cat_eye"
    case aviator = "aviator"
    case wayfarer = "wayfarer"
    case geometric = "geometric"
    case oversized = "oversized"
    case rimless = "rimless"
    
    var displayName: String {
        switch self {
        case .rectangle: return "Rectangle"
        case .round: return "Round"
        case .square: return "Square"
        case .oval: return "Oval"
        case .catEye: return "Cat Eye"
        case .aviator: return "Aviator"
        case .wayfarer: return "Wayfarer"
        case .geometric: return "Geometric"
        case .oversized: return "Oversized"
        case .rimless: return "Rimless"
        }
    }
}

// MARK: - Frame Material
enum FrameMaterial: String, Codable, CaseIterable {
    case metal = "metal"
    case plastic = "plastic"
    case acetate = "acetate"
    case titanium = "titanium"
    case wood = "wood"
    case carbonFiber = "carbon_fiber"
    case mixed = "mixed"
    
    var displayName: String {
        switch self {
        case .metal: return "Metal"
        case .plastic: return "Plastic"
        case .acetate: return "Acetate"
        case .titanium: return "Titanium"
        case .wood: return "Wood"
        case .carbonFiber: return "Carbon Fiber"
        case .mixed: return "Mixed Materials"
        }
    }
}

// MARK: - Lens Type
enum LensType: String, Codable, CaseIterable {
    case singleVision = "single_vision"
    case bifocal = "bifocal"
    case progressive = "progressive"
    case reading = "reading"
    case blueLight = "blue_light"
    case sunglasses = "sunglasses"
    case polarized = "polarized"
    case transition = "transition"
    
    var displayName: String {
        switch self {
        case .singleVision: return "Single Vision"
        case .bifocal: return "Bifocal"
        case .progressive: return "Progressive"
        case .reading: return "Reading"
        case .blueLight: return "Blue Light"
        case .sunglasses: return "Sunglasses"
        case .polarized: return "Polarized"
        case .transition: return "Transition"
        }
    }
}

// MARK: - Product
struct Product: Codable, Identifiable {
    let id: Int
    let name: String
    let description: String?
    let brand: String?
    let price: Double
    let discountPrice: Double?
    let sku: String
    let stock: Int
    let isAvailable: Bool
    let frameShape: FrameShape
    let frameMaterial: FrameMaterial
    let frameColor: String?
    let lensType: LensType?
    let lensColor: String?
    let frameWidth: Double?
    let templeLength: Double?
    let bridgeWidth: Double?
    let lensWidth: Double?
    let lensHeight: Double?
    let weight: Double?
    let gender: String?
    let faceShapes: String?
    let thumbnailURL: String?
    let imageURLs: String?
    let model3DURL: String?
    
    enum CodingKeys: String, CodingKey {
        case id
        case name
        case description
        case brand
        case price
        case discountPrice = "discount_price"
        case sku
        case stock
        case isAvailable = "is_available"
        case frameShape = "frame_shape"
        case frameMaterial = "frame_material"
        case frameColor = "frame_color"
        case lensType = "lens_type"
        case lensColor = "lens_color"
        case frameWidth = "frame_width"
        case templeLength = "temple_length"
        case bridgeWidth = "bridge_width"
        case lensWidth = "lens_width"
        case lensHeight = "lens_height"
        case weight
        case gender
        case faceShapes = "face_shapes"
        case thumbnailURL = "thumbnail_url"
        case imageURLs = "image_urls"
        case model3DURL = "model_3d_url"
    }
    
    // MARK: - Computed Properties
    
    var actualPrice: Double {
        return discountPrice ?? price
    }
    
    var discountPercentage: Int? {
        guard let discountPrice = discountPrice, discountPrice < price else {
            return nil
        }
        
        let percentage = ((price - discountPrice) / price) * 100
        return Int(percentage)
    }
    
    var isOnSale: Bool {
        return discountPrice != nil && discountPrice! < price
    }
    
    var formattedPrice: String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencyCode = "USD"
        return formatter.string(from: NSNumber(value: price)) ?? "$\(price)"
    }
    
    var formattedDiscountPrice: String? {
        guard let discountPrice = discountPrice else { return nil }
        
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencyCode = "USD"
        return formatter.string(from: NSNumber(value: discountPrice)) ?? "$\(discountPrice)"
    }
    
    var thumbnailImageURL: URL? {
        guard let thumbnailURL = thumbnailURL else { return nil }
        
        if thumbnailURL.hasPrefix("http") {
            return URL(string: thumbnailURL)
        }
        
        return URL(string: "https://api.newvisionai.com/\(thumbnailURL)")
    }
    
    var imageURLList: [URL] {
        guard let imageURLs = imageURLs else { return [] }
        
        do {
            if let jsonArray = try JSONSerialization.jsonObject(with: Data(imageURLs.utf8), options: []) as? [String] {
                return jsonArray.compactMap { urlString in
                    if urlString.hasPrefix("http") {
                        return URL(string: urlString)
                    }
                    return URL(string: "https://api.newvisionai.com/\(urlString)")
                }
            }
        } catch {
            print("Error parsing image URLs: \(error)")
        }
        
        return []
    }
    
    var model3DFileURL: URL? {
        guard let model3DURL = model3DURL else { return nil }
        
        if model3DURL.hasPrefix("http") {
            return URL(string: model3DURL)
        }
        
        return URL(string: "https://api.newvisionai.com/\(model3DURL)")
    }
    
    var suitableFaceShapes: [String] {
        guard let faceShapes = faceShapes else { return [] }
        return faceShapes.split(separator: ",").map { String($0).trimmingCharacters(in: .whitespacesAndNewlines) }
    }
}

// MARK: - ProductSearchFilters
struct ProductSearchFilters {
    var brand: String?
    var frameShape: FrameShape?
    var frameMaterial: FrameMaterial?
    var lensType: LensType?
    var gender: String?
    var minPrice: Double?
    var maxPrice: Double?
    var faceShape: String?
    var sortBy: SortOption = .price
    var sortOrder: SortOrder = .ascending
    
    enum SortOption: String {
        case price = "price"
        case name = "name"
    }
    
    enum SortOrder: String {
        case ascending = "asc"
        case descending = "desc"
    }
    
    var queryParameters: [String: Any] {
        var parameters: [String: Any] = [
            "sort_by": sortBy.rawValue,
            "sort_order": sortOrder.rawValue
        ]
        
        if let brand = brand { parameters["brand"] = brand }
        if let frameShape = frameShape { parameters["frame_shape"] = frameShape.rawValue }
        if let frameMaterial = frameMaterial { parameters["frame_material"] = frameMaterial.rawValue }
        if let lensType = lensType { parameters["lens_type"] = lensType.rawValue }
        if let gender = gender { parameters["gender"] = gender }
        if let minPrice = minPrice { parameters["min_price"] = minPrice }
        if let maxPrice = maxPrice { parameters["max_price"] = maxPrice }
        if let faceShape = faceShape { parameters["face_shape"] = faceShape }
        
        return parameters
    }
}

// MARK: - ProductService
class ProductService {
    static let shared = ProductService()
    
    private init() {}
    
    func getProducts(filters: ProductSearchFilters? = nil, page: Int = 1, completion: @escaping (Result<[Product], Error>) -> Void) {
        var parameters: [String: Any] = ["page": page, "per_page": 20]
        
        if let filters = filters {
            parameters.merge(filters.queryParameters) { (_, new) in new }
        }
        
        APIService.shared.getProducts(parameters: parameters) { result in
            switch result {
            case .success(let json):
                if let productsData = json["products"] as? [[String: Any]] {
                    do {
                        let jsonData = try JSONSerialization.data(withJSONObject: productsData, options: [])
                        let products = try JSONDecoder().decode([Product].self, from: jsonData)
                        completion(.success(products))
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
    
    func getProduct(id: Int, completion: @escaping (Result<Product, Error>) -> Void) {
        APIService.shared.getProduct(id: id) { result in
            switch result {
            case .success(let json):
                do {
                    let jsonData = try JSONSerialization.data(withJSONObject: json, options: [])
                    let product = try JSONDecoder().decode(Product.self, from: jsonData)
                    completion(.success(product))
                } catch {
                    completion(.failure(error))
                }
                
            case .failure(let error):
                completion(.failure(error))
            }
        }
    }
    
    func getRecommendedProducts(faceShape: String? = nil, frameStyle: String? = nil, color: String? = nil, gender: String? = nil, completion: @escaping (Result<[Product], Error>) -> Void) {
        var parameters: [String: Any] = [:]
        
        if let faceShape = faceShape { parameters["face_shape"] = faceShape }
        if let frameStyle = frameStyle { parameters["frame_style"] = frameStyle }
        if let color = color { parameters["color"] = color }
        if let gender = gender { parameters["gender"] = gender }
        
        APIService.shared.getRecommendedProducts(parameters: parameters) { result in
            switch result {
            case .success(let productsData):
                do {
                    let jsonData = try JSONSerialization.data(withJSONObject: productsData, options: [])
                    let products = try JSONDecoder().decode([Product].self, from: jsonData)
                    completion(.success(products))
                } catch {
                    completion(.failure(error))
                }
                
            case .failure(let error):
                completion(.failure(error))
            }
        }
    }
} 