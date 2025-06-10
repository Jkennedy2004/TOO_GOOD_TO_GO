import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from datetime import datetime, timedelta
from database import SessionLocal
from models.inventario_producto import InventarioProducto
from models.repartidor import Repartidor
from models.oferta_reducida import OfertaReducida
from models.entrega import Entrega
from models.ruta_entrega import RutaEntrega

def insertar_datos_prueba():
    """Insertar datos de prueba en todas las tablas"""
    db = SessionLocal()
    
    try:
        print("🔄 Insertando datos de prueba...")
        
        # 1. Productos de inventario
        productos = [
            InventarioProducto(
                nombre="Pan integral",
                cantidad=50,
                precio_unitario=2.50,
                fecha_ingreso=datetime.now() - timedelta(days=1),
                estado="Disponible"
            ),
            InventarioProducto(
                nombre="Croissants",
                cantidad=20,
                precio_unitario=1.80,
                fecha_ingreso=datetime.now() - timedelta(hours=12),
                estado="Disponible"
            ),
            InventarioProducto(
                nombre="Ensalada fresca",
                cantidad=15,
                precio_unitario=4.50,
                fecha_ingreso=datetime.now() - timedelta(hours=6),
                estado="Disponible"
            ),
            InventarioProducto(
                nombre="Sándwich jamón",
                cantidad=0,
                precio_unitario=3.20,
                fecha_ingreso=datetime.now() - timedelta(days=2),
                estado="Vendido"
            )
        ]
        
        for producto in productos:
            db.add(producto)
        
        db.commit()
        print("✅ Productos insertados")
        
        # 2. Repartidores
        repartidores = [
            Repartidor(
                nombre="Carlos Mendoza",
                telefono="0998765432",
                zona="Norte"
            ),
            Repartidor(
                nombre="Ana García",
                telefono="0987654321",
                zona="Sur"
            ),
            Repartidor(
                nombre="Luis Rodríguez",
                telefono="0976543210",
                zona="Centro"
            )
        ]
        
        for repartidor in repartidores:
            db.add(repartidor)
        
        db.commit()
        print("✅ Repartidores insertados")
        
        # 3. Ofertas reducidas
        ofertas = [
            OfertaReducida(
                producto_id=1,  # Pan integral
                precio_oferta=1.50,
                fecha_inicio=datetime.now(),
                fecha_fin=datetime.now() + timedelta(hours=6)
            ),
            OfertaReducida(
                producto_id=2,  # Croissants
                precio_oferta=1.00,
                fecha_inicio=datetime.now(),
                fecha_fin=datetime.now() + timedelta(hours=4)
            ),
            OfertaReducida(
                producto_id=3,  # Ensalada fresca
                precio_oferta=2.50,
                fecha_inicio=datetime.now(),
                fecha_fin=datetime.now() + timedelta(hours=8)
            )
        ]
        
        for oferta in ofertas:
            db.add(oferta)
        
        db.commit()
        print("✅ Ofertas insertadas")
        
        # 4. Entregas
        entregas = [
            Entrega(
                repartidor_id=1,
                fecha=datetime.now() + timedelta(hours=2),
                descripcion="Entrega de pan integral - Cliente preferente"
            ),
            Entrega(
                repartidor_id=2,
                fecha=datetime.now() + timedelta(hours=3),
                descripcion="Entrega múltiple - 3 productos"
            )
        ]
        
        for entrega in entregas:
            db.add(entrega)
        
        db.commit()
        print("✅ Entregas insertadas")
        
        # 5. Rutas de entrega
        rutas = [
            RutaEntrega(
                repartidor_id=1,
                destino="Av. Amazonas y Naciones Unidas",
                hora_salida=datetime.now() + timedelta(hours=1),
                hora_llegada=None
            ),
            RutaEntrega(
                repartidor_id=2,
                destino="Centro Comercial El Jardín",
                hora_salida=datetime.now() + timedelta(hours=2),
                hora_llegada=None
            ),
            RutaEntrega(
                repartidor_id=3,
                destino="Universidad Central",
                hora_salida=datetime.now() + timedelta(minutes=30),
                hora_llegada=datetime.now() + timedelta(hours=1, minutes=15)
            )
        ]
        
        for ruta in rutas:
            db.add(ruta)
        
        db.commit()
        print("✅ Rutas insertadas")
        
        print("\n🎉 ¡Todos los datos de prueba insertados exitosamente!")
        
        # Mostrar resumen
        print("\n📊 Resumen de datos insertados:")
        print(f"  - Productos: {len(productos)}")
        print(f"  - Repartidores: {len(repartidores)}")
        print(f"  - Ofertas: {len(ofertas)}")
        print(f"  - Entregas: {len(entregas)}")
        print(f"  - Rutas: {len(rutas)}")
        
    except Exception as e:
        print(f"❌ Error al insertar datos: {e}")
        db.rollback()
    
    finally:
        db.close()

if __name__ == "__main__":
    insertar_datos_prueba()