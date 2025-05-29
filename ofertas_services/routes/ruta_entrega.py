from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from crud.ruta_entrega import (
    create_ruta_entrega,
    get_ruta_entrega,
    get_rutas_entrega,
    update_ruta_entrega,
    delete_ruta_entrega
)
from schemas import RutaEntregaCreate, RutaEntregaOut

router = APIRouter(prefix="/rutas-entrega", tags=["RutasEntrega"])

@router.post("/", response_model=RutaEntregaOut)
def crear_ruta(ruta: RutaEntregaCreate, db: Session = Depends(get_db)):
    return create_ruta_entrega(db, ruta)

@router.get("/{ruta_id}", response_model=RutaEntregaOut)
def leer_ruta(ruta_id: int, db: Session = Depends(get_db)):
    db_ruta = get_ruta_entrega(db, ruta_id)
    if not db_ruta:
        raise HTTPException(status_code=404, detail="Ruta no encontrada")
    return db_ruta

@router.get("/", response_model=List[RutaEntregaOut])
def leer_rutas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_rutas_entrega(db, skip, limit)

@router.put("/{ruta_id}", response_model=RutaEntregaOut)
def actualizar_ruta(ruta_id: int, ruta: RutaEntregaCreate, db: Session = Depends(get_db)):
    db_ruta = update_ruta_entrega(db, ruta_id, ruta)
    if not db_ruta:
        raise HTTPException(status_code=404, detail="Ruta no encontrada")
    return db_ruta

@router.delete("/{ruta_id}")
def eliminar_ruta(ruta_id: int, db: Session = Depends(get_db)):
    success = delete_ruta_entrega(db, ruta_id)
    if not success:
        raise HTTPException(status_code=404, detail="Ruta no encontrada")
    return {"detail": "Ruta eliminada"}
