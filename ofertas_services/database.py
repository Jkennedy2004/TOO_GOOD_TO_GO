from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# URL de conexión a PostgreSQL
DATABASE_URL = "postgresql://postgres:1234@localhost:5432/too_good_to_go_db"

# Crear motor de conexión
engine = create_engine(DATABASE_URL)

# Clase base para tus modelos
Base = declarative_base()

# Sesión de base de datos
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependencia para obtener sesión (útil si usas FastAPI u otros frameworks)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
