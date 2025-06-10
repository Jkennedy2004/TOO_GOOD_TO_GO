from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from crud.reporte_logistica import (
    create_reporte_logistica,
    get_reporte_logistica,
    get_reportes_logistica,
    update_reporte_logistica,
    delete_reporte_logistica
)
from schemas import ReporteLogisticaCreate, ReporteLogisticaOut

router = APIRouter(prefix="/reportes-logistica", tags=["ReportesLogistica"])

@router.post("/", response_model=ReporteLogisticaOut)
def crear_reporte(reporte: ReporteLogisticaCreate, db: Session = Depends(get_db)):
    return create_reporte_logistica(db, reporte)

@router.get("/{reporte_id}", response_model=ReporteLogisticaOut)
def leer_reporte(reporte_id: int, db: Session = Depends(get_db)):
    db_reporte = get_reporte_logistica(db, reporte_id)
    if not db_reporte:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")
    return db_reporte

@router.get("/", response_model=List[ReporteLogisticaOut])
def leer_reportes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_reportes_logistica(db, skip, limit)

@router.put("/{reporte_id}", response_model=ReporteLogisticaOut)
def actualizar_reporte(reporte_id: int, reporte: ReporteLogisticaCreate, db: Session = Depends(get_db)):
    db_reporte = update_reporte_logistica(db, reporte_id, reporte)
    if not db_reporte:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")
    return db_reporte

@router.delete("/{reporte_id}")
def eliminar_reporte(reporte_id: int, db: Session = Depends(get_db)):
    success = delete_reporte_logistica(db, reporte_id)
    if not success:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")
    return {"detail": "Reporte eliminado"}
