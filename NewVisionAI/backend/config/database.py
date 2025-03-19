from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# Create SQLAlchemy instance
db = SQLAlchemy()

# Create Migration instance
migrate = Migrate()

# Note: Database models should not be imported here to avoid circular imports.
# Instead, register them in the create_app function after initializing the app. 