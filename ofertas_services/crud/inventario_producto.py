from sqlalchemy.orm import Session
from models.inventario_producto import InventarioProducto
from schemas import InventarioProductoCreate

def crear_producto(db: Session, producto: InventarioProductoCreate):
    nuevo = InventarioProducto(**producto.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

def obtener_todos(db: Session):
    return db.query(InventarioProducto).all()

def obtener_por_id(db: Session, producto_id: int):
    return db.query(InventarioProducto).filter(InventarioProducto.id == producto_id).first()

def actualizar_producto(db: Session, producto_id: int, datos: dict):
    producto = obtener_por_id(db, producto_id)
    if producto:
        for key, value in datos.items():
            setattr(producto, key, value)
        db.commit()
        db.refresh(producto)
    return producto

def eliminar_producto(db: Session, producto_id: int):
    producto = obtener_por_id(db, producto_id)
    if producto:
        db.delete(producto)
        db.commit()
    return producto
