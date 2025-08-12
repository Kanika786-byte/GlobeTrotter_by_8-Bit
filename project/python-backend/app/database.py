import databases
import sqlalchemy
from sqlalchemy import create_engine, MetaData
from decouple import config

DATABASE_URL = config("DATABASE_URL", default="sqlite:///./globe_trotter.db")

# For SQLite in development
if DATABASE_URL.startswith("sqlite"):
    database = databases.Database(DATABASE_URL)
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    # For PostgreSQL in production
    database = databases.Database(DATABASE_URL)
    engine = create_engine(DATABASE_URL)

metadata = MetaData()

# Users table
users_table = sqlalchemy.Table(
    "users",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.String, primary_key=True),
    sqlalchemy.Column("email", sqlalchemy.String, unique=True, index=True),
    sqlalchemy.Column("google_id", sqlalchemy.String, unique=True, nullable=True),
    sqlalchemy.Column("first_name", sqlalchemy.String),
    sqlalchemy.Column("last_name", sqlalchemy.String),
    sqlalchemy.Column("profile_image_url", sqlalchemy.String, nullable=True),
    sqlalchemy.Column("is_active", sqlalchemy.Boolean, default=True),
    sqlalchemy.Column("travel_preferences", sqlalchemy.JSON, nullable=True),
    sqlalchemy.Column("created_at", sqlalchemy.DateTime, server_default=sqlalchemy.func.now()),
    sqlalchemy.Column("updated_at", sqlalchemy.DateTime, server_default=sqlalchemy.func.now(), onupdate=sqlalchemy.func.now()),
)

# Destinations table
destinations_table = sqlalchemy.Table(
    "destinations",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.String, primary_key=True),
    sqlalchemy.Column("name", sqlalchemy.String, index=True),
    sqlalchemy.Column("city", sqlalchemy.String),
    sqlalchemy.Column("country", sqlalchemy.String, index=True),
    sqlalchemy.Column("continent", sqlalchemy.String),
    sqlalchemy.Column("latitude", sqlalchemy.Float),
    sqlalchemy.Column("longitude", sqlalchemy.Float),
    sqlalchemy.Column("description", sqlalchemy.Text),
    sqlalchemy.Column("short_description", sqlalchemy.String),
    sqlalchemy.Column("avg_rating", sqlalchemy.Float, default=0.0),
    sqlalchemy.Column("review_count", sqlalchemy.Integer, default=0),
    sqlalchemy.Column("average_price", sqlalchemy.Float),
    sqlalchemy.Column("currency", sqlalchemy.String, default="USD"),
    sqlalchemy.Column("safety_index", sqlalchemy.Integer, default=50),
    sqlalchemy.Column("avg_temperature", sqlalchemy.Float),
    sqlalchemy.Column("activity_categories", sqlalchemy.JSON),
    sqlalchemy.Column("image_url", sqlalchemy.String),
    sqlalchemy.Column("is_featured", sqlalchemy.Boolean, default=False),
    sqlalchemy.Column("is_active", sqlalchemy.Boolean, default=True),
    sqlalchemy.Column("created_at", sqlalchemy.DateTime, server_default=sqlalchemy.func.now()),
)

# Trips table
trips_table = sqlalchemy.Table(
    "trips",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.String, primary_key=True),
    sqlalchemy.Column("user_id", sqlalchemy.String, sqlalchemy.ForeignKey("users.id")),
    sqlalchemy.Column("title", sqlalchemy.String),
    sqlalchemy.Column("description", sqlalchemy.Text, nullable=True),
    sqlalchemy.Column("start_date", sqlalchemy.Date),
    sqlalchemy.Column("end_date", sqlalchemy.Date),
    sqlalchemy.Column("traveler_count", sqlalchemy.Integer, default=1),
    sqlalchemy.Column("total_budget", sqlalchemy.Float),
    sqlalchemy.Column("currency", sqlalchemy.String, default="USD"),
    sqlalchemy.Column("status", sqlalchemy.String, default="draft"),
    sqlalchemy.Column("privacy_level", sqlalchemy.String, default="private"),
    sqlalchemy.Column("destinations", sqlalchemy.JSON),  # Array of destination IDs with details
    sqlalchemy.Column("ai_suggestions", sqlalchemy.JSON, nullable=True),
    sqlalchemy.Column("created_at", sqlalchemy.DateTime, server_default=sqlalchemy.func.now()),
    sqlalchemy.Column("updated_at", sqlalchemy.DateTime, server_default=sqlalchemy.func.now(), onupdate=sqlalchemy.func.now()),
)

# Bookings table
bookings_table = sqlalchemy.Table(
    "bookings",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.String, primary_key=True),
    sqlalchemy.Column("user_id", sqlalchemy.String, sqlalchemy.ForeignKey("users.id")),
    sqlalchemy.Column("trip_id", sqlalchemy.String, sqlalchemy.ForeignKey("trips.id"), nullable=True),
    sqlalchemy.Column("booking_type", sqlalchemy.String),  # flight, hotel, activity, transport
    sqlalchemy.Column("status", sqlalchemy.String, default="pending"),
    sqlalchemy.Column("amount", sqlalchemy.Float),
    sqlalchemy.Column("currency", sqlalchemy.String, default="USD"),
    sqlalchemy.Column("booking_details", sqlalchemy.JSON),
    sqlalchemy.Column("service_date", sqlalchemy.Date),
    sqlalchemy.Column("created_at", sqlalchemy.DateTime, server_default=sqlalchemy.func.now()),
)

# Reviews table
reviews_table = sqlalchemy.Table(
    "reviews",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.String, primary_key=True),
    sqlalchemy.Column("user_id", sqlalchemy.String, sqlalchemy.ForeignKey("users.id")),
    sqlalchemy.Column("destination_id", sqlalchemy.String, sqlalchemy.ForeignKey("destinations.id")),
    sqlalchemy.Column("trip_id", sqlalchemy.String, sqlalchemy.ForeignKey("trips.id"), nullable=True),
    sqlalchemy.Column("rating", sqlalchemy.Integer),
    sqlalchemy.Column("title", sqlalchemy.String, nullable=True),
    sqlalchemy.Column("content", sqlalchemy.Text),
    sqlalchemy.Column("is_approved", sqlalchemy.Boolean, default=True),
    sqlalchemy.Column("helpful_votes", sqlalchemy.Integer, default=0),
    sqlalchemy.Column("created_at", sqlalchemy.DateTime, server_default=sqlalchemy.func.now()),
)