from sqlalchemy import Column, Integer, ForeignKey, DateTime, String
from sqlalchemy.orm import relationship
from database import Base

class ReporteLogistica(Base):
    __tablename__ = "reporte_logistica"

    id = Column(Integer, primary_key=True, index=True)
    repartidor_id = Column(Integer, ForeignKey("repartidor.id"))
    fecha = Column(DateTime, nullable=False)
    descripcion = Column(String)

    repartidor = relationship("Repartidor")
