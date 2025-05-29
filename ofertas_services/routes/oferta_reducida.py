from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from crud.oferta_reducida import (
    create_oferta_reducida,
    get_oferta_reducida,
    get_ofertas_reducidas,
    update_oferta_reducida,
    delete_oferta_reducida
)
from schemas import OfertaReducidaCreate, OfertaReducidaOut

router = APIRouter(prefix="/ofertas-reducidas", tags=["OfertasReducidas"])

@router.post("/", response_model=OfertaReducidaOut)
def crear_oferta(oferta: OfertaReducidaCreate, db: Session = Depends(get_db)):
    return create_oferta_reducida(db, oferta)

@router.get("/{oferta_id}", response_model=OfertaReducidaOut)
def leer_oferta(oferta_id: int, db: Session = Depends(get_db)):
    db_oferta = get_oferta_reducida(db, oferta_id)
    if not db_oferta:
        raise HTTPException(status_code=404, detail="Oferta no encontrada")
    return db_oferta

@router.get("/", response_model=List[OfertaReducidaOut])
def leer_ofertas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_ofertas_reducidas(db, skip, limit)

@router.put("/{oferta_id}", response_model=OfertaReducidaOut)
def actualizar_oferta(oferta_id: int, oferta: OfertaReducidaCreate, db: Session = Depends(get_db)):
    db_oferta = update_oferta_reducida(db, oferta_id, oferta)
    if not db_oferta:
        raise HTTPException(status_code=404, detail="Oferta no encontrada")
    return db_oferta

@router.delete("/{oferta_id}")
def eliminar_oferta(oferta_id: int, db: Session = Depends(get_db)):
    success = delete_oferta_reducida(db, oferta_id)
    if not success:
        raise HTTPException(status_code=404, detail="Oferta no encontrada")
    return {"detail": "Oferta eliminada"}
