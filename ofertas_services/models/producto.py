from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Producto(Base):
    __tablename__ = "producto"

    id_producto = Column(Integer, primary_key=True, index=True)  # igual que TS
    nombre = Column(String, nullable=False)
    descripcion = Column(Text, nullable=True)
    precio_original = Column(Float, nullable=False)
    precio_descuento = Column(Float, nullable=False)
    cantidad_disponible = Column(Integer, nullable=False)
    fecha_caducidad = Column(DateTime, nullable=False)
    activo = Column(Boolean, default=True)
    imagen_url = Column(String, nullable=True)
    fecha_creacion = Column(DateTime)

    # Relación con restaurante (opcional si tienen modelo Restaurante en Python)
    restaurante_id = Column(Integer, ForeignKey("restaurante.id"))  # asumiendo
    # restaurante = relationship("Restaurante", back_populates="productos")

    # Reservas (si tienes modelo Reserva)
    # reservas = relationship("Reserva", back_populates="producto")
