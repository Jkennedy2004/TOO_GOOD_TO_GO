from fastapi import FastAPI

# Importa engine y Base directamente desde database.py
from database import engine, Base

# Importa los routers desde la carpeta routes (ajusta si está en otro lugar)
from routes import (
    inventario_producto,
    oferta_reducida,
    repartidor,
    reporte_logistica,
    ruta_entrega,
)

app = FastAPI()

# Crear tablas en la base de datos (si no usas migraciones)
Base.metadata.create_all(bind=engine)

# Incluye los routers
app.include_router(inventario_producto.router)
app.include_router(oferta_reducida.router)
app.include_router(repartidor.router)
app.include_router(reporte_logistica.router)
app.include_router(ruta_entrega.router)
