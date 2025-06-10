from sqlalchemy.orm import Session
from models import OfertaReducida
from schemas import OfertaReducidaCreate

def create_oferta_reducida(db: Session, oferta: OfertaReducidaCreate):
    """Crear nueva oferta reducida"""
    nueva = OfertaReducida(**oferta.dict())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

def get_ofertas_reducidas(db: Session, skip: int = 0, limit: int = 100):
    """Obtener todas las ofertas con paginación"""
    return db.query(OfertaReducida).offset(skip).limit(limit).all()

def get_oferta_reducida(db: Session, oferta_id: int):
    """Obtener oferta por ID"""
    return db.query(OfertaReducida).filter(OfertaReducida.id == oferta_id).first()

def update_oferta_reducida(db: Session, oferta_id: int, oferta_data: OfertaReducidaCreate):
    """Actualizar oferta existente"""
    oferta = get_oferta_reducida(db, oferta_id)
    if oferta:
        for key, value in oferta_data.dict().items():
            setattr(oferta, key, value)
        db.commit()
        db.refresh(oferta)
    return oferta

def delete_oferta_reducida(db: Session, oferta_id: int):
    """Eliminar oferta"""
    oferta = get_oferta_reducida(db, oferta_id)
    if oferta:
        db.delete(oferta)
        db.commit()
        return True
    return False