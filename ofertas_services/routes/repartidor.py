from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from crud.repartidor import (
    create_repartidor,
    get_repartidor,
    get_repartidores,
    update_repartidor,
    delete_repartidor
)
from schemas import RepartidorCreate, RepartidorOut

router = APIRouter(prefix="/repartidores", tags=["Repartidores"])

@router.post("/", response_model=RepartidorOut)
def crear_repartidor(repartidor: RepartidorCreate, db: Session = Depends(get_db)):
    return create_repartidor(db, repartidor)

@router.get("/{repartidor_id}", response_model=RepartidorOut)
def leer_repartidor(repartidor_id: int, db: Session = Depends(get_db)):
    db_repartidor = get_repartidor(db, repartidor_id)
    if not db_repartidor:
        raise HTTPException(status_code=404, detail="Repartidor no encontrado")
    return db_repartidor

@router.get("/", response_model=List[RepartidorOut])
def leer_repartidores(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_repartidores(db, skip, limit)

@router.put("/{repartidor_id}", response_model=RepartidorOut)
def actualizar_repartidor(repartidor_id: int, repartidor: RepartidorCreate, db: Session = Depends(get_db)):
    db_repartidor = update_repartidor(db, repartidor_id, repartidor)
    if not db_repartidor:
        raise HTTPException(status_code=404, detail="Repartidor no encontrado")
    return db_repartidor

@router.delete("/{repartidor_id}")
def eliminar_repartidor(repartidor_id: int, db: Session = Depends(get_db)):
    success = delete_repartidor(db, repartidor_id)
    if not success:
        raise HTTPException(status_code=404, detail="Repartidor no encontrado")
    return {"detail": "Repartidor eliminado"}
