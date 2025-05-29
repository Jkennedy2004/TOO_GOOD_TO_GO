from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base

class OfertaReducida(Base):
    __tablename__ = "oferta_reducida"

    id = Column(Integer, primary_key=True, index=True)
    producto_id = Column(Integer, ForeignKey("inventario_producto.id"))
    precio_oferta = Column(Float, nullable=False)
    fecha_inicio = Column(DateTime, nullable=False)
    fecha_fin = Column(DateTime, nullable=False)

    producto = relationship("InventarioProducto")
