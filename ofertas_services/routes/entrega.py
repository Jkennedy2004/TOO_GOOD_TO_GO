from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from crud.entrega import (
    crear_entrega,
    obtener_todas,
    obtener_por_id,
    actualizar_entrega,
    eliminar_entrega
)
from schemas import EntregaCreate, EntregaOut

router = APIRouter(prefix="/entregas", tags=["Entregas"])

@router.post("/", response_model=EntregaOut)
def crear_nueva_entrega(entrega: EntregaCreate, db: Session = Depends(get_db)):
    return crear_entrega(db, entrega)

@router.get("/{entrega_id}", response_model=EntregaOut)
def leer_entrega(entrega_id: int, db: Session = Depends(get_db)):
    db_entrega = obtener_por_id(db, entrega_id)
    if not db_entrega:
        raise HTTPException(status_code=404, detail="Entrega no encontrada")
    return db_entrega

@router.get("/", response_model=List[EntregaOut])
def leer_entregas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return obtener_todas(db)

@router.put("/{entrega_id}", response_model=EntregaOut)
def actualizar_entrega_endpoint(entrega_id: int, entrega: EntregaCreate, db: Session = Depends(get_db)):
    db_entrega = actualizar_entrega(db, entrega_id, entrega.dict())
    if not db_entrega:
        raise HTTPException(status_code=404, detail="Entrega no encontrada")
    return db_entrega

@router.delete("/{entrega_id}")
def eliminar_entrega_endpoint(entrega_id: int, db: Session = Depends(get_db)):
    entrega = eliminar_entrega(db, entrega_id)
    if not entrega:
        raise HTTPException(status_code=404, detail="Entrega no encontrada")
    return {"detail": "Entrega eliminada"}