from pydantic import BaseModel, field_validator, model_validator, Field
from typing import Optional
from datetime import datetime


# 1. InventarioProducto

class InventarioProductoBase(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=200, description="Nombre del producto")
    cantidad: int = Field(..., ge=0, description="Cantidad disponible")
    precio_unitario: float = Field(..., gt=0, description="Precio unitario del producto")
    fecha_ingreso: datetime = Field(..., description="Fecha de ingreso al inventario")
    estado: str = Field(..., description="Estado del producto")

    @field_validator('estado')
    @classmethod
    def estado_must_be_valid(cls, v: str) -> str:
        valid_states = ['Disponible', 'Vendido', 'Expirado']
        if v not in valid_states:
            raise ValueError(f'Estado debe ser uno de: {valid_states}')
        return v

class InventarioProductoCreate(InventarioProductoBase):
    pass

class InventarioProductoOut(InventarioProductoBase):
    id: int

    class Config:
        from_attributes = True


# 2. OfertaReducida

class OfertaReducidaBase(BaseModel):
    producto_id: int = Field(..., gt=0, description="ID del producto en oferta")
    precio_oferta: float = Field(..., gt=0, description="Precio con descuento")
    fecha_inicio: datetime = Field(..., description="Fecha de inicio de la oferta")
    fecha_fin: datetime = Field(..., description="Fecha de fin de la oferta")

    @model_validator(mode='after')
    def validate_fechas(self):
        if self.fecha_fin <= self.fecha_inicio:
            raise ValueError('La fecha de fin debe ser posterior a la fecha de inicio')
        return self

class OfertaReducidaCreate(OfertaReducidaBase):
    pass

class OfertaReducidaOut(OfertaReducidaBase):
    id: int

    class Config:
        from_attributes = True


# 3. Repartidor

class RepartidorBase(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=100, description="Nombre completo del repartidor")
    telefono: str = Field(..., min_length=8, max_length=15, description="Número de teléfono")
    zona: Optional[str] = Field(None, max_length=50, description="Zona de trabajo")

    @field_validator('telefono')
    @classmethod
    def telefono_must_be_valid(cls, v: str) -> str:
        # Remover espacios y caracteres especiales para validación básica
        clean_phone = ''.join(filter(str.isdigit, v))
        if len(clean_phone) < 8:
            raise ValueError('El teléfono debe tener al menos 8 dígitos')
        return v

class RepartidorCreate(RepartidorBase):
    pass

class RepartidorOut(RepartidorBase):
    id: int

    class Config:
        from_attributes = True


# 4. Entrega

class EntregaBase(BaseModel):
    repartidor_id: int = Field(..., gt=0, description="ID del repartidor asignado")
    fecha: datetime = Field(..., description="Fecha y hora de la entrega")
    descripcion: Optional[str] = Field(None, max_length=500, description="Descripción adicional de la entrega")

    @field_validator('fecha')
    @classmethod
    def fecha_no_puede_ser_futura_lejana(cls, v: datetime) -> datetime:
        # Permitir fechas hasta 1 año en el futuro
        from datetime import datetime, timedelta
        max_future_date = datetime.now() + timedelta(days=365)
        if v > max_future_date:
            raise ValueError('La fecha no puede ser más de un año en el futuro')
        return v

class EntregaCreate(EntregaBase):
    pass

class EntregaOut(EntregaBase):
    id: int

    class Config:
        from_attributes = True


# 5. RutaEntrega

class RutaEntregaBase(BaseModel):
    repartidor_id: int = Field(..., gt=0, description="ID del repartidor asignado")
    destino: str = Field(..., min_length=1, max_length=200, description="Dirección de destino")
    hora_salida: datetime = Field(..., description="Hora programada de salida")
    hora_llegada: Optional[datetime] = Field(None, description="Hora real de llegada")

    @model_validator(mode='after')
    def validate_horas(self):
        if self.hora_llegada is not None and self.hora_llegada <= self.hora_salida:
            raise ValueError('La hora de llegada debe ser posterior a la hora de salida')
        return self

class RutaEntregaCreate(RutaEntregaBase):
    pass

class RutaEntregaOut(RutaEntregaBase):
    id: int

    class Config:
        from_attributes = True


# 6. Esquemas adicionales para respuestas con relaciones (Opcional)

class RepartidorConEntregas(RepartidorOut):
    """Repartidor con sus entregas asociadas"""
    entregas: list[EntregaOut] = []

class RepartidorConRutas(RepartidorOut):
    """Repartidor con sus rutas asociadas"""
    rutas: list[RutaEntregaOut] = []

class InventarioProductoConOfertas(InventarioProductoOut):
    """Producto con sus ofertas asociadas"""
    ofertas: list[OfertaReducidaOut] = []


# 7. Esquemas para respuestas de error

class ErrorResponse(BaseModel):
    detail: str
    error_code: Optional[str] = None

class ValidationErrorResponse(BaseModel):
    detail: str
    errors: list[dict]


# 8. Esquemas para operaciones en lote (Opcional)

class BulkDeleteResponse(BaseModel):
    deleted_count: int
    message: str

class BulkUpdateResponse(BaseModel):
    updated_count: int
    message: str