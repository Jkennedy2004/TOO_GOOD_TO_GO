from fastapi import FastAPI, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

# Importa engine y Base directamente desde database.py
from database import engine, Base, get_db

# Importa los routers desde la carpeta routes
from routes import (
    inventario_producto,
    oferta_reducida,
    repartidor,
    entrega,
    ruta_entrega,
)

app = FastAPI(
    title="Too Good To Go - API de Ofertas",
    description="API para gestionar inventario, ofertas, repartidores y entregas",
    version="1.0.0"
)

# Crear tablas en la base de datos (si no usas migraciones)
Base.metadata.create_all(bind=engine)

# Endpoint de salud
@app.get("/")
def health_check():
    return {
        "message": "API Too Good To Go funcionando correctamente",
        "status": "healthy",
        "version": "1.0.0"
    }

@app.get("/health")
def detailed_health_check(db: Session = Depends(get_db)):
    try:
        # Verificar conexión a la base de datos
        db.execute(text("SELECT 1"))  # ✅ Correcto
        return {
            "status": "healthy",
            "database": "connected",
            "message": "Todos los servicios funcionando correctamente"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }

# Incluye los routers
app.include_router(inventario_producto.router)
app.include_router(oferta_reducida.router)
app.include_router(repartidor.router)
app.include_router(entrega.router)
app.include_router(ruta_entrega.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)