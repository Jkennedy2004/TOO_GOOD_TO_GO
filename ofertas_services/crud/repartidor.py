from sqlalchemy.orm import Session
from models.repartidor import Repartidor
from schemas import RepartidorCreate

def create_repartidor(db: Session, repartidor: RepartidorCreate):
    """Crear nuevo repartidor"""
    nuevo = Repartidor(**repartidor.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

def get_repartidores(db: Session, skip: int = 0, limit: int = 100):
    """Obtener todos los repartidores con paginación"""
    return db.query(Repartidor).offset(skip).limit(limit).all()

def get_repartidor(db: Session, repartidor_id: int):
    """Obtener repartidor por ID"""
    return db.query(Repartidor).filter(Repartidor.id == repartidor_id).first()

def update_repartidor(db: Session, repartidor_id: int, repartidor_data: RepartidorCreate):
    """Actualizar repartidor existente"""
    repartidor = get_repartidor(db, repartidor_id)
    if repartidor:
        for key, value in repartidor_data.dict().items():
            setattr(repartidor, key, value)
        db.commit()
        db.refresh(repartidor)
    return repartidor

def delete_repartidor(db: Session, repartidor_id: int):
    """Eliminar repartidor"""
    repartidor = get_repartidor(db, repartidor_id)
    if repartidor:
        db.delete(repartidor)
        db.commit()
        return True
    return False