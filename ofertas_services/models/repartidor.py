from sqlalchemy import Column, Integer, String
from database import Base

class Repartidor(Base):
    __tablename__ = "repartidor"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    telefono = Column(String, nullable=False)
    zona = Column(String)  # Norte, Sur, Centro, etc.
