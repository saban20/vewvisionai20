import enum
from models.base import BaseModel
from config.database import db
from datetime import datetime

class FrameShape(enum.Enum):
    """Enumeration of available frame shapes."""
    RECTANGLE = "rectangle"
    ROUND = "round"
    SQUARE = "square"
    OVAL = "oval"
    CAT_EYE = "cat_eye"
    AVIATOR = "aviator"
    WAYFARER = "wayfarer"
    GEOMETRIC = "geometric"
    OVERSIZED = "oversized"
    RIMLESS = "rimless"

class FrameMaterial(enum.Enum):
    """Enumeration of available frame materials."""
    METAL = "metal"
    PLASTIC = "plastic"
    ACETATE = "acetate"
    TITANIUM = "titanium"
    WOOD = "wood"
    CARBON_FIBER = "carbon_fiber"
    MIXED = "mixed"

class LensType(enum.Enum):
    """Enumeration of available lens types."""
    SINGLE_VISION = "single_vision"
    BIFOCAL = "bifocal"
    PROGRESSIVE = "progressive"
    READING = "reading"
    BLUE_LIGHT = "blue_light"
    SUNGLASSES = "sunglasses"
    POLARIZED = "polarized"
    TRANSITION = "transition"

class Product(BaseModel):
    """Model for eyewear products."""
    
    __tablename__ = 'products'
    
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    brand = db.Column(db.String(100))
    price = db.Column(db.Float, nullable=False)
    discount_price = db.Column(db.Float)
    sku = db.Column(db.String(50), unique=True, nullable=False)
    stock = db.Column(db.Integer, default=0)
    is_available = db.Column(db.Boolean, default=True)
    frame_shape = db.Column(db.Enum(FrameShape), nullable=False)
    frame_material = db.Column(db.Enum(FrameMaterial), nullable=False)
    frame_color = db.Column(db.String(50))
    lens_type = db.Column(db.Enum(LensType))
    lens_color = db.Column(db.String(50))
    frame_width = db.Column(db.Float)
    temple_length = db.Column(db.Float)
    bridge_width = db.Column(db.Float)
    lens_width = db.Column(db.Float)
    lens_height = db.Column(db.Float)
    weight = db.Column(db.Float)  # in grams
    gender = db.Column(db.String(20))  # 'men', 'women', 'unisex'
    face_shapes = db.Column(db.String(255))  # comma-separated list of suitable face shapes
    thumbnail_url = db.Column(db.String(255))
    image_urls = db.Column(db.Text)  # JSON string of image URLs
    model_3d_url = db.Column(db.String(255))  # URL to the 3D model for virtual try-on
    
    # Relationships
    order_items = db.relationship('OrderItem', back_populates='product')
    
    def __repr__(self):
        return f'<Product {self.name}>'

class OrderStatus(enum.Enum):
    """Enumeration of possible order statuses."""
    PENDING = "pending"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    RETURNED = "returned"
    REFUNDED = "refunded"

class Order(BaseModel):
    """Model for customer orders."""
    
    __tablename__ = 'orders'
    
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    order_number = db.Column(db.String(50), unique=True, nullable=False)
    status = db.Column(db.Enum(OrderStatus), default=OrderStatus.PENDING)
    total_amount = db.Column(db.Float, nullable=False)
    discount_amount = db.Column(db.Float, default=0.0)
    shipping_amount = db.Column(db.Float, default=0.0)
    tax_amount = db.Column(db.Float, default=0.0)
    shipping_address = db.Column(db.Text)
    billing_address = db.Column(db.Text)
    payment_method = db.Column(db.String(50))
    payment_id = db.Column(db.String(100))
    shipping_date = db.Column(db.DateTime)
    delivery_date = db.Column(db.DateTime)
    notes = db.Column(db.Text)
    
    # Relationships
    user = db.relationship('User', back_populates='orders')
    items = db.relationship('OrderItem', back_populates='order', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Order {self.order_number}>'

class OrderItem(BaseModel):
    """Model for individual items within an order."""
    
    __tablename__ = 'order_items'
    
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, default=1)
    price = db.Column(db.Float, nullable=False)  # Price at time of order
    discount = db.Column(db.Float, default=0.0)
    prescription_data = db.Column(db.Text)  # JSON string of prescription data
    customization_data = db.Column(db.Text)  # JSON string of customization options
    
    # Relationships
    order = db.relationship('Order', back_populates='items')
    product = db.relationship('Product', back_populates='order_items')
    
    def __repr__(self):
        return f'<OrderItem {self.id} for Order {self.order_id}>' 