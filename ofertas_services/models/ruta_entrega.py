from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base

class RutaEntrega(Base):
    __tablename__ = "ruta_entrega"

    id = Column(Integer, primary_key=True, index=True)
    repartidor_id = Column(Integer, ForeignKey("repartidor.id"))
    destino = Column(String, nullable=False)
    hora_salida = Column(DateTime, nullable=False)
    hora_llegada = Column(DateTime)

    repartidor = relationship("Repartidor")
