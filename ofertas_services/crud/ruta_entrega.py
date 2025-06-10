from sqlalchemy.orm import Session
from models import RutaEntrega
from schemas import RutaEntregaCreate

def create_ruta_entrega(db: Session, ruta: RutaEntregaCreate):
    """Crear nueva ruta de entrega"""
    nueva = RutaEntrega(**ruta.dict())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

def get_rutas_entrega(db: Session, skip: int = 0, limit: int = 100):
    """Obtener todas las rutas con paginación"""
    return db.query(RutaEntrega).offset(skip).limit(limit).all()

def get_ruta_entrega(db: Session, ruta_id: int):
    """Obtener ruta por ID"""
    return db.query(RutaEntrega).filter(RutaEntrega.id == ruta_id).first()

def update_ruta_entrega(db: Session, ruta_id: int, ruta_data: RutaEntregaCreate):
    """Actualizar ruta existente"""
    ruta = get_ruta_entrega(db, ruta_id)
    if ruta:
        for key, value in ruta_data.dict().items():
            setattr(ruta, key, value)
        db.commit()
        db.refresh(ruta)
    return ruta

def delete_ruta_entrega(db: Session, ruta_id: int):
    """Eliminar ruta"""
    ruta = get_ruta_entrega(db, ruta_id)
    if ruta:
        db.delete(ruta)
        db.commit()
        return True
    return False