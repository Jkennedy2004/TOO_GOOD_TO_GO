from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# 1. InventarioProducto

class InventarioProductoBase(BaseModel):
    nombre: str
    cantidad: int
    precio_unitario: float
    fecha_ingreso: datetime
    estado: str

class InventarioProductoCreate(InventarioProductoBase):
    pass

class InventarioProductoOut(InventarioProductoBase):
    id: int

    class Config:
        orm_mode = True


# 2. OfertaReducida

class OfertaReducidaBase(BaseModel):
    producto_id: int
    precio_oferta: float
    fecha_inicio: datetime
    fecha_fin: datetime

class OfertaReducidaCreate(OfertaReducidaBase):
    pass

class OfertaReducidaOut(OfertaReducidaBase):
    id: int
    # Para simplificar, devolvemos solo el id del producto relacionado
    # Si quieres detalles del producto, puedes crear otro esquema con nested

    class Config:
        orm_mode = True


# 3. Repartidor

class RepartidorBase(BaseModel):
    nombre: str
    telefono: str
    zona: Optional[str] = None

class RepartidorCreate(RepartidorBase):
    pass

class RepartidorOut(RepartidorBase):
    id: int

    class Config:
        orm_mode = True


# 4. Entrega

class EntregaBase(BaseModel):
    repartidor_id: int
    fecha: datetime
    descripcion: Optional[str] = None

class EntregaCreate(EntregaBase):
    pass

class EntregaOut(EntregaBase):
    id: int

    class Config:
        orm_mode = True


# 5. RutaEntrega

class RutaEntregaBase(BaseModel):
    repartidor_id: int
    destino: str
    hora_salida: datetime
    hora_llegada: Optional[datetime] = None

class RutaEntregaCreate(RutaEntregaBase):
    pass

class RutaEntregaOut(RutaEntregaBase):
    id: int

    class Config:
        orm_mode = True