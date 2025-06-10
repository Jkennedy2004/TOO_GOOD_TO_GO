from sqlalchemy.orm import Session
from models import ReporteLogistica
from schemas import ReporteLogisticaCreate

def crear_reporte(db: Session, reporte: ReporteLogisticaCreate):
    nuevo = ReporteLogistica(**reporte.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

def obtener_todos(db: Session):
    return db.query(ReporteLogistica).all()

def obtener_por_id(db: Session, reporte_id: int):
    return db.query(ReporteLogistica).filter(ReporteLogistica.id == reporte_id).first()

def actualizar_reporte(db: Session, reporte_id: int, datos: dict):
    reporte = obtener_por_id(db, reporte_id)
    if reporte:
        for key, value in datos.items():
            setattr(reporte, key, value)
        db.commit()
        db.refresh(reporte)
    return reporte

def eliminar_reporte(db: Session, reporte_id: int):
    reporte = obtener_por_id(db, reporte_id)
    if reporte:
        db.delete(reporte)
        db.commit()
    return reporte
