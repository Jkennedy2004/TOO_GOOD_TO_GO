from sqlalchemy import Column, Integer, String, Float, DateTime
from database import Base

class InventarioProducto(Base):
    __tablename__ = "inventario_producto"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    cantidad = Column(Integer, nullable=False)
    precio_unitario = Column(Float, nullable=False)
    fecha_ingreso = Column(DateTime, nullable=False)
    estado = Column(String, nullable=False)  # Disponible, Vendido, Expirado
