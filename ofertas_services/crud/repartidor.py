from sqlalchemy.orm import Session
from models import Repartidor
from schemas import RepartidorCreate

def crear_repartidor(db: Session, repartidor: RepartidorCreate):
    nuevo = Repartidor(**repartidor.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

def obtener_todos(db: Session):
    return db.query(Repartidor).all()

def obtener_por_id(db: Session, repartidor_id: int):
    return db.query(Repartidor).filter(Repartidor.id == repartidor_id).first()

def actualizar_repartidor(db: Session, repartidor_id: int, datos: dict):
    repartidor = obtener_por_id(db, repartidor_id)
    if repartidor:
        for key, value in datos.items():
            setattr(repartidor, key, value)
        db.commit()
        db.refresh(repartidor)
    return repartidor

def eliminar_repartidor(db: Session, repartidor_id: int):
    repartidor = obtener_por_id(db, repartidor_id)
    if repartidor:
        db.delete(repartidor)
        db.commit()
    return repartidor
