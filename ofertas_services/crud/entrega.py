from sqlalchemy.orm import Session
from models import Entrega
from schemas import EntregaCreate

def crear_entrega(db: Session, entrega: EntregaCreate):
    nueva = Entrega(**entrega.dict())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

def obtener_todas(db: Session):
    return db.query(Entrega).all()

def obtener_por_id(db: Session, entrega_id: int):
    return db.query(Entrega).filter(Entrega.id == entrega_id).first()

def actualizar_entrega(db: Session, entrega_id: int, datos: dict):
    entrega = obtener_por_id(db, entrega_id)
    if entrega:
        for key, value in datos.items():
            setattr(entrega, key, value)
        db.commit()
        db.refresh(entrega)
    return entrega

def eliminar_entrega(db: Session, entrega_id: int):
    entrega = obtener_por_id(db, entrega_id)
    if entrega:
        db.delete(entrega)
        db.commit()
    return entrega