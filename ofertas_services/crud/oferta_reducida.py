from sqlalchemy.orm import Session
from models import OfertaReducida
from schemas import OfertaReducidaCreate

def crear_oferta(db: Session, oferta: OfertaReducidaCreate):
    nueva = OfertaReducida(**oferta.dict())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

def obtener_todas(db: Session):
    return db.query(OfertaReducida).all()

def obtener_por_id(db: Session, oferta_id: int):
    return db.query(OfertaReducida).filter(OfertaReducida.id == oferta_id).first()

def actualizar_oferta(db: Session, oferta_id: int, datos: dict):
    oferta = obtener_por_id(db, oferta_id)
    if oferta:
        for key, value in datos.items():
            setattr(oferta, key, value)
        db.commit()
        db.refresh(oferta)
    return oferta

def eliminar_oferta(db: Session, oferta_id: int):
    oferta = obtener_por_id(db, oferta_id)
    if oferta:
        db.delete(oferta)
        db.commit()
    return oferta
