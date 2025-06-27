from sqlalchemy.orm import Session, selectinload
from models.inventario_producto import InventarioProducto
from schemas import InventarioProductoCreate

def create_inventario_producto(db: Session, producto: InventarioProductoCreate):
    """Crear nuevo producto en inventario"""
    nuevo = InventarioProducto(**producto.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

def get_inventario_productos(db: Session, skip: int = 0, limit: int = 100):
    """Obtener todos los productos con paginación"""
    return db.query(InventarioProducto).offset(skip).limit(limit).all()

def get_inventario_productos_con_ofertas(db: Session, skip: int = 0, limit: int = 100):
    """Obtener todos los productos con sus ofertas asociadas"""
    return (
        db.query(InventarioProducto)
        .options(selectinload(InventarioProducto.ofertas_reducidas))
        .offset(skip)
        .limit(limit)
        .all()
    )

def get_inventario_producto(db: Session, producto_id: int):
    """Obtener producto por ID"""
    return db.query(InventarioProducto).filter(InventarioProducto.id == producto_id).first()

def update_inventario_producto(db: Session, producto_id: int, producto_data: InventarioProductoCreate):
    """Actualizar producto existente"""
    producto = get_inventario_producto(db, producto_id)
    if producto:
        for key, value in producto_data.dict().items():
            setattr(producto, key, value)
        db.commit()
        db.refresh(producto)
    return producto

def delete_inventario_producto(db: Session, producto_id: int):
    """Eliminar producto"""
    producto = get_inventario_producto(db, producto_id)
    if producto:
        db.delete(producto)
        db.commit()
        return True
    return False
