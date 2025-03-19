from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from models import Product, FrameShape, FrameMaterial, LensType
from config.database import db

products = Blueprint('products', __name__, url_prefix='/api/products')

@products.route('', methods=['GET'])
def get_products():
    """Get all products with optional filtering."""
    # Get filter parameters
    brand = request.args.get('brand')
    frame_shape = request.args.get('frame_shape')
    frame_material = request.args.get('frame_material')
    lens_type = request.args.get('lens_type')
    gender = request.args.get('gender')
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    face_shape = request.args.get('face_shape')
    
    # Start with base query
    query = Product.query.filter_by(is_available=True)
    
    # Apply filters if provided
    if brand:
        query = query.filter(Product.brand.ilike(f'%{brand}%'))
    
    if frame_shape:
        try:
            shape_enum = FrameShape[frame_shape.upper()]
            query = query.filter_by(frame_shape=shape_enum)
        except (KeyError, ValueError):
            # Invalid frame shape
            pass
    
    if frame_material:
        try:
            material_enum = FrameMaterial[frame_material.upper()]
            query = query.filter_by(frame_material=material_enum)
        except (KeyError, ValueError):
            # Invalid material
            pass
    
    if lens_type:
        try:
            lens_enum = LensType[lens_type.upper()]
            query = query.filter_by(lens_type=lens_enum)
        except (KeyError, ValueError):
            # Invalid lens type
            pass
    
    if gender:
        query = query.filter(Product.gender.ilike(f'%{gender}%'))
    
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    
    if face_shape:
        query = query.filter(Product.face_shapes.ilike(f'%{face_shape}%'))
    
    # Get sort parameters
    sort_by = request.args.get('sort_by', 'price')
    sort_order = request.args.get('sort_order', 'asc')
    
    # Apply sorting
    if sort_by == 'price':
        if sort_order == 'desc':
            query = query.order_by(Product.price.desc())
        else:
            query = query.order_by(Product.price.asc())
    elif sort_by == 'name':
        if sort_order == 'desc':
            query = query.order_by(Product.name.desc())
        else:
            query = query.order_by(Product.name.asc())
    
    # Get pagination parameters
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    # Apply pagination
    paginated_products = query.paginate(page=page, per_page=per_page, error_out=False)
    
    # Prepare response
    products_list = []
    for product in paginated_products.items:
        products_list.append(product.to_dict())
    
    return jsonify({
        'products': products_list,
        'total': paginated_products.total,
        'pages': paginated_products.pages,
        'page': page,
        'per_page': per_page
    }), 200

@products.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Get a single product by ID."""
    product = Product.query.get(product_id)
    
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    if not product.is_available:
        return jsonify({'error': 'Product is not available'}), 410
    
    return jsonify(product.to_dict()), 200

@products.route('/recommended', methods=['GET'])
def get_recommended_products():
    """Get recommended products based on query parameters."""
    # Get recommendation parameters
    face_shape = request.args.get('face_shape')
    frame_style = request.args.get('frame_style')
    color = request.args.get('color')
    gender = request.args.get('gender', 'unisex')
    
    # Start with base query
    query = Product.query.filter_by(is_available=True)
    
    # Apply filters if provided
    if face_shape:
        query = query.filter(Product.face_shapes.ilike(f'%{face_shape}%'))
    
    if frame_style and frame_style.upper() in FrameShape.__members__:
        shape_enum = FrameShape[frame_style.upper()]
        query = query.filter_by(frame_shape=shape_enum)
    
    if color:
        query = query.filter(Product.frame_color.ilike(f'%{color}%'))
    
    if gender:
        query = query.filter(Product.gender.ilike(f'%{gender}%'))
    
    # Limit to 10 products
    products_list = query.limit(10).all()
    
    # Prepare response
    result = []
    for product in products_list:
        result.append(product.to_dict())
    
    return jsonify(result), 200

@products.route('/brands', methods=['GET'])
def get_brands():
    """Get list of available brands."""
    brands = db.session.query(Product.brand).distinct().all()
    brand_list = [brand[0] for brand in brands if brand[0]]
    
    return jsonify(brand_list), 200

@products.route('/frame-shapes', methods=['GET'])
def get_frame_shapes():
    """Get list of available frame shapes."""
    shapes = {}
    for shape in FrameShape:
        shapes[shape.name.lower()] = shape.value
    
    return jsonify(shapes), 200

@products.route('/frame-materials', methods=['GET'])
def get_frame_materials():
    """Get list of available frame materials."""
    materials = {}
    for material in FrameMaterial:
        materials[material.name.lower()] = material.value
    
    return jsonify(materials), 200

@products.route('/lens-types', methods=['GET'])
def get_lens_types():
    """Get list of available lens types."""
    types = {}
    for lens_type in LensType:
        types[lens_type.name.lower()] = lens_type.value
    
    return jsonify(types), 200

@products.route('/search', methods=['GET'])
def search_products():
    """Search products by keyword."""
    keyword = request.args.get('q', '')
    
    if not keyword:
        return jsonify({'error': 'Search keyword is required'}), 400
    
    # Search in name, description, and brand
    query = Product.query.filter(
        (Product.name.ilike(f'%{keyword}%')) | 
        (Product.description.ilike(f'%{keyword}%')) | 
        (Product.brand.ilike(f'%{keyword}%'))
    ).filter_by(is_available=True)
    
    # Get pagination parameters
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    # Apply pagination
    paginated_products = query.paginate(page=page, per_page=per_page, error_out=False)
    
    # Prepare response
    products_list = []
    for product in paginated_products.items:
        products_list.append(product.to_dict())
    
    return jsonify({
        'products': products_list,
        'total': paginated_products.total,
        'pages': paginated_products.pages,
        'page': page,
        'per_page': per_page
    }), 200 