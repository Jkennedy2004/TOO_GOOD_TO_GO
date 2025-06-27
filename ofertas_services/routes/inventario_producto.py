from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from crud.inventario_producto import (
    create_inventario_producto,
    get_inventario_producto,
    get_inventario_productos_con_ofertas,  # Función para obtener productos con ofertas
    update_inventario_producto,
    delete_inventario_producto
)
from schemas import InventarioProductoCreate, InventarioProductoOut, InventarioProductoConOfertas  # Esquema con ofertas

router = APIRouter(prefix="/inventario-productos", tags=["InventarioProductos"])

@router.post("/", response_model=InventarioProductoOut)
def crear_inventario_producto(item: InventarioProductoCreate, db: Session = Depends(get_db)):
    return create_inventario_producto(db, item)

@router.get("/{item_id}", response_model=InventarioProductoOut)
def leer_inventario_producto(item_id: int, db: Session = Depends(get_db)):
    db_item = get_inventario_producto(db, item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return db_item

@router.get("/", response_model=List[InventarioProductoConOfertas])  # Cambiado para mostrar ofertas
def leer_inventario_productos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_inventario_productos_con_ofertas(db, skip, limit)

@router.put("/{item_id}", response_model=InventarioProductoOut)
def actualizar_inventario_producto(item_id: int, item: InventarioProductoCreate, db: Session = Depends(get_db)):
    db_item = update_inventario_producto(db, item_id, item)
    if not db_item:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return db_item

@router.delete("/{item_id}")
def eliminar_inventario_producto(item_id: int, db: Session = Depends(get_db)):
    success = delete_inventario_producto(db, item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return {"detail": "Producto eliminado"}
