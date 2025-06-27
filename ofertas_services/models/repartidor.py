# models/repartidor.py
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base

class Repartidor(Base):
    __tablename__ = "repartidor"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    telefono = Column(String, nullable=False)
    zona = Column(String)  # Norte, Sur, Centro, etc.

    entregas = relationship("Entrega", back_populates="repartidor", cascade="all, delete-orphan", lazy='select')
    rutas = relationship("RutaEntrega", back_populates="repartidor", cascade="all, delete-orphan", lazy='select')
