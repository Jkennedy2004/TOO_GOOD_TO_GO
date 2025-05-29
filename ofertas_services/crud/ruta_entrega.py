from sqlalchemy.orm import Session
from models import RutaEntrega
from schemas import RutaEntregaCreate

def crear_ruta(db: Session, ruta: RutaEntregaCreate):
    nueva = RutaEntrega(**ruta.dict())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

def obtener_todas(db: Session):
    return db.query(RutaEntrega).all()

def obtener_por_id(db: Session, ruta_id: int):
    return db.query(RutaEntrega).filter(RutaEntrega.id == ruta_id).first()

def actualizar_ruta(db: Session, ruta_id: int, datos: dict):
    ruta = obtener_por_id(db, ruta_id)
    if ruta:
        for key, value in datos.items():
            setattr(ruta, key, value)
        db.commit()
        db.refresh(ruta)
    return ruta

def eliminar_ruta(db: Session, ruta_id: int):
    ruta = obtener_por_id(db, ruta_id)
    if ruta:
        db.delete(ruta)
        db.commit()
    return ruta
