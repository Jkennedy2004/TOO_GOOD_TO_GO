import { Router, Request, Response } from "express";
import { AIRecommendationService } from "../services/aiRecommendations";
import { 
  buscarUsuarioPorId,
  listarProductosDisponibles,
  listarReservasPorUsuario,
  buscarProductoPorId
} from "../metodos";

const router = Router();
const aiService = new AIRecommendationService();

/**
 * POST /ai/recomendaciones
 * Genera recomendaciones personalizadas para un usuario
 */
router.post("/recomendaciones", async (req: Request, res: Response) => {
  try {
    const { usuario_id, preferencias } = req.body;

    if (!usuario_id) {
      return res.status(400).json({
        success: false,
        message: "ID de usuario es requerido"
      });
    }

    // Obtener datos del usuario
    const usuario = await buscarUsuarioPorId(usuario_id);
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    // Obtener productos disponibles
    const productos = await listarProductosDisponibles();
    
    // Obtener historial de reservas del usuario
    const historialReservas = await listarReservasPorUsuario(usuario_id);

    // Generar recomendaciones
    const recomendaciones = await aiService.generarRecomendaciones(
      usuario, 
      productos, 
      historialReservas,
      preferencias
    );

    res.json({
      success: true,
      message: "Recomendaciones generadas exitosamente",
      data: {
        usuario: {
          id: usuario.id_usuario,
          nombre: usuario.nombre
        },
        total_recomendaciones: recomendaciones.length,
        recomendaciones: recomendaciones.map(rec => ({
          producto: {
            id: rec.producto.id_producto,
            nombre: rec.producto.nombre,
            descripcion: rec.producto.descripcion,
            precio_original: rec.producto.precio_original,
            precio_descuento: rec.producto.precio_descuento,
            cantidad_disponible: rec.producto.cantidad_disponible,
            fecha_caducidad: rec.producto.fecha_caducidad,
            imagen_url: rec.producto.imagen_url,
            restaurante: {
              id: rec.producto.restaurante.id_restaurante,
              nombre: rec.producto.restaurante.nombre,
              tipo_cocina: rec.producto.restaurante.tipo_cocina,
              direccion: rec.producto.restaurante.direccion
            }
          },
          puntuacion: Math.round(rec.puntuacion),
          razones: rec.razones,
          descuento_porcentaje: Math.round(
            ((Number(rec.producto.precio_original) - Number(rec.producto.precio_descuento)) / 
             Number(rec.producto.precio_original)) * 100
          )
        }))
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al generar recomendaciones",
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * GET /ai/recomendaciones/:usuario_id/explicacion/:producto_id
 * Obtiene explicación detallada de por qué se recomienda un producto
 */
router.get("/recomendaciones/:usuario_id/explicacion/:producto_id", async (req: Request, res: Response) => {
  try {
    const { usuario_id, producto_id } = req.params;

    const usuario = await buscarUsuarioPorId(parseInt(usuario_id));
    const producto = await buscarProductoPorId(parseInt(producto_id));

    if (!usuario || !producto) {
      return res.status(404).json({
        success: false,
        message: "Usuario o producto no encontrado"
      });
    }

    const productos = [producto];
    const historial = await listarReservasPorUsuario(parseInt(usuario_id));
    
    const recomendaciones = await aiService.generarRecomendaciones(
      usuario, 
      productos, 
      historial
    );

    if (recomendaciones.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se pudo generar recomendación para este producto"
      });
    }

    const explicacion = aiService.generarExplicacionRecomendacion(recomendaciones[0]);

    res.json({
      success: true,
      data: {
        producto_id: parseInt(producto_id),
        usuario_id: parseInt(usuario_id),
        explicacion,
        puntuacion: Math.round(recomendaciones[0].puntuacion),
        factores: recomendaciones[0].razones
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al generar explicación",
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * GET /ai/productos-similares/:producto_id
 * Encuentra productos similares a uno dado
 */
router.get("/productos-similares/:producto_id", async (req: Request, res: Response) => {
  try {
    const { producto_id } = req.params;

    const productoBase = await buscarProductoPorId(parseInt(producto_id));
    if (!productoBase) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado"
      });
    }

    const todosProductos = await listarProductosDisponibles();
    const productosSimilares = await aiService.encontrarProductosSimilares(
      productoBase, 
      todosProductos
    );

    res.json({
      success: true,
      data: {
        producto_base: {
          id: productoBase.id_producto,
          nombre: productoBase.nombre,
          tipo_cocina: productoBase.restaurante.tipo_cocina
        },
        productos_similares: productosSimilares.map(p => ({
          id: p.id_producto,
          nombre: p.nombre,
          precio_original: p.precio_original,
          precio_descuento: p.precio_descuento,
          cantidad_disponible: p.cantidad_disponible,
          restaurante: {
            nombre: p.restaurante.nombre,
            tipo_cocina: p.restaurante.tipo_cocina
          }
        }))
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al buscar productos similares",
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * POST /ai/preferencias/:usuario_id
 * Guarda las preferencias del usuario para futuras recomendaciones
 */
router.post("/preferencias/:usuario_id", async (req: Request, res: Response) => {
  try {
    const { usuario_id } = req.params;
    const preferencias = req.body;

    const usuario = await buscarUsuarioPorId(parseInt(usuario_id));
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    // En un sistema real, guardarías estas preferencias en la base de datos
    // Por ahora, simplemente las retornamos como confirmación
    res.json({
      success: true,
      message: "Preferencias guardadas exitosamente",
      data: {
        usuario_id: parseInt(usuario_id),
        preferencias_guardadas: {
          tipos_cocina_favoritos: preferencias.tipos_cocina_favoritos || [],
          precio_maximo: preferencias.precio_maximo || 20,
          distancia_maxima: preferencias.distancia_maxima || 10,
          horarios_preferidos: preferencias.horarios_preferidos || ["18:00-22:00"],
          productos_evitar: preferencias.productos_evitar || []
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al guardar preferencias",
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * GET /ai/estadisticas/:usuario_id
 * Proporciona estadísticas de uso y recomendaciones para el usuario
 */
router.get("/estadisticas/:usuario_id", async (req: Request, res: Response) => {
  try {
    const { usuario_id } = req.params;

    const usuario = await buscarUsuarioPorId(parseInt(usuario_id));
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado"
      });
    }

    const historial = await listarReservasPorUsuario(parseInt(usuario_id));
    
    // Calcular estadísticas
    const totalReservas = historial.length;
    const totalGastado = historial.reduce((total, reserva) => 
      total + Number(reserva.precio_total), 0
    );
    
    const tiposCocina: { [key: string]: number } = {};
    const restaurantesFavoritos: { [key: string]: number } = {};
    
    historial.forEach(reserva => {
      if (reserva.producto?.restaurante) {
        const tipo = reserva.producto.restaurante.tipo_cocina;
        const restaurante = reserva.producto.restaurante.nombre;
        
        tiposCocina[tipo] = (tiposCocina[tipo] || 0) + 1;
        restaurantesFavoritos[restaurante] = (restaurantesFavoritos[restaurante] || 0) + 1;
      }
    });

    const tipoFavorito = Object.entries(tiposCocina)
      .sort(([,a], [,b]) => b - a)[0];
    
    const restauranteFavorito = Object.entries(restaurantesFavoritos)
      .sort(([,a], [,b]) => b - a)[0];

    res.json({
      success: true,
      data: {
        usuario: {
          id: usuario.id_usuario,
          nombre: usuario.nombre,
          fecha_registro: usuario.fecha_registro
        },
        estadisticas: {
          total_reservas: totalReservas,
          total_gastado: Math.round(totalGastado * 100) / 100,
          gasto_promedio: totalReservas > 0 ? Math.round((totalGastado / totalReservas) * 100) / 100 : 0,
          tipo_cocina_favorito: tipoFavorito ? tipoFavorito[0] : "No disponible",
          restaurante_favorito: restauranteFavorito ? restauranteFavorito[0] : "No disponible",
          tipos_cocina_probados: Object.keys(tiposCocina).length,
          restaurantes_visitados: Object.keys(restaurantesFavoritos).length
        },
        recomendacion_ia: totalReservas >= 3 
          ? "Tienes suficiente historial para recomendaciones personalizadas"
          : "Realiza más reservas para obtener mejores recomendaciones"
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas",
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;